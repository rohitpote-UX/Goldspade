import { NextRequest, NextResponse } from "next/server";
import { saveInquiry, updateInquiryEmailStatus } from "@/lib/db/inquiries";
import { sendInquiryNotification } from "@/lib/email/service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

// ─── Rate Limiting (in-memory sliding window) ────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 8; // 8 inquiries
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

// ─── Input Sanitization ──────────────────────────────────────────────────────
function sanitize(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

// ─── POST Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limiting defense
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many submissions from this connection. Please wait a few minutes before trying again.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const {
      name = "",
      email = "",
      company = "",
      companyProject = "",
      budget = "",
      message = "",
      overview = "",
      source = "website_contact",
      _hp = "",
    } = body;

    // Honeypot: silently accept bot submissions without sending email or DB spam
    if (_hp && String(_hp).trim().length > 0) {
      console.warn(`[Contact Spam Guard] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: true,
          message: "Thank you for reaching out to Goldspade. Your project inquiry has been received.",
        },
        { status: 200 }
      );
    }

    // ─── Server-Side Validation ────────────────────────────────────────────
    const finalName = sanitize(String(name));
    const finalEmail = sanitize(String(email)).toLowerCase();
    const finalCompany = sanitize(String(company || companyProject));
    const finalBudget = sanitize(String(budget));
    const finalMessage = sanitize(String(message || overview));
    const finalSource = sanitize(String(source || "website_contact"));

    const errors: Record<string, string> = {};

    if (!finalName) {
      errors.name = "Name is required.";
    } else if (finalName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (finalName.length > MAX_NAME_LENGTH) {
      errors.name = `Name cannot exceed ${MAX_NAME_LENGTH} characters.`;
    }

    if (!finalEmail) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(finalEmail)) {
      errors.email = "Please provide a valid email address.";
    } else if (finalEmail.length > MAX_EMAIL_LENGTH) {
      errors.email = "Email address is too long.";
    }

    if (!finalMessage) {
      errors.message = "Project overview is required.";
    } else if (finalMessage.length < MIN_MESSAGE_LENGTH) {
      errors.message = `Please provide at least ${MIN_MESSAGE_LENGTH} characters of context.`;
    } else if (finalMessage.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Project overview cannot exceed ${MAX_MESSAGE_LENGTH} characters.`;
    }

    if (finalCompany && finalCompany.length > MAX_COMPANY_LENGTH) {
      errors.company = `Company name cannot exceed ${MAX_COMPANY_LENGTH} characters.`;
    }

    if (finalBudget && finalBudget.length > 50) {
      errors.budget = "Budget description is too long.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", details: errors },
        { status: 400 }
      );
    }

    // ─── STEP 1: PERSIST INQUIRY IN STORAGE (Primary Source of Truth) ─────
    let savedInquiry;
    try {
      savedInquiry = await saveInquiry({
        name: finalName,
        email: finalEmail,
        companyProject: finalCompany,
        budget: finalBudget,
        overview: finalMessage,
        ip: clientIp,
        source: finalSource,
      });
    } catch (dbError) {
      console.error("[Contact Persistence Failure]:", dbError);
      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't submit your inquiry just now. Your information is still here. Please try again in a moment or email us directly at hello@goldspade.in.",
        },
        { status: 500 }
      );
    }

    // ─── STEP 2: DISPATCH EMAIL NOTIFICATION (Resilient) ────────────────────
    try {
      const emailResult = await sendInquiryNotification({
        id: savedInquiry.id,
        name: finalName,
        email: finalEmail,
        companyProject: finalCompany,
        budget: finalBudget,
        overview: finalMessage,
        source: finalSource,
        submittedAt: savedInquiry.createdAt,
      });

      if (emailResult.success) {
        await updateInquiryEmailStatus(savedInquiry.id, "sent");
      } else {
        await updateInquiryEmailStatus(savedInquiry.id, "failed");
        console.warn(
          `[Contact Email Warning]: Delivery not completed (${emailResult.message || emailResult.error}). Inquiry is safely persisted in admin desk.`
        );
      }
    } catch (emailErr) {
      console.error("[Contact Email Exception]:", emailErr);
      await updateInquiryEmailStatus(savedInquiry.id, "failed");
    }

    // ─── STEP 3: RETURN SUCCESS CONFIRMATION TO CLIENT ──────────────────────
    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for reaching out to Goldspade. Your project inquiry has been received. We'll review the details and follow up as appropriate.",
        inquiryId: savedInquiry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Unexpected Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending your inquiry. Your message has been preserved. Please try again or email us directly at hello@goldspade.in.",
      },
      { status: 500 }
    );
  }
}

