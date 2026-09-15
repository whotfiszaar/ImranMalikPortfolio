// Fetch Tira Beauty site + CDN to locate the official light-weight logo asset
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function tryFetch(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow" });
    const ct = res.headers.get("content-type") || "";
    console.log(res.status, ct, url);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (ct.includes("text") || buf.length < 1000) {
        const txt = buf.toString("utf8").slice(0, 500);
        console.log("   text:", txt.replace(/\s+/g, " ").slice(0, 300));
      } else {
        console.log("   bytes:", buf.length);
        return buf;
      }
    }
  } catch (e) {
    console.log("ERR", url, e.message);
  }
  return null;
}

// 1. Homepage HTML -> find logo URLs
const home = await tryFetch("https://www.tirabeauty.com/");
let html = "";
try {
  const res = await fetch("https://www.tirabeauty.com/", { headers: { "user-agent": UA } });
  html = await res.text();
  console.log("homepage bytes:", html.length);
} catch (e) { console.log("home err", e.message); }

const urls = new Set();
const re = /https?:\/\/[^\s"'()<>]+?\.(?:png|svg|webp|jpg)(?:\?[^\s"'<>]*)?/gi;
for (const m of html.matchAll(re)) urls.add(m[0]);
const logoUrls = [...urls].filter(u => /logo|tira/i.test(u) && /logo/i.test(u));
console.log("\nlogo-ish URLs found:", logoUrls.length);
logoUrls.forEach(u => console.log("  ", u));

// 2. Known/likely CDN paths (from prior round: cdn.tirabeauty.com free-logo was the BOLD variant)
const candidates = [
  "https://cdn.tirabeauty.com/live/version/66f9dbbdd8b0683c0ec56ff1/assets/images/free-logo.png",
  "https://cdn.tirabeauty.com/live/version/66f9dbbdd8b0683c0ec56ff1/free-logo-original.png",
];
for (const u of candidates) await tryFetch(u);

// 3. Save homepage html for manual grep if needed
if (html) {
  const fs = await import("fs");
  fs.writeFileSync("/home/z/my-project/scripts/tira-home.html", html);
  console.log("\nsaved homepage html");
}
