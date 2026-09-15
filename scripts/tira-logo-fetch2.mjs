// Download all Tira logo candidates from their CDN
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const base = "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/company/1/applications/62d53777f5ad942d3e505f77";
const files = [
  ["wordmark-a.png", `${base}/application/pictures/free-logo/original/hYc6RZXKO-KFwOOQ0oY-Tira.png`],
  ["wordmark-b.png", `${base}/application/pictures/free-logo/original/KOQG1kRmW-Tira.png`],
  ["auth-mobile.png", `${base}/auth/pictures/mobile/original/K8OgePokK-mobile-auth-logo.png`],
  ["auth-desktop.png", `${base}/auth/pictures/desktop/original/M-o0ied4Q-desktop-auth-logo.png`],
];

fs.mkdirSync("/home/z/my-project/scripts/tira-candidates-v2", { recursive: true });
for (const [name, url] of files) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/avif,image/webp,image/png,*/*" }, signal: AbortSignal.timeout(30000) });
    console.log(res.status, res.headers.get("content-type"), url.split("/").pop());
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`/home/z/my-project/scripts/tira-candidates-v2/${name}`, buf);
      console.log("   saved", buf.length, "bytes");
    }
  } catch (e) {
    console.log("ERR", name, String(e).slice(0, 100));
  }
}
