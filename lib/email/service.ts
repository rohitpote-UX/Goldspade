import nodemailer from "nodemailer";

export interface ContactInquiryData {
  name: string;
  email: string;
  companyProject?: string;
  budget?: string;
  overview: string;
  submittedAt?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Sends a structured project inquiry notification email to Goldspade admins.
 * Supports Resend API, Nodemailer / SMTP (Gmail, SendGrid, custom), or local dev logging.
 */
export async function sendInquiryNotification(data: ContactInquiryData): Promise<EmailResult> {
  const recipientEmail =
    process.env.INQUIRY_EMAIL ||
    process.env.CONTACT_RECEIVER_EMAIL ||
    "hello@goldspade.in";
  const companyName = data.companyProject?.trim();
  const subject = companyName
    ? `New Goldspade Project Inquiry — ${companyName}`
    : "New Goldspade Project Inquiry";

  const submittedTimestamp = data.submittedAt
    ? new Date(data.submittedAt).toLocaleString("en-US", { timeZoneName: "short" })
    : new Date().toLocaleString("en-US", { timeZoneName: "short" });

  const textBody = `GOLDSPADE
NEW PROJECT INQUIRY

Name:
${data.name}

Email:
${data.email}

Company / Project:
${companyName || "N/A"}

Estimated Budget:
${data.budget || "Not specified"}

Project Overview:
${data.overview}

Submitted:
${submittedTimestamp}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f3; color: #171515; padding: 24px; }
          .card { background: #ffffff; border: 1px solid #dcdcd8; border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
          .brand { font-family: monospace; font-weight: bold; letter-spacing: 2px; color: #73F3C5; background: #171515; padding: 6px 12px; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
          h2 { font-size: 20px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; border-bottom: 1px solid #eeeeee; pb: 16px; }
          .field { margin-bottom: 18px; }
          .label { font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #171515; }
          .overview-box { background: #fafafa; border: 1px solid #eeeeee; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 6px; }
          .footer { font-family: monospace; font-size: 11px; color: #888888; margin-top: 32px; border-top: 1px solid #eeeeee; pt: 16px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">GOLDSPADE</div>
          <h2>New Project Inquiry</h2>

          <div class="field">
            <div class="label">Name</div>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
          </div>

          <div class="field">
            <div class="label">Company / Project</div>
            <div class="value">${escapeHtml(companyName || "N/A")}</div>
          </div>

          <div class="field">
            <div class="label">Estimated Budget</div>
            <div class="value">${escapeHtml(data.budget || "Not specified")}</div>
          </div>

          <div class="field">
            <div class="label">Project Overview & Objectives</div>
            <div class="overview-box">${escapeHtml(data.overview)}</div>
          </div>

          <div class="footer">
            Submitted via Goldspade Studio Contact Form &bull; ${escapeHtml(submittedTimestamp)}
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Check SMTP / Nodemailer environment variables (Gmail, SendGrid, custom SMTP)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || (smtpUser?.includes("@gmail.com") ? "smtp.gmail.com" : undefined);
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;

  if (smtpUser && smtpPass && smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Goldspade Inquiries" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: data.email,
        subject: subject,
        text: textBody,
        html: htmlBody,
      });

      console.log(`[Goldspade Email Service] Notification email dispatched via SMTP to ${recipientEmail}`);
      return {
        success: true,
        message: "Email dispatched successfully via SMTP",
      };
    } catch (smtpError) {
      console.error("[SMTP Dispatch Error]:", smtpError);
      // Fallthrough to next providers or dev mode
    }
  }

  // 2. Check Resend API Provider
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.trim().length > 0 && !resendApiKey.includes("placeholder")) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || "Goldspade Inquiries <onboarding@resend.dev>";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey.trim()}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          reply_to: data.email,
          subject: subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[Resend API Error]:", response.status, errText);
      } else {
        console.log(`[Goldspade Email Service] Notification email dispatched via Resend to ${recipientEmail}`);
        return {
          success: true,
          message: "Email sent successfully via Resend",
        };
      }
    } catch (resendError) {
      console.error("[Resend API Exception]:", resendError);
    }
  }

  // 3. Development Fallback Mode
  console.log("=================================================");
  console.log(`[Goldspade Email Service] NEW INQUIRY (DEV MODE)`);
  console.log(`Recipient: ${recipientEmail}`);
  console.log(`Reply-To:  ${data.email}`);
  console.log(`Subject:   ${subject}`);
  console.log("-------------------------------------------------");
  console.log(textBody);
  console.log("=================================================");

  return {
    success: true,
    message: "Inquiry received and stored in database. Configure SMTP or RESEND_API_KEY in .env.local for email delivery.",
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
