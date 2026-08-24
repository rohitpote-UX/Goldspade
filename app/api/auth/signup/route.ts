import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db/users";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple sliding window rate limiter (IP based)
const signupRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // 5 attempts
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = signupRateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    signupRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many signup attempts. Please wait a few minutes before trying again.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name = "", email = "", password = "" } = body;

    const finalName = String(name).trim();
    const finalEmail = String(email).trim().toLowerCase();
    const finalPassword = String(password);

    // Validation
    if (!finalName || finalName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!finalEmail || !EMAIL_REGEX.test(finalEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid work email address." },
        { status: 400 }
      );
    }

    if (!finalPassword || finalPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Check for mixed case and number or symbol
    const hasUpperCase = /[A-Z]/.test(finalPassword);
    const hasLowerCase = /[a-z]/.test(finalPassword);
    const hasNumberOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(finalPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumberOrSpecial) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must contain uppercase letters, lowercase letters, and at least one number or symbol.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await getUserByEmail(finalEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please log in." },
        { status: 400 }
      );
    }

    // Hash password and persist user
    const { hash, salt } = hashPassword(finalPassword);
    const newUser = await createUser({
      name: finalName,
      email: finalEmail,
      passwordHash: hash,
      passwordSalt: salt,
      role: "client",
    });

    // Create session token and set cookie
    const token = createSessionToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[Signup API Error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
