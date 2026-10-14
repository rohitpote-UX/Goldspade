import fs from "fs";
import path from "path";
import os from "os";
import { isDatabaseConfigured, query } from "./client";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
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

const LOCAL_DB_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, "inquiries.json");
const TMP_DB_FILE = path.join(os.tmpdir(), "goldspade_inquiries.json");

function getWritableFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return TMP_DB_FILE;
  }
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.accessSync(LOCAL_DB_DIR, fs.constants.W_OK);
    return LOCAL_DB_FILE;
  } catch {
    return TMP_DB_FILE;
  }
}

function readFileInquiries(): InquiryRecord[] {
  const map = new Map<string, InquiryRecord>();

  // 1. Read bundled repository data/inquiries.json
  if (fs.existsSync(LOCAL_DB_FILE)) {
    try {
      const raw = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      const list = JSON.parse(raw) as InquiryRecord[];
      list.forEach((item) => {
        if (item && item.id) map.set(item.id, item);
      });
    } catch (e) {
      console.error("[Read bundled inquiries.json Error]:", e);
    }
  }

  // 2. Read runtime tmp file if separate
  if (TMP_DB_FILE !== LOCAL_DB_FILE && fs.existsSync(TMP_DB_FILE)) {
    try {
      const raw = fs.readFileSync(TMP_DB_FILE, "utf-8");
      const list = JSON.parse(raw) as InquiryRecord[];
      list.forEach((item) => {
        if (item && item.id) map.set(item.id, item);
      });
    } catch (e) {
      console.error("[Read tmp inquiries.json Error]:", e);
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function writeFileInquiries(records: InquiryRecord[]): void {
  const targetPath = getWritableFilePath();
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${targetPath}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), "utf-8");
    fs.renameSync(tempFile, targetPath);
  } catch (err) {
    // If writing to local dir failed, attempt writing to /tmp
    if (targetPath !== TMP_DB_FILE) {
      try {
        const tempFile = `${TMP_DB_FILE}.${Date.now()}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), "utf-8");
        fs.renameSync(tempFile, TMP_DB_FILE);
        return;
      } catch (tmpErr) {
        console.error("[Fallback File Write Error]:", tmpErr);
        throw new Error("Persistent storage error: File system is read-only.");
      }
    }
    console.error("[File Write Error]:", err);
    throw new Error("Persistent storage error: Unable to write inquiry to disk.");
  }
}

export function normalizeStatus(status?: string): InquiryStatus {
  if (!status) return "NEW";
  const upper = status.toUpperCase().replace(/\s+/g, "_");
  const valid: InquiryStatus[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
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
 * Saves an inquiry record to PostgreSQL if configured, or durable file storage as fallback.
 * Throws an explicit error if neither persistent store succeeds.
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
      // Fall through to file fallback if Postgres connection encounters an issue
    }
  }

  // File-based persistence fallback
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
    const existing = readFileInquiries();
    // Check if duplicate ID exists
    const filtered = existing.filter((i) => i.id !== id);
    filtered.unshift(record);
    writeFileInquiries(filtered);
    return record;
  } catch (error) {
    console.error("[File Storage Save Error]:", error);
    throw new Error(
      "Failed to persist inquiry to storage. Database is unconfigured and filesystem is unavailable."
    );
  }
}

/**
 * Updates the email delivery status for an existing inquiry.
 */
export async function updateInquiryEmailStatus(
  id: string,
  status: "sent" | "failed" | "queued" | "unconfigured"
): Promise<void> {
  if (isDatabaseConfigured()) {
    try {
      await query(`UPDATE inquiries SET email_status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
      return;
    } catch (err) {
      console.error("[PostgreSQL Inquiry Email Status Update Error]:", err);
    }
  }

  try {
    const list = readFileInquiries();
    const target = list.find((item) => item.id === id);
    if (target) {
      target.emailStatus = status;
      target.updatedAt = new Date().toISOString();
      writeFileInquiries(list);
    }
  } catch (err) {
    console.error("[File DB Email Status Update Error]:", err);
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

  try {
    const list = readFileInquiries();
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
    console.error("[Inquiry Read Error]:", error);
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
    const list = readFileInquiries();
    const target = list.find((item) => item.id === id);
    if (target) {
      target.status = normalized;
      target.updatedAt = now;
      writeFileInquiries(list);
      return true;
    }
  } catch (err) {
    console.error("[File DB Status Update Error]:", err);
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
    const list = readFileInquiries();
    const target = list.find((item) => item.id === id);
    if (target) {
      target.notes = notes;
      target.updatedAt = now;
      writeFileInquiries(list);
      return true;
    }
  } catch (err) {
    console.error("[File DB Notes Update Error]:", err);
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
    const list = readFileInquiries();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length !== list.length) {
      writeFileInquiries(filtered);
      return true;
    }
  } catch (err) {
    console.error("[File DB Delete Error]:", err);
  }
  return false;
}

