async function test() {
  const BASE = "http://localhost:3001";

  console.log("=== 1. TESTING INQUIRY VALIDATION & PERSISTENCE ===");
  // 1a. Invalid Email
  let res = await fetch(BASE + "/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alex", email: "bademail", overview: "This is a test message with enough characters." }),
  });
  let json = await res.json();
  console.log("1a. Invalid Email Response (Expected 400):", res.status, json.error);

  // 1b. Short message
  res = await fetch(BASE + "/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alex", email: "alex@company.com", overview: "Short" }),
  });
  json = await res.json();
  console.log("1b. Short Message Response (Expected 400):", res.status, json.error);

  // 1c. Valid Inquiry
  res = await fetch(BASE + "/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Founder Alex",
      email: "alex.founder@company.com",
      companyProject: "Acme Inc.",
      budget: "₹25k - ₹50k",
      overview: "We need a complete redesign and scalable engineering system for our fintech platform.",
    }),
  });
  json = await res.json();
  console.log("1c. Valid Inquiry Response (Expected 200):", res.status, json.message, "Inquiry ID:", json.inquiryId);

  // 1d. Honeypot check
  res = await fetch(BASE + "/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "SpamBot",
      email: "bot@spam.com",
      overview: "Spam message buy our stuff right now please",
      _hp: "I am a spam bot filling hidden field",
    }),
  });
  json = await res.json();
  console.log("1d. Honeypot Trigger Response (Expected 200 silent):", res.status, json.message);

  console.log("\n=== 2. TESTING AUTHENTICATION MATRIX ===");
  // 2a. Signup
  const testEmail = "client" + Date.now() + "@testcorp.com";
  res = await fetch(BASE + "/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Client",
      email: testEmail,
      password: "StrongPassword123!",
    }),
  });
  json = await res.json();
  const setCookie = res.headers.get("set-cookie");
  console.log("2a. Signup (Expected 201):", res.status, json.message, "User ID:", json.user?.id, "Cookie present:", Boolean(setCookie));

  // 2b. Duplicate Signup
  res = await fetch(BASE + "/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Client Duplicate",
      email: testEmail,
      password: "StrongPassword123!",
    }),
  });
  json = await res.json();
  console.log("2b. Duplicate Signup (Expected 400):", res.status, json.error);

  // 2c. Login with correct password
  res = await fetch(BASE + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "StrongPassword123!",
    }),
  });
  json = await res.json();
  const loginCookie = res.headers.get("set-cookie");
  console.log("2c. Login Success (Expected 200):", res.status, json.message, "Cookie present:", Boolean(loginCookie));

  // 2d. Login with incorrect password
  res = await fetch(BASE + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "WrongPassword!",
    }),
  });
  json = await res.json();
  console.log("2d. Login Wrong Password (Expected 401):", res.status, json.error);

  // 2e. Session check with cookie
  const cookieValue = loginCookie ? loginCookie.split(";")[0] : "";
  res = await fetch(BASE + "/api/auth/session", {
    headers: { Cookie: cookieValue },
  });
  json = await res.json();
  console.log("2e. Session Verification (Expected 200 authenticated: true):", res.status, json);

  // 2f. Logout
  res = await fetch(BASE + "/api/auth/logout", {
    method: "POST",
  });
  json = await res.json();
  const logoutCookie = res.headers.get("set-cookie");
  console.log("2f. Logout (Expected 200):", res.status, json.message, "Cleared cookie:", logoutCookie?.includes("Max-Age=0"));
}

test().catch(console.error);
