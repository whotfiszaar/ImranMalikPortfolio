#!/usr/bin/env python3
"""Combine verification screenshots into labeled sheets for VLM review."""
from PIL import Image, ImageDraw
import sys

BASE = "/home/z/my-project/scripts"

def sheet(files, labels, out, W=900):
    imgs = []
    for f in files:
        im = Image.open(f"{BASE}/{f}").convert("RGB")
        ratio = W / im.width
        im = im.resize((W, max(1, int(im.height * ratio))))
        imgs.append(im)
    pad, lab = 14, 30
    H = sum(im.height + lab + pad for im in imgs) + pad
    s = Image.new("RGB", (W + 2 * pad, H), "#dddddd")
    d = ImageDraw.Draw(s)
    y = pad
    for lab_text, im in zip(labels, imgs):
        d.rectangle([pad, y, pad + W, y + lab - 8], fill="#222222")
        d.text((pad + 8, y + 7), lab_text, fill="#ffffff")
        y += lab
        s.paste(im, (pad, y))
        y += im.height + pad
    s.save(out, quality=80)
    print("saved", out, s.size)

sheet(
    ["v3-hero.png", "v3-marquee.png", "v3-journey-current.png"],
    ["1 HERO", "2 BRAND MARQUEE", "3 JOURNEY CURRENT ROLE"],
    f"{BASE}/v3-review-a.jpg",
)
sheet(
    ["v3-education.png", "v3-recommendations.png", "v3-footer.png"],
    ["4 EDUCATION", "5 RECOMMENDATIONS", "6 FOOTER"],
    f"{BASE}/v3-review-b.jpg",
)
