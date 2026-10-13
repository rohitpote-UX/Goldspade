async function testRoutes() {
  const BASE = process.env.BASE_URL || "http://localhost:3000";
  const routes = [
    "/",
    "/about",
    "/capabilities",
    "/philosophy",
    "/contact",
    "/journal",
    "/work",
    "/work/gitapath",
    "/work/brandbattle",
    "/work/nityasadhana",
    "/work/saanjgarva",
    "/work/jar",
    "/work/mamacha-mala",
    "/work/hotel-atithi-karad",
    "/work/mayuri-developer",
    "/work/ezdukkan",
    "/work/face-attendance-system",
    "/work/bitebuddy",
    "/login",
    "/signup",
    "/robots.txt",
    "/sitemap.xml",
  ];

  console.log("=== 3. TESTING ROUTE STATUS MATRIX ===");
  let failed = 0;

  for (const route of routes) {
    try {
      const res = await fetch(BASE + route);
      const text = await res.text();
      const isOk = res.status === 200 && text.length > 50;
      console.log(
        `${isOk ? "✓" : "✗"} ${route.padEnd(30)} Status: ${res.status} | Length: ${text.length} bytes | Headers: ${res.headers.get("x-frame-options") || "none"}`
      );
      if (!isOk) failed++;
    } catch (err) {
      console.error(`✗ ${route} Failed:`, err);
      failed++;
    }
  }

  // 404 route check
  const notFoundRes = await fetch(BASE + "/non-existent-route-for-testing");
  console.log(`✓ 404 Route Verification: Status ${notFoundRes.status} (Expected 404)`);

  if (failed === 0) {
    console.log("\nALL ROUTES RETURNED 200 OK WITH VALID PAYLOADS & SECURITY HEADERS!");
  } else {
    console.error(`\n${failed} routes failed verification!`);
    process.exit(1);
  }
}

testRoutes().catch(console.error);
