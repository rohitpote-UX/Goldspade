async function testAll() {
  const base = 'http://localhost:3005';
  const routes = [
    '/',
    '/about',
    '/capabilities',
    '/philosophy',
    '/work',
    '/work/gitapath',
    '/work/brandbattle',
    '/contact',
    '/journal',
    '/login',
    '/signup',
    '/admin/login',
    '/robots.txt',
    '/sitemap.xml'
  ];

  console.log('--- Testing Page Routes ---');
  const allAssetUrls = new Set();

  for (const r of routes) {
    const res = await fetch(base + r);
    console.log(`[ROUTE] ${r.padEnd(20)} Status: ${res.status}`);
    if (res.status !== 200) {
      throw new Error(`Route failed: ${r} (${res.status})`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await res.text();
      const hrefMatches = [...html.matchAll(/href="(\/_next\/static\/[^"]+)"/g)];
      for (const m of hrefMatches) {
        allAssetUrls.add(m[1]);
      }
      const srcMatches = [...html.matchAll(/src="(\/_next\/static\/[^"]+)"/g)];
      for (const m of srcMatches) {
        allAssetUrls.add(m[1]);
      }
    }
  }

  console.log('\n--- Testing Static Assets (CSS & JS Chunks) ---');
  console.log(`Discovered ${allAssetUrls.size} unique static chunks across pages.`);
  for (const asset of allAssetUrls) {
    const aRes = await fetch(base + asset);
    if (aRes.status !== 200) {
      throw new Error(`Asset 404/Failed: ${asset} (${aRes.status})`);
    }
  }
  console.log(`All ${allAssetUrls.size} static assets returned 200 OK!`);

  console.log('\n--- Testing API Endpoints ---');
  
  // 1. Unauthenticated admin inquiry check
  const adminRes = await fetch(base + '/api/admin/inquiries');
  console.log(`[API] /api/admin/inquiries (unauth) Status: ${adminRes.status} (Expected: 401)`);
  if (adminRes.status !== 401) {
    throw new Error(`Expected 401 for unauthenticated admin access, got ${adminRes.status}`);
  }

  // 2. Auth session check
  const sessionRes = await fetch(base + '/api/auth/session');
  console.log(`[API] /api/auth/session Status: ${sessionRes.status}`);
  const sessionData = await sessionRes.json();
  console.log('Session response:', sessionData);

  // 3. Contact inquiry validation failure test (empty payload)
  const badInquiryRes = await fetch(base + '/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  console.log(`[API] /api/inquiry (empty payload) Status: ${badInquiryRes.status} (Expected 400)`);
  if (badInquiryRes.status !== 400) {
    throw new Error(`Expected 400 for empty inquiry, got ${badInquiryRes.status}`);
  }

  // 4. Admin login invalid credentials test
  const badLoginRes = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fake@test.com', password: 'wrong' })
  });
  console.log(`[API] /api/auth/login (bad creds) Status: ${badLoginRes.status} (Expected 401)`);
  if (badLoginRes.status !== 401) {
    throw new Error(`Expected 401 for bad login, got ${badLoginRes.status}`);
  }

  console.log('\n✅ ALL PRODUCTION REGRESSION TESTS PASSED CLEANLY!');
}

testAll().catch((err) => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
