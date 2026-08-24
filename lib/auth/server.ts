import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/lib/db/users";

const AUTH_COOKIE_NAME = "goldspade_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "goldspade_default_secure_secret_key_prod_2026";
}

/**
 * Hashes a plaintext password using scrypt with a unique cryptographic salt.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored hash and salt using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(computedHash, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (error) {
    console.error("[Password Verification Error]:", error);
    return false;
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  role: UserRole;
  exp: number;
}

/**
 * Generates a signed, tamper-proof session token.
 */
export function createSessionToken(user: { id: string; email: string; name?: string; role: UserRole | string }): string {
  const secret = getAuthSecret();
  const normalizedRole: UserRole =
    user.role === "ADMIN" || user.role === "admin"
      ? "ADMIN"
      : user.role === "TEAM" || user.role === "team"
      ? "TEAM"
      : "client";

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: normalizedRole,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const secret = getAuthSecret();
    const expectedSignature = crypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const payloadText = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadText) as SessionPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Sets the HttpOnly session cookie on the response.
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

/**
 * Clears the session cookie on the response.
 */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Extracts and verifies the session from an incoming Next.js request.
 */
export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Helper to enforce that the request is from an authenticated staff member (ADMIN or TEAM).
 */
export function isStaffSession(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === "ADMIN" || session.role === "TEAM";
}

/**
 * Helper to enforce that the request is from an administrator.
 */
export function isAdminSession(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === "ADMIN";
}
