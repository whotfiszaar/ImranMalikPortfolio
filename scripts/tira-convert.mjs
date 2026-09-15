// Convert AVIF candidates to PNG and report dimensions
import sharp from "sharp";
import fs from "node:fs";

const dir = "/home/z/my-project/scripts/tira-candidates-v2";
for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".png"))) {
  const input = `${dir}/${f}`;
  const meta = await sharp(input).metadata();
  const out = `${dir}/${f.replace(".png", "")}.png`;
  // re-encode as real PNG
  await sharp(input).png().toFile(`${dir}/conv-${f}`);
  const m2 = await sharp(`${dir}/conv-${f}`).metadata();
  console.log(f, "avif:", meta.width + "x" + meta.height, "-> png:", m2.width + "x" + m2.height);
}
