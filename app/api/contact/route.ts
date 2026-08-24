import { NextRequest, NextResponse } from "next/server";
import { saveInquiry, updateInquiryEmailStatus } from "@/lib/db/inquiries";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

// ─── Rate Limiting (in-memory sliding window) ────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 6; // 6 inquiries
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── POST Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limiting
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions from this connection. Please wait a few minutes before trying again." },
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
      _hp = "",
    } = body;

    // Honeypot: silently accept bot submissions without sending email or DB spam
    if (_hp && String(_hp).trim().length > 0) {
      console.warn(`[Contact Spam Guard] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        { success: true, message: "Thank you. We've received your inquiry and will get back to you within 24 hours." },
        { status: 200 }
      );
    }

    // ─── Server-Side Validation ────────────────────────────────────────────
    const finalName = sanitize(String(name));
    const finalEmail = sanitize(String(email)).toLowerCase();
    const finalCompany = sanitize(String(company || companyProject));
    const finalBudget = sanitize(String(budget));
    const finalMessage = sanitize(String(message || overview));

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

    // ─── STEP 1: PERSIST INQUIRY IN DATABASE (Primary Source of Truth) ─────
    let savedInquiry;
    try {
      savedInquiry = await saveInquiry({
        name: finalName,
        email: finalEmail,
        companyProject: finalCompany,
        budget: finalBudget,
        overview: finalMessage,
        ip: clientIp,
        source: "website_contact",
      });
    } catch (dbError) {
      console.error("[Contact DB Save Error]:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong while saving your inquiry. Please try again or email us directly at hello@goldspade.in.",
        },
        { status: 500 }
      );
    }

    // ─── STEP 2: DISPATCH EMAIL NOTIFICATIONS (Resilient) ───────────────────
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "hello@goldspade.in";

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const subject = finalCompany
      ? `New Project Inquiry — ${finalCompany}`
      : `New Project Inquiry — ${finalName}`;

    const textBody = `NEW GOLDSPADE INQUIRY

Name:
${finalName}

Email:
${finalEmail}

Company / Project:
${finalCompany || "N/A"}

Estimated Budget:
${finalBudget || "Not specified"}

Project Overview:
${finalMessage}

Submitted:
${submittedAt}

Reply directly to:
${finalEmail}`;

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f3; color: #171515; padding: 24px; margin: 0; }
    .card { background: #ffffff; border: 1px solid #dcdcd8; border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
    .brand { font-family: monospace; font-weight: bold; letter-spacing: 2px; color: #73F3C5; background: #171515; padding: 6px 12px; border-radius: 4px; display: inline-block; margin-bottom: 20px; font-size: 12px; }
    h2 { font-size: 20px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; border-bottom: 1px solid #eeeeee; padding-bottom: 16px; }
    .field { margin-bottom: 18px; }
    .label { font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 600; color: #171515; }
    .overview-box { background: #fafafa; border: 1px solid #eeeeee; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 6px; }
    .footer { font-family: monospace; font-size: 11px; color: #888888; margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">GOLDSPADE</div>
    <h2>New Project Inquiry</h2>

    <div class="field">
      <div class="label">Name</div>
      <div class="value">${escapeHtml(finalName)}</div>
    </div>

    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(finalEmail)}">${escapeHtml(finalEmail)}</a></div>
    </div>

    <div class="field">
      <div class="label">Company / Project</div>
      <div class="value">${escapeHtml(finalCompany || "N/A")}</div>
    </div>

    <div class="field">
      <div class="label">Estimated Budget</div>
      <div class="value">${escapeHtml(finalBudget || "Not specified")}</div>
    </div>

    <div class="field">
      <div class="label">Project Overview &amp; Objectives</div>
      <div class="overview-box">${escapeHtml(finalMessage)}</div>
    </div>

    <div class="footer">
      Submitted via Goldspade Website &bull; ${escapeHtml(submittedAt)}<br>
      Reply directly to: <a href="mailto:${escapeHtml(finalEmail)}">${escapeHtml(finalEmail)}</a>
    </div>
  </div>
</body>
</html>`;

    let emailSent = false;

    // A. Check SMTP Provider (Titan / GoDaddy)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpUser && smtpPass && smtpPass.trim().length > 0) {
      try {
        const nodemailer = (await import("nodemailer")).default;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Goldspade Inquiries" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: finalEmail,
          subject: subject,
          text: textBody,
          html: htmlBody,
        });

        emailSent = true;
        await updateInquiryEmailStatus(savedInquiry.id, "sent");
        console.log(`[Contact] Inquiry email dispatched via SMTP to ${recipientEmail}`);
      } catch (smtpError) {
        console.error("[Contact SMTP Delivery Exception]:", smtpError);
      }
    }

    // B. Check Resend API Provider (Fallback)
    if (!emailSent) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey && resendApiKey.trim().length > 0 && !resendApiKey.includes("placeholder")) {
        try {
          const fromAddress =
            process.env.RESEND_FROM_EMAIL || "Goldspade Inquiries <onboarding@resend.dev>";
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey.trim()}`,
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [recipientEmail],
              reply_to: finalEmail,
              subject: subject,
              text: textBody,
              html: htmlBody,
            }),
          });

          if (response.ok) {
            emailSent = true;
            await updateInquiryEmailStatus(savedInquiry.id, "sent");
            console.log(`[Contact] Inquiry email dispatched via Resend to ${recipientEmail}`);
          } else {
            const errText = await response.text();
            console.error("[Contact Resend API Error]:", response.status, errText);
          }
        } catch (resendError) {
          console.error("[Contact Resend API Exception]:", resendError);
        }
      }
    }

    if (!emailSent) {
      await updateInquiryEmailStatus(savedInquiry.id, "failed");
      console.warn(
        `[Contact Notice] Inquiry ${savedInquiry.id} safely stored in DB, but email delivery is unconfigured or failed. Admin can view lead in /admin dashboard.`
      );
    }

    // ─── STEP 3: RETURN SUCCESS CONFIRMATION TO CLIENT ─────────────────────
    // CRITICAL: Since database successfully captured the inquiry, return success to visitor so lead is never lost.
    return NextResponse.json(
      {
        success: true,
        message: "Thank you. We've received your inquiry and will get back to you within 24 hours.",
        inquiryId: savedInquiry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Unexpected Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while sending your inquiry. Please try again or email us directly at hello@goldspade.in.",
      },
      { status: 500 }
    );
  }
}
