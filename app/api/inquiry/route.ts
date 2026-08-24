import { NextRequest, NextResponse } from "next/server";
import { saveInquiry, updateInquiryEmailStatus } from "@/lib/db/inquiries";
import { sendInquiryNotification, EmailResult } from "@/lib/email/service";

// Predefined budget options matching UI contract (INR rupee tiers + backwards compatibility)
const VALID_BUDGETS = [
  "< ₹10k",
  "₹10k - ₹25k",
  "₹25k - ₹50k",
  "₹50k - ₹1L",
  "₹1L - ₹2.5L",
  "₹2.5L+",
  "₹50k+",
  "< $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k+",
];

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple sliding window memory rate limiter (IP based)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // 10 inquiries
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // per 5 minutes

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

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many inquiries submitted from this IP. Please try again later.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const {
      name = "",
      email = "",
      companyProject = "",
      company = "",
      budget = "",
      overview = "",
      message = "",
      _hp = "", // Honeypot field
    } = body;

    // Honeypot Protection: Silently accept honeypot submissions without saving
    if (_hp && _hp.trim().length > 0) {
      console.warn(`[Spam Guard] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: true,
          message: "Your inquiry is in. We'll be in touch within 24 hours.",
        },
        { status: 200 }
      );
    }

    // Normalize field mapping (supports both companyProject/company and overview/message)
    const finalName = String(name).trim();
    const finalEmail = String(email).trim().toLowerCase();
    const finalCompany = String(companyProject || company).trim();
    const finalBudget = String(budget).trim();
    const finalOverview = String(overview || message).trim();

    // Server-Side Field Validation
    const errors: Record<string, string> = {};

    if (!finalName) {
      errors.name = "Name is required.";
    } else if (finalName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (finalName.length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    if (!finalEmail) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(finalEmail)) {
      errors.email = "Please provide a valid email address.";
    } else if (finalEmail.length > 254) {
      errors.email = "Email address is too long.";
    }

    if (!finalOverview) {
      errors.overview = "Project overview is required.";
    } else if (finalOverview.length < 10) {
      errors.overview = "Please provide a little more context (minimum 10 characters).";
    } else if (finalOverview.length > 3000) {
      errors.overview = "Project overview cannot exceed 3000 characters.";
    }

    if (finalCompany && finalCompany.length > 150) {
      errors.companyProject = "Company / Project name cannot exceed 150 characters.";
    }

    if (finalBudget && !VALID_BUDGETS.includes(finalBudget)) {
      errors.budget = "Invalid budget option selected.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please check your submission.",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Step 1: Save Inquiry to Database (Primary Source of Truth)
    let inquiryRecord;
    try {
      inquiryRecord = await saveInquiry({
        name: finalName,
        email: finalEmail,
        companyProject: finalCompany,
        budget: finalBudget,
        overview: finalOverview,
        ip: clientIp,
      });
    } catch (dbError) {
      console.error("[Inquiry API Error - DB Failure]:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong saving your inquiry. Please try again or email us directly.",
        },
        { status: 500 }
      );
    }

    // Step 2: Dispatch Email Notification
    let emailResult: EmailResult = { success: true, message: "OK" };
    try {
      emailResult = await sendInquiryNotification({
        name: finalName,
        email: finalEmail,
        companyProject: finalCompany,
        budget: finalBudget,
        overview: finalOverview,
        submittedAt: inquiryRecord.createdAt,
      });

      if (emailResult.success) {
        await updateInquiryEmailStatus(inquiryRecord.id, "sent");
      } else {
        await updateInquiryEmailStatus(inquiryRecord.id, "failed");
        console.warn("[Inquiry API Warning - Email Delivery Failed]:", emailResult.error);
        // Note: Inquiry remains safely saved in DB
      }
    } catch (emailErr) {
      await updateInquiryEmailStatus(inquiryRecord.id, "failed");
      console.error("[Inquiry API Error - Email Exception]:", emailErr);
    }

    // Step 3: Return Success Response to Frontend
    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry is in. We'll be in touch within 24 hours.",
        inquiryId: inquiryRecord.id,
        emailStatus: emailResult.success ? "sent" : "queued",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Inquiry API Error - Unexpected]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again or email us directly at hello@goldspade.in.",
      },
      { status: 500 }
    );
  }
}
