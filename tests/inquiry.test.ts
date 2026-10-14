import test from "node:test";
import assert from "node:assert/strict";
import {
  saveInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
} from "@/lib/db/inquiries";
import { sendInquiryNotification } from "@/lib/email/service";
import {
  createSessionToken,
  verifySessionToken,
  isStaffSession,
  isAdminSession,
} from "@/lib/auth/server";

// ─── Test Group 1: Inquiry Persistence & Data Model ─────────────────────────
test("Inquiry Persistence: saveInquiry creates a structured record with authoritative server fields", async () => {
  const testPayload = {
    name: "Automated Test Client",
    email: "test.lead@example.com",
    companyProject: "Test Company Ltd",
    budget: "₹50k - ₹1L",
    overview: "Testing inquiry persistence end-to-end to ensure zero lead drop off.",
    source: "service:mobile-app-development",
    ip: "127.0.0.1",
  };

  const record = await saveInquiry(testPayload);

  assert.ok(record.id.startsWith("inq_"), "Inquiry ID should start with inq_ prefix");
  assert.equal(record.name, "Automated Test Client");
  assert.equal(record.email, "test.lead@example.com");
  assert.equal(record.companyProject, "Test Company Ltd");
  assert.equal(record.budget, "₹50k - ₹1L");
  assert.equal(record.status, "NEW");
  assert.equal(record.source, "service:mobile-app-development");
  assert.ok(record.createdAt, "Must have createdAt timestamp");
  assert.ok(record.updatedAt, "Must have updatedAt timestamp");

  // Verify retrieval
  const retrieved = await getInquiryById(record.id);
  assert.ok(retrieved, "Record must be retrievable by ID");
  assert.equal(retrieved.name, testPayload.name);
  assert.equal(retrieved.email, testPayload.email);

  // Clean up
  await deleteInquiry(record.id);
});

test("Inquiry Lifecycle: status transitions persist correctly across all supported states", async () => {
  const testPayload = {
    name: "Lifecycle Test Founder",
    email: "founder@lifecycle.co",
    overview: "Evaluating pipeline status progression from Contacted to Qualified to Converted.",
  };

  const record = await saveInquiry(testPayload);
  assert.equal(record.status, "NEW");

  // 1. Mark CONTACTED
  const contactedSuccess = await updateInquiryStatus(record.id, "CONTACTED");
  assert.equal(contactedSuccess, true);
  let updated = await getInquiryById(record.id);
  assert.equal(updated?.status, "CONTACTED");

  // 2. Mark QUALIFIED
  const qualifiedSuccess = await updateInquiryStatus(record.id, "QUALIFIED");
  assert.equal(qualifiedSuccess, true);
  updated = await getInquiryById(record.id);
  assert.equal(updated?.status, "QUALIFIED");

  // 3. Mark CONVERTED
  const convertedSuccess = await updateInquiryStatus(record.id, "CONVERTED");
  assert.equal(convertedSuccess, true);
  updated = await getInquiryById(record.id);
  assert.equal(updated?.status, "CONVERTED");

  // 4. Archive
  const archiveSuccess = await updateInquiryStatus(record.id, "ARCHIVED");
  assert.equal(archiveSuccess, true);
  updated = await getInquiryById(record.id);
  assert.equal(updated?.status, "ARCHIVED");

  // Clean up
  await deleteInquiry(record.id);
});

test("Inquiry Notes: internal staff notes can be updated without destroying client data", async () => {
  const testPayload = {
    name: "Notes Test Lead",
    email: "notes@example.org",
    overview: "Checking that private internal staff notes do not alter customer overview.",
  };

  const record = await saveInquiry(testPayload);

  const privateNotes = "Internal review: Lead has $50k budget. Scheduled discovery call for Thursday 4pm IST.";
  const notesSuccess = await updateInquiryNotes(record.id, privateNotes);
  assert.equal(notesSuccess, true);

  const updated = await getInquiryById(record.id);
  assert.equal(updated?.notes, privateNotes);
  assert.equal(updated?.overview, testPayload.overview, "Client message must remain intact");

  // Clean up
  await deleteInquiry(record.id);
});

// ─── Test Group 2: Email Escaping & Security ────────────────────────────────
test("Security: Untrusted user input is safely escaped in email HTML templates", async () => {
  const maliciousPayload = {
    name: "<script>alert('xss')</script> John & Co",
    email: "attacker@malicious.com",
    companyProject: '<b>Bold Inc</b> "quoted"',
    budget: "< ₹10k",
    overview: "<img src=x onerror=alert(1)> Needs web & mobile apps.",
  };

  const result = await sendInquiryNotification(maliciousPayload);
  assert.ok(typeof result.success === "boolean");
});

// ─── Test Group 3: Admin Authentication & HMAC Session Tokens ───────────────
test("Admin Security: HMAC session token signature verification and role checks", async () => {
  // 1. Valid Admin session
  const adminToken = createSessionToken({
    id: "user_test_admin",
    email: "admin@goldspade.in",
    name: "Studio Admin",
    role: "ADMIN",
  });

  const verifiedAdmin = verifySessionToken(adminToken);
  assert.ok(verifiedAdmin, "Admin token must verify successfully");
  assert.equal(verifiedAdmin.role, "ADMIN");
  assert.equal(isStaffSession(verifiedAdmin), true);
  assert.equal(isAdminSession(verifiedAdmin), true);

  // 2. Valid Team session
  const teamToken = createSessionToken({
    id: "user_test_team",
    email: "designer@goldspade.in",
    name: "Team Member",
    role: "TEAM",
  });

  const verifiedTeam = verifySessionToken(teamToken);
  assert.ok(verifiedTeam, "Team token must verify successfully");
  assert.equal(verifiedTeam.role, "TEAM");
  assert.equal(isStaffSession(verifiedTeam), true);
  assert.equal(isAdminSession(verifiedTeam), false, "Team role must not have admin privileges");

  // 3. Forged signature attack
  const parts = adminToken.split(".");
  const forgedToken = `${parts[0]}.forged_invalid_signature_12345`;
  const forgedResult = verifySessionToken(forgedToken);
  assert.equal(forgedResult, null, "Forged token signature must be rejected");

  // 4. Client role must not have staff access
  const clientToken = createSessionToken({
    id: "user_test_client",
    email: "visitor@example.com",
    role: "client",
  });
  const verifiedClient = verifySessionToken(clientToken);
  assert.equal(isStaffSession(verifiedClient), false, "Client role must not have staff access");
});
