import fs from "fs";
import path from "path";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  companyProject: string;
  budget: string;
  overview: string;
  createdAt: string;
  status: "new" | "processed" | "flagged";
  ip?: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  companyProject?: string;
  budget?: string;
  overview: string;
  ip?: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "inquiries.json");

/**
 * Ensures the database directory and storage file exist.
 */
function ensureDbExists(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("[Database Init Error]:", error);
  }
}

/**
 * Reads all stored inquiries from the database.
 */
export async function getInquiries(): Promise<InquiryRecord[]> {
  ensureDbExists();
  try {
    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(rawData) as InquiryRecord[];
  } catch (error) {
    console.error("[Database Read Error]:", error);
    return [];
  }
}

/**
 * Saves a new inquiry record into the database.
 */
export async function saveInquiry(input: CreateInquiryInput): Promise<InquiryRecord> {
  ensureDbExists();

  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: InquiryRecord = {
    id,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companyProject: (input.companyProject || "").trim(),
    budget: (input.budget || "").trim(),
    overview: input.overview.trim(),
    createdAt: new Date().toISOString(),
    status: "new",
    ip: input.ip || "127.0.0.1",
  };

  try {
    const existing = await getInquiries();
    existing.unshift(record); // Prepend so newest is first

    // Atomic write
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(existing, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);

    return record;
  } catch (error) {
    console.error("[Database Save Error]:", error);
    throw new Error("Failed to save inquiry to database");
  }
}
