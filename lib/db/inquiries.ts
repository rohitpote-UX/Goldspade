import fs from "fs";
import path from "path";
import { isDatabaseConfigured, query } from "./client";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "CONVERTED"
  | "ARCHIVED"
  | "IN_DISCUSSION"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  companyProject: string;
  budget: string;
  overview: string;
  status: InquiryStatus;
  notes?: string;
  source?: string;
  ip?: string;
  emailStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  companyProject?: string;
  budget?: string;
  overview: string;
  ip?: string;
  source?: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "inquiries.json");

function ensureDevDbExists(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("[Dev Database Init Error]:", error);
  }
}

function normalizeStatus(status?: string): InquiryStatus {
  if (!status) return "NEW";
  const upper = status.toUpperCase().replace(/\s+/g, "_");
  const valid: InquiryStatus[] = [
    "NEW",
    "CONTACTED",
    "IN_PROGRESS",
    "CONVERTED",
    "ARCHIVED",
    "IN_DISCUSSION",
    "PROPOSAL_SENT",
    "WON",
    "LOST",
  ];
  return valid.includes(upper as InquiryStatus) ? (upper as InquiryStatus) : "NEW";
}

/**
 * Saves an inquiry record to PostgreSQL if configured, or dev JSON storage as fallback.
 */
export async function saveInquiry(input: CreateInquiryInput): Promise<InquiryRecord> {
  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const companyProject = (input.companyProject || "").trim();
  const budget = (input.budget || "").trim();
  const overview = input.overview.trim();
  const ip = input.ip || "127.0.0.1";
  const source = input.source || "website_contact";
  const status: InquiryStatus = "NEW";

  if (isDatabaseConfigured()) {
    try {
      const sql = `
        INSERT INTO inquiries (id, name, email, company_project, budget, overview, status, source, ip, email_status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
        RETURNING id, name, email, company_project, budget, overview, status, source, ip, email_status, metadata, created_at, updated_at;
      `;
      const values = [id, name, email, companyProject, budget, overview, status, source, ip, "pending", now];
      const result = await query(sql, values);
      const row = result.rows[0];

      return {
        id: row.id,
        name: row.name,
        email: row.email,
        companyProject: row.company_project || "",
        budget: row.budget || "",
        overview: row.overview || "",
        status: normalizeStatus(row.status),
        notes: row.metadata?.notes || "",
        source: row.source,
        ip: row.ip,
        emailStatus: row.email_status,
        createdAt: new Date(row.created_at).toISOString(),
        updatedAt: new Date(row.updated_at || row.created_at).toISOString(),
      };
    } catch (dbError) {
      console.error("[PostgreSQL Inquiry Save Error]:", dbError);
      // Fall through to JSON storage fallback if Postgres fails
    }
  }

  // Development file-based fallback
  ensureDevDbExists();
  const record: InquiryRecord = {
    id,
    name,
    email,
    companyProject,
    budget,
    overview,
    status,
    notes: "",
    source,
    ip,
    emailStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };

  try {
    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    const existing = JSON.parse(rawData) as InquiryRecord[];
    existing.unshift(record);

    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(existing, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);

    return record;
  } catch (error) {
    console.error("[Dev DB Save Error]:", error);
    return record;
  }
}

/**
 * Updates the email delivery status for an existing inquiry.
 */
export async function updateInquiryEmailStatus(id: string, status: "sent" | "failed" | "queued"): Promise<void> {
  if (isDatabaseConfigured()) {
    try {
      await query(`UPDATE inquiries SET email_status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
      return;
    } catch (err) {
      console.error("[PostgreSQL Inquiry Email Status Update Error]:", err);
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, "utf-8");
      const list = JSON.parse(rawData) as InquiryRecord[];
      const target = list.find((item) => item.id === id);
      if (target) {
        target.emailStatus = status;
        target.updatedAt = new Date().toISOString();
        fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), "utf-8");
      }
    }
  } catch (err) {
    console.error("[Dev DB Status Update Error]:", err);
  }
}

/**
 * Reads all stored inquiries with normalized statuses.
 */
export async function getInquiries(): Promise<InquiryRecord[]> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query(
        `SELECT id, name, email, company_project, budget, overview, status, source, ip, email_status, metadata, created_at, updated_at 
         FROM inquiries 
         ORDER BY created_at DESC 
         LIMIT 200`
      );
      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        companyProject: row.company_project || "",
        budget: row.budget || "",
        overview: row.overview || "",
        status: normalizeStatus(row.status),
        notes: row.metadata?.notes || "",
        source: row.source,
        ip: row.ip,
        emailStatus: row.email_status,
        createdAt: new Date(row.created_at).toISOString(),
        updatedAt: new Date(row.updated_at || row.created_at).toISOString(),
      }));
    } catch (err) {
      console.error("[PostgreSQL Read Error]:", err);
    }
  }

  ensureDevDbExists();
  try {
    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    const list = JSON.parse(rawData) as Array<Partial<InquiryRecord>>;
    return list.map((item) => ({
      id: item.id || `inq_${Date.now()}`,
      name: item.name || "Anonymous",
      email: item.email || "unknown@example.com",
      companyProject: item.companyProject || (item as unknown as { company?: string }).company || "",
      budget: item.budget || "",
      overview: item.overview || (item as unknown as { message?: string }).message || "",
      status: normalizeStatus(item.status),
      notes: item.notes || "",
      source: item.source || "website_contact",
      ip: item.ip || "127.0.0.1",
      emailStatus: item.emailStatus || "pending",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("[Dev Database Read Error]:", error);
    return [];
  }
}

/**
 * Finds a single inquiry by ID.
 */
export async function getInquiryById(id: string): Promise<InquiryRecord | null> {
  const all = await getInquiries();
  return all.find((item) => item.id === id) || null;
}

/**
 * Updates the status of an inquiry.
 */
export async function updateInquiryStatus(id: string, newStatus: InquiryStatus): Promise<boolean> {
  const normalized = normalizeStatus(newStatus);
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      const res = await query(`UPDATE inquiries SET status = $1, updated_at = NOW() WHERE id = $2`, [normalized, id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[PostgreSQL Status Update Error]:", err);
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, "utf-8");
      const list = JSON.parse(rawData) as InquiryRecord[];
      const target = list.find((item) => item.id === id);
      if (target) {
        target.status = normalized;
        target.updatedAt = now;
        fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), "utf-8");
        return true;
      }
    }
  } catch (err) {
    console.error("[Dev DB Status Update Error]:", err);
  }
  return false;
}

/**
 * Updates the private internal notes for an inquiry.
 */
export async function updateInquiryNotes(id: string, notes: string): Promise<boolean> {
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      const res = await query(
        `UPDATE inquiries SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{notes}', $1::jsonb), updated_at = NOW() WHERE id = $2`,
        [JSON.stringify(notes), id]
      );
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[PostgreSQL Notes Update Error]:", err);
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, "utf-8");
      const list = JSON.parse(rawData) as InquiryRecord[];
      const target = list.find((item) => item.id === id);
      if (target) {
        target.notes = notes;
        target.updatedAt = now;
        fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), "utf-8");
        return true;
      }
    }
  } catch (err) {
    console.error("[Dev DB Notes Update Error]:", err);
  }
  return false;
}

/**
 * Deletes an inquiry (Admin only).
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    try {
      const res = await query(`DELETE FROM inquiries WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[PostgreSQL Delete Error]:", err);
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, "utf-8");
      const list = JSON.parse(rawData) as InquiryRecord[];
      const filtered = list.filter((item) => item.id !== id);
      fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), "utf-8");
      return true;
    }
  } catch (err) {
    console.error("[Dev DB Delete Error]:", err);
  }
  return false;
}
