/**
 * Prepare testimonial photos and brand logos:
 * 1. People: square attention-cropped 160x160 JPEGs into public/images/people
 * 2. Logos: trimmed, consistently sized PNGs into public/images/logos
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOAD = '/home/z/my-project/upload';
const CAND = '/tmp/logos/cand';
const OUT_PEOPLE = '/home/z/my-project/public/images/people';
const OUT_LOGOS = '/home/z/my-project/public/images/logos';

// name -> source file in upload/
const PEOPLE: Record<string, string> = {
  ratika: 'ratika.jpg',
  kasturi: 'kasturi.jpg',
  neel: 'neel.jpg',
  karishma: 'karishma.jpg',
  prasad: 'prasad.jpg',
  sandeep: 'sandeep.jpg',
  saumya: '6.jpg',
  ashwani: '7.jfif',
  nirant: 'pasted_image_1789473777677.png',
  shawnak: 'pasted_image_1789473794685.png',
  vikas: 'pasted_image_1789473805111.png',
  arfat: 'pasted_image_1789473820758.png',
};

async function processPeople() {
  fs.mkdirSync(OUT_PEOPLE, { recursive: true });
  for (const [name, src] of Object.entries(PEOPLE)) {
    const srcPath = path.join(UPLOAD, src);
    const destPath = path.join(OUT_PEOPLE, `${name}.jpg`);
    await sharp(srcPath)
      .rotate()
      .resize(160, 160, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(destPath);
    const kb = Math.round(fs.statSync(destPath).size / 1024);
    console.log(`people/${name}.jpg ${kb}KB (from ${src})`);
  }
}

async function processLogo(
  key: string,
  srcPath: string,
  opts: { trim: boolean; height: number; flattenWhite?: boolean }
) {
  let img = sharp(srcPath);
  const meta = await img.metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  if (opts.trim) {
    img = sharp(await img.trim().toBuffer());
  }

  let pipeline = img;
  if (opts.flattenWhite && !hasAlpha) {
    // Keep logos whose own background is white: leave as is (white bg is desired).
  }

  const buf = await pipeline
    .resize({ height: opts.height, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const outMeta = await sharp(buf).metadata();
  const destPath = path.join(OUT_LOGOS, `${key}.png`);
  fs.writeFileSync(destPath, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(
    `logos/${key}.png ${outMeta.width}x${outMeta.height} ${kb}KB alpha=${hasAlpha}`
  );
}

async function processLogos() {
  fs.mkdirSync(OUT_LOGOS, { recursive: true });

  // Tira: rounded gradient tile with transparent corners
  await processLogo('tira', path.join(CAND, 't3-2.png'), { trim: true, height: 160 });

  // IKEA: official SVG from Wikimedia, rasterize
  const ikeaSvg = fs.readFileSync(path.join(CAND, 'ikea-logo.svg'));
  const ikeaBuf = await sharp(ikeaSvg, { density: 384 })
    .resize({ height: 160 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const ikeaMeta = await sharp(ikeaBuf).metadata();
  fs.writeFileSync(path.join(OUT_LOGOS, 'ikea.png'), ikeaBuf);
  console.log(`logos/ikea.png ${ikeaMeta.width}x${ikeaMeta.height} ${Math.round(ikeaBuf.length / 1024)}KB alpha=${ikeaMeta.hasAlpha}`);

  // Kama Ayurveda: black wordmark on white
  await processLogo('kama', path.join(CAND, 'kama-1.jpg'), { trim: true, height: 160, flattenWhite: true });

  // Forest Essentials: gold on transparent
  await processLogo('forest', path.join(CAND, 'forest-wiki.png'), { trim: true, height: 160 });
}

async function main() {
  await processPeople();
  await processLogos();
  console.log('\nPeople photos and logos prepared.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
