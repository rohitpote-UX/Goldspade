import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, ensureDefaultAdminUser } from "@/lib/db/users";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth/server";

// Rate limiter for login attempts (IP based)
const loginRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 8; // 8 attempts
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    loginRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
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
        error: "Too many login attempts. Please wait a few minutes before trying again.",
      },
      { status: 429 }
    );
  }

  try {
    // Ensure default admin user is initialized if empty
    await ensureDefaultAdminUser();

    const body = await req.json();
    const { email = "", password = "" } = body;

    const finalEmail = String(email).trim().toLowerCase();
    const finalPassword = String(password);

    if (!finalEmail || !finalPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter both email address and password." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(finalEmail);
    if (!user) {
      // Return generic error to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(finalPassword, user.passwordHash, user.passwordSalt);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // Generate session token
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Authenticated successfully.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
