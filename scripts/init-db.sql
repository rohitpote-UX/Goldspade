-- ============================================================
-- GOLDSPADE DIGITAL STUDIO — DATABASE SCHEMA MIGRATION
-- Compatible with PostgreSQL 13+, Supabase, Neon, AWS RDS
-- ============================================================

-- 1. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_project VARCHAR(200) DEFAULT '',
  budget VARCHAR(50) DEFAULT '',
  overview TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'closed', 'flagged')),
  source VARCHAR(100) DEFAULT 'website_contact',
  ip VARCHAR(64) DEFAULT '127.0.0.1',
  email_status VARCHAR(30) DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- 2. Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(64) NOT NULL,
  role VARCHAR(30) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
