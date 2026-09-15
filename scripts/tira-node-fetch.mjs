// Try fetching Tira site with Node's native fetch (different TLS fingerprint)
const targets = [
  "https://www.tirabeauty.com/",
  "https://tirabeauty.com/",
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

for (const url of targets) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });
    const html = await res.text();
    console.log("URL:", url, "STATUS:", res.status, "LEN:", html.length);
    if (res.status === 200 && html.length > 5000) {
      const fs = await import("node:fs");
      fs.writeFileSync("/home/z/my-project/scripts/tira-node.html", html);
      // Extract logo asset hints
      const logoMatches = html.match(/[^"'\s]*(?:logo|Logo)[^"'\s]*\.(?:svg|png|webp)/g) ?? [];
      console.log("LOGO ASSETS:", [...new Set(logoMatches)].slice(0, 20));
      const srcsets = html.match(/srcSet="[^"]{10,300}"/g) ?? [];
      console.log("SRCSET sample:", srcsets.slice(0, 3));
    } else {
      console.log(html.slice(0, 200).replace(/\n/g, " "));
    }
  } catch (e) {
    console.log("URL:", url, "ERROR:", String(e).slice(0, 120));
  }
}
