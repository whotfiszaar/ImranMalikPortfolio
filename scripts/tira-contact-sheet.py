#!/usr/bin/env python3
"""Build a labeled contact sheet of Tira logo candidates for VLM review."""
from PIL import Image, ImageDraw

BASE = "/home/z/my-project/scripts/tira-candidates"
files = ["c1.png", "c0.jpg", "c2.jpg", "c5.jpg", "c6.jpg"]
THUMB_W = 560

imgs = []
for f in files:
    im = Image.open(f"{BASE}/{f}").convert("RGB")
    ratio = THUMB_W / im.width
    im = im.resize((THUMB_W, max(1, int(im.height * ratio))))
    imgs.append((f, im))

pad = 18
label_h = 34
total_h = sum(im.height + label_h + pad for _, im in imgs) + pad
sheet = Image.new("RGB", (THUMB_W + 2 * pad, total_h), "#e8e8e8")
draw = ImageDraw.Draw(sheet)
y = pad
for i, (name, im) in enumerate(imgs):
    draw.rectangle([pad, y, pad + THUMB_W, y + label_h - 6], fill="#222222")
    draw.text((pad + 10, y + 8), f"[{i}] {name}", fill="#ffffff")
    y += label_h
    sheet.paste(im, (pad, y))
    y += im.height + pad

out = f"{BASE}/contact-sheet.jpg"
sheet.save(out, quality=82)
print(out, sheet.size)
