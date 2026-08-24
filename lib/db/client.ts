import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;
let tablesInitialized = false;

/**
 * Returns true if a valid DATABASE_URL is provided in environment variables.
 */
export function isDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && dbUrl.trim().length > 0 && !dbUrl.includes("placeholder"));
}

/**
 * Returns the singleton PostgreSQL pool instance.
 */
export function getPool(): Pool | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    const connectionString = process.env.DATABASE_URL!.trim();
    const isSslRequired =
      connectionString.includes("sslmode=require") ||
      connectionString.includes("supabase.co") ||
      connectionString.includes("neon.tech") ||
      process.env.NODE_ENV === "production";

    pool = new Pool({
      connectionString,
      ssl: isSslRequired ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[Database Pool Error]: Unexpected client error", err);
    });
  }

  return pool;
}

/**
 * Ensures required database tables exist in PostgreSQL.
 */
export async function ensurePostgresTables(): Promise<void> {
  if (tablesInitialized || !isDatabaseConfigured()) return;

  const currentPool = getPool();
  if (!currentPool) return;

  try {
    const initSql = `
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company_project VARCHAR(200) DEFAULT '',
        budget VARCHAR(50) DEFAULT '',
        overview TEXT NOT NULL,
        status VARCHAR(30) DEFAULT 'new',
        source VARCHAR(100) DEFAULT 'website_contact',
        ip VARCHAR(64) DEFAULT '127.0.0.1',
        email_status VARCHAR(30) DEFAULT 'pending',
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(120) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        role VARCHAR(30) DEFAULT 'client',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await currentPool.query(initSql);
    tablesInitialized = true;
  } catch (error) {
    console.error("[Database Schema Init Error]:", error);
  }
}

/**
 * Executes a parameterized SQL query safely against PostgreSQL.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("Database is not configured. DATABASE_URL is missing.");
  }

  await ensurePostgresTables();
  return currentPool.query<T>(text, params);
}
