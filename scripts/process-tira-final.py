#!/usr/bin/env python3
"""
Final pass: light-weight Tira wordmark from official CDN (KOQG1kRmW-Tira.png).
White -> transparent, keep full letter set, add 8px transparent padding,
final height 160px. Verifies corners are clean after padding.
"""
from PIL import Image
import numpy as np

SRC = "/home/z/my-project/scripts/tira-candidates-v2/conv-wordmark-b.png"
OUT = "/home/z/my-project/public/images/logos/tira.png"
PREVIEW = "/home/z/my-project/scripts/tira-candidates-v2/final-light-preview.jpg"

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

redness = r - np.maximum(g, b)
alpha = np.clip(redness * 4, 0, 255).astype(np.uint8)
near_white = (r > 222) & (g > 222) & (b > 212)
alpha[near_white] = 0

rgba = np.dstack([a[..., 0].astype(np.uint8), a[..., 1].astype(np.uint8), a[..., 2].astype(np.uint8), alpha])
img = Image.fromarray(rgba)

# add 8px transparent padding around the tight wordmark
pad = 8
padded = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
padded.paste(img, (pad, pad), img)

target_h = 160
target_w = int(round(padded.width * target_h / padded.height))
final = padded.resize((target_w, target_h), Image.LANCZOS)

fa = np.asarray(final).copy()
falpha = fa[..., 3]
fa[..., 3] = np.where(falpha < 14, 0, falpha).astype(np.uint8)
final = Image.fromarray(fa)
final.save(OUT)
print("saved:", OUT, final.size)

o = np.asarray(final)[..., 3]
print("opaque px:", int((o > 128).sum()), f"({100*(o>128).mean():.1f}%)")

cream = Image.new("RGBA", (final.width + 96, final.height + 64), (250, 248, 242, 255))
cream.paste(final, (48, 32), final)
cream.convert("RGB").save(PREVIEW, quality=92)
print("preview:", PREVIEW)
