import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isDatabaseConfigured, query } from "./client";

export type UserRole = "ADMIN" | "TEAM" | "client";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  role?: UserRole;
}

const DB_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DB_DIR, "users.json");

function ensureDevUsersDbExists(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("[Dev Users DB Init Error]:", error);
  }
}

function normalizeRole(role?: string): UserRole {
  if (!role) return "client";
  const upper = role.toUpperCase();
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "TEAM") return "TEAM";
  return "client";
}

interface UserDbRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  password_salt: string;
  role: string;
  created_at: string | Date;
  updated_at?: string | Date;
}

/**
 * Finds a user by email in PostgreSQL or dev JSON storage.
 */
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isDatabaseConfigured()) {
    try {
      const result = await query<UserDbRow>(
        `SELECT id, email, name, password_hash, password_salt, role, created_at FROM users WHERE LOWER(email) = $1 LIMIT 1`,
        [normalizedEmail]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        passwordHash: row.password_hash,
        passwordSalt: row.password_salt,
        role: normalizeRole(row.role),
        createdAt: new Date(row.created_at).toISOString(),
      };
    } catch (err) {
      console.error("[PostgreSQL User Search Error]:", err);
    }
  }

  // Dev storage fallback
  ensureDevUsersDbExists();
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const users = JSON.parse(raw) as Array<Partial<UserRecord>>;
    const found = users.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (!found) return null;
    return {
      id: found.id || `usr_${Date.now()}`,
      email: found.email || normalizedEmail,
      name: found.name || "User",
      passwordHash: found.passwordHash || "",
      passwordSalt: found.passwordSalt || "",
      role: normalizeRole(found.role),
      createdAt: found.createdAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error("[Dev Users Read Error]:", err);
    return null;
  }
}

/**
 * Creates and persists a new user account.
 */
export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const role: UserRole = input.role || "client";
  const createdAt = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      const sql = `
        INSERT INTO users (id, email, name, password_hash, password_salt, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
        RETURNING id, email, name, password_hash, password_salt, role, created_at;
      `;
      const values = [id, email, name, input.passwordHash, input.passwordSalt, role, createdAt];
      const result = await query<UserDbRow>(sql, values);
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        passwordHash: row.password_hash,
        passwordSalt: row.password_salt,
        role: normalizeRole(row.role),
        createdAt: new Date(row.created_at).toISOString(),
      };
    } catch (err) {
      console.error("[PostgreSQL Create User Error]:", err);
    }
  }

  // Dev fallback
  ensureDevUsersDbExists();
  const record: UserRecord = {
    id,
    email,
    name,
    passwordHash: input.passwordHash,
    passwordSalt: input.passwordSalt,
    role,
    createdAt,
  };

  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const users = JSON.parse(raw) as UserRecord[];
    users.push(record);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    return record;
  } catch (err) {
    console.error("[Dev Create User Error]:", err);
    return record;
  }
}

/**
 * Ensures an initial default administrator exists for Goldspade internal team.
 */
export async function ensureDefaultAdminUser(): Promise<UserRecord> {
  const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@goldspade.in").trim().toLowerCase();
  const adminName = process.env.ADMIN_DEFAULT_NAME || "Goldspade Administrator";
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "Goldspade@Admin2026!";

  const existing = await getUserByEmail(adminEmail);
  if (existing) {
    return existing;
  }

  // Hash password using scrypt
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(initialPassword, salt, 64).toString("hex");

  const created = await createUser({
    email: adminEmail,
    name: adminName,
    passwordHash: hash,
    passwordSalt: salt,
    role: "ADMIN",
  });

  return created;
}
