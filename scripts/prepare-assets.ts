/**
 * Prepare all assets for Imran Malik's portfolio:
 * 1. Optimize gallery/hero images (resize + mozjpeg)
 * 2. Generate LQIP blur placeholders
 * 3. Generate PWA icons (192, 512, maskable, apple-touch, favicon)
 * 4. Generate OG social image (1200x630)
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOAD = '/home/z/my-project/upload';
const OUT_IMAGES = '/home/z/my-project/public/images';
const OUT_ICONS = '/home/z/my-project/public/icons';

const goldGradient = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#efe0b0"/>
      <stop offset="0.45" stop-color="#d3ab5c"/>
      <stop offset="1" stop-color="#9a7a2e"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e8cf8f"/>
      <stop offset="1" stop-color="#b8904a"/>
    </linearGradient>
  </defs>`;

async function processImages() {
  const map: { src: string; dest: string; width: number; quality: number }[] = [
    { src: '4.jpg', dest: 'hero.jpg', width: 1600, quality: 84 },
    { src: '1.JPG', dest: 'ikea-sweden.jpg', width: 1400, quality: 80 },
    { src: 'i1.jpg', dest: 'ikea-team.jpg', width: 1400, quality: 80 },
    { src: '13.JPG', dest: 'ikea-presentation.jpg', width: 1400, quality: 80 },
    { src: '11.jpg', dest: 'kama-superstars.jpg', width: 1400, quality: 80 },
    { src: '17.JPG', dest: 'workshop-session.jpg', width: 1400, quality: 80 },
    { src: '15.JPG', dest: 'networking-event.jpg', width: 1400, quality: 80 },
    { src: '19.jpg', dest: 'global-exposure.jpg', width: 1400, quality: 80 },
    { src: 'i6.jpg', dest: 'conference-moment.jpg', width: 1400, quality: 80 },
  ];

  const lqips: Record<string, string> = {};
  const dims: Record<string, { w: number; h: number }> = {};

  for (const { src, dest, width, quality } of map) {
    const srcPath = path.join(UPLOAD, src);
    const destPath = path.join(OUT_IMAGES, dest);
    const img = sharp(srcPath).rotate();
    const meta = await img.metadata();
    const targetWidth = Math.min(width, meta.width ?? width);
    await img
      .resize({ width: targetWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(destPath);

    const after = await sharp(destPath).metadata();
    dims[dest] = { w: after.width ?? 0, h: after.height ?? 0 };

    // LQIP: tiny 16px wide blurred jpeg
    const lqipBuf = await sharp(destPath)
      .resize({ width: 16 })
      .blur(1.2)
      .jpeg({ quality: 45 })
      .toBuffer();
    lqips[dest] = `data:image/jpeg;base64,${lqipBuf.toString('base64')}`;

    const kb = Math.round(fs.statSync(destPath).size / 1024);
    console.log(`${dest}: ${after.width}x${after.height} ${kb}KB (from ${src})`);
  }

  fs.writeFileSync(
    '/home/z/my-project/src/lib/lqip.ts',
    `// Auto-generated image placeholders (low quality image placeholders)\n` +
      `export const LQIP: Record<string, string> = ${JSON.stringify(lqips, null, 2)};\n\n` +
      `export const DIMENSIONS: Record<string, { w: number; h: number }> = ${JSON.stringify(dims, null, 2)};\n`
  );
  console.log('LQIP + dimensions written to src/lib/lqip.ts');
}

async function svgToPng(svg: string, out: string, width: number, height: number) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(width, height)
    .png()
    .toFile(out);
  console.log(`icon: ${out}`);
}

async function generateIcons() {
  // Monogram icon: gold IM on deep charcoal
  const monogram = (pad: number) => `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    ${goldGradient}
    <rect width="512" height="512" fill="#0b0a08"/>
    <rect x="${pad}" y="${pad}" width="${512 - pad * 2}" height="${512 - pad * 2}" fill="none" stroke="url(#g)" stroke-width="4" rx="32"/>
    <text x="256" y="262" text-anchor="middle" dominant-baseline="central"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="230"
      fill="url(#g)" letter-spacing="6" font-weight="bold">IM</text>
    <rect x="236" y="428" width="40" height="5" fill="url(#g)" rx="2"/>
  </svg>`;

  await svgToPng(monogram(26), path.join(OUT_ICONS, 'icon-192.png'), 192, 192);
  await svgToPng(monogram(26), path.join(OUT_ICONS, 'icon-512.png'), 512, 512);
  // maskable: bigger safe padding
  await svgToPng(monogram(72), path.join(OUT_ICONS, 'icon-maskable-512.png'), 512, 512);
  await svgToPng(monogram(26), path.join(OUT_ICONS, 'apple-touch-icon.png'), 180, 180);
  await svgToPng(monogram(26), path.join(OUT_ICONS, 'favicon-32.png'), 32, 32);

  // Simple SVG favicon (crisp at all sizes)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    ${goldGradient.replace(/id="g2"/g, 'id="g2"').replace(/id="g"/g, 'id="g"')}
    <rect width="64" height="64" rx="14" fill="#0b0a08"/>
    <text x="32" y="34" text-anchor="middle" dominant-baseline="central"
      font-family="Tinos, 'Liberation Serif', serif" font-size="34"
      fill="url(#g)" letter-spacing="1" font-weight="bold">IM</text>
  </svg>`;
  fs.writeFileSync('/home/z/my-project/public/favicon.svg', faviconSvg);
  console.log('favicon.svg written');
}

async function generateOgImage() {
  const og = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    ${goldGradient}
    <rect width="1200" height="630" fill="#0b0a08"/>
    <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#c9a24b" stroke-width="2" opacity="0.55" rx="8"/>
    <rect x="52" y="52" width="1096" height="526" fill="none" stroke="#c9a24b" stroke-width="0.8" opacity="0.35" rx="6"/>

    <!-- monogram mark -->
    <rect x="540" y="96" width="120" height="120" rx="24" fill="#141109" stroke="url(#g)" stroke-width="2.5"/>
    <text x="600" y="162" text-anchor="middle" dominant-baseline="central"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="64"
      fill="url(#g)" font-weight="bold" letter-spacing="2">IM</text>

    <text x="600" y="300" text-anchor="middle"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="92"
      fill="#f3ede1" font-weight="bold" letter-spacing="3">Imran Malik</text>

    <rect x="470" y="332" width="260" height="2" fill="url(#g2)" opacity="0.8"/>

    <text x="600" y="392" text-anchor="middle"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="34"
      fill="#d3ab5c" letter-spacing="2">Retail Operations and Business Leader</text>
    <text x="600" y="440" text-anchor="middle"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="26"
      fill="#b9ac93" letter-spacing="1">Beauty and Luxury Retail Specialist</text>

    <text x="600" y="522" text-anchor="middle"
      font-family="Tinos, 'Liberation Serif', 'DejaVu Serif', serif" font-size="22"
      fill="#8f8770" letter-spacing="4">MUMBAI - INDIA</text>
  </svg>`;

  await sharp(Buffer.from(og), { density: 300 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_ICONS, 'og-image.png'));
  console.log('og-image.png written');
}

async function main() {
  fs.mkdirSync(OUT_IMAGES, { recursive: true });
  fs.mkdirSync(OUT_ICONS, { recursive: true });
  await processImages();
  await generateIcons();
  await generateOgImage();
  console.log('\nAll assets prepared.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
