import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('app/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating Goldspade favicons and icons...');

  // Ensure directories exist
  if (!fs.existsSync('public')) fs.mkdirSync('public', { recursive: true });
  if (!fs.existsSync('app')) fs.mkdirSync('app', { recursive: true });

  // 1. Copy SVG to public
  fs.copyFileSync(svgPath, 'public/icon.svg');
  fs.copyFileSync(svgPath, 'public/favicon.svg');

  // 2. Generate PNG sizes
  const sizes = [
    { name: 'app/icon.png', size: 32 },
    { name: 'app/apple-icon.png', size: 180 },
    { name: 'public/favicon-16x16.png', size: 16 },
    { name: 'public/favicon-32x32.png', size: 32 },
    { name: 'public/apple-touch-icon.png', size: 180 },
    { name: 'public/icon-192.png', size: 192 },
    { name: 'public/icon-512.png', size: 512 },
  ];

  const pngBuffersForIco = [];

  for (const item of sizes) {
    const buffer = await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toBuffer();
    fs.writeFileSync(item.name, buffer);
    console.log(`✓ Created ${item.name} (${item.size}x${item.size})`);
  }

  // Generate 16, 32, 48 buffers for ICO
  for (const size of [16, 32, 48]) {
    const buffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffersForIco.push({ buffer, width: size, height: size });
  }

  // 3. Create standard ICO binary
  const count = pngBuffersForIco.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count of images

  const dirEntries = [];
  for (const { buffer, width, height } of pngBuffersForIco) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color count (0 = 256+)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // 32-bit RGBA
    entry.writeUInt32LE(buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffersForIco.map((p) => p.buffer)]);

  fs.writeFileSync('app/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('✓ Created app/favicon.ico and public/favicon.ico (multi-size ICO container)');

  console.log('All Goldspade favicons generated successfully!');
}

generate().catch(console.error);
