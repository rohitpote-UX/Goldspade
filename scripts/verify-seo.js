const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), '.next', 'server', 'app');

function checkFile(relPath, label) {
  const fullPath = path.join(appDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[MISSING] ${label}: ${relPath}`);
    return;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'NO TITLE';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || 'NO DESC';
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || 'NO CANONICAL';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'NO H1';
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => {
    try {
      return JSON.parse(m[1]);
    } catch (e) {
      return 'INVALID JSON';
    }
  });

  console.log(`\n=== ${label} (${relPath}) ===`);
  console.log(`Title: ${title}`);
  console.log(`Canonical: ${canonical}`);
  console.log(`Description (${desc.length} chars): ${desc}`);
  console.log(`H1: ${h1}`);
  console.log(`JSON-LD Scripts: ${jsonLd.length}`);
  jsonLd.forEach((schema, idx) => {
    const type = schema['@type'] || (schema['@graph'] ? schema['@graph'].map(g => g['@type']).join(', ') : 'unknown');
    console.log(`  Schema #${idx + 1} Types: ${type}`);
  });
}

console.log('--- GOLDSPADE TECHNICAL SEO VERIFICATION ---');
checkFile('index.html', 'HOMEPAGE');
checkFile('services.html', 'SERVICES HUB');
checkFile('services/website-design-development.html', 'SERVICE: Website Design & Development');
checkFile('services/custom-software-web-applications.html', 'SERVICE: Web Applications');
checkFile('locations.html', 'LOCATIONS HUB');
checkFile('locations/pune.html', 'LOCATION: Pune');
checkFile('locations/satara.html', 'LOCATION: Satara');
checkFile('locations/karad.html', 'LOCATION: Karad');
checkFile('locations/sangli.html', 'LOCATION: Sangli');
checkFile('locations/kolhapur.html', 'LOCATION: Kolhapur');
checkFile('locations/belagavi.html', 'LOCATION: Belgaum / Belagavi');
checkFile('locations/india.html', 'LOCATION: India');
checkFile('work.html', 'WORK HUB');
checkFile('work/brandbattle.html', 'CASE STUDY: BrandBattle');
checkFile('journal.html', 'JOURNAL HUB');
checkFile('journal/business-website-cost-india-founders-guide.html', 'JOURNAL ARTICLE: Cost Guide');
checkFile('about.html', 'ABOUT');
checkFile('contact.html', 'CONTACT');
checkFile('philosophy.html', 'PHILOSOPHY');
checkFile('privacy.html', 'PRIVACY');
checkFile('terms.html', 'TERMS');
