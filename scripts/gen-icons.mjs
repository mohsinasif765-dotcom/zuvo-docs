/**
 * Generate Zuvo favicon + PWA icons (matches components/zuvo-mark.tsx).
 * Outputs into app/ for Next.js metadata file conventions.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const appDir = join(dirname(fileURLToPath(import.meta.url)), "..", "app");

function markSvg(size) {
  const pad = 0;
  const inner = size - pad * 2;
  const r = inner * 0.25;
  const stroke = inner * 0.08;
  const dot = inner * 0.055;
  const x = pad;
  const y = pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#090b18"/>
  <rect x="${x}" y="${y}" width="${inner}" height="${inner}" rx="${r}" fill="#0F1225" stroke="#736AFE" stroke-width="${Math.max(2, inner * 0.04)}"/>
  <path d="M ${x + inner * 0.25} ${y + inner * 0.35} H ${x + inner * 0.75} L ${x + inner * 0.35} ${y + inner * 0.75} H ${x + inner * 0.875}" fill="none" stroke="white" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${x + inner * 0.75}" cy="${y + inner * 0.3}" r="${dot}" fill="#A855F7"/>
</svg>`;
}

async function pngBuffer(size) {
  return sharp(Buffer.from(markSvg(size))).png({ compressionLevel: 9 }).toBuffer();
}

async function writePng(name, size) {
  const out = join(appDir, name);
  await sharp(Buffer.from(markSvg(size))).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${out}`);
}

const png16 = await pngBuffer(16);
const png32 = await pngBuffer(32);
const ico = await pngToIco([png16, png32]);
writeFileSync(join(appDir, "favicon.ico"), ico);
console.log(`wrote ${join(appDir, "favicon.ico")}`);

await writePng("icon.png", 32);
await writePng("apple-icon.png", 180);
