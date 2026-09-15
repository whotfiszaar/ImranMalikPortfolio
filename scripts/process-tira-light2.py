#!/usr/bin/env python3
"""
Clean pass 2: connected-component analysis on the light Tira wordmark.
Keep the largest connected blob (the wordmark), drop corner artifacts,
re-trim, 160px height, cream preview.
"""
from PIL import Image
import numpy as np
from scipy import ndimage

SRC = "/home/z/my-project/scripts/tira-candidates-v2/conv-wordmark-b.png"
OUT = "/home/z/my-project/public/images/logos/tira.png"
PREVIEW = "/home/z/my-project/scripts/tira-candidates-v2/light-preview2.jpg"

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

redness = r - np.maximum(g, b)
alpha = np.clip(redness * 4, 0, 255).astype(np.uint8)
near_white = (r > 222) & (g > 222) & (b > 212)
alpha[near_white] = 0

# Dilate the mask slightly so letters that touch (kerning) form ONE blob,
# and antialiased gaps don't split the wordmark into pieces.
mask = alpha > 30
mask_d = ndimage.binary_dilation(mask, iterations=3)
labels, n = ndimage.label(mask_d)
sizes = ndimage.sum(mask, labels, range(1, n + 1))
print(f"{n} blobs, sizes:", sorted(sizes.tolist(), reverse=True)[:6])

best = int(np.argmax(sizes)) + 1
keep = labels == best

# Restrict final pixels to within the kept blob region (allow original alpha there, 0 elsewhere)
# Smooth the keep region: use dilation result but feathered by original alpha
region = ndimage.binary_erosion(keep, iterations=3) | mask  # recombine
clean_alpha = np.where(keep | ndimage.binary_dilation(keep, iterations=2), alpha, 0).astype(np.uint8)

rgba = np.dstack([a[..., 0].astype(np.uint8), a[..., 1].astype(np.uint8), a[..., 2].astype(np.uint8), clean_alpha])

strong = clean_alpha > 60
ys, xs = np.where(strong)
pad = 3
l, t = max(0, xs.min() - pad), max(0, ys.min() - pad)
rr, bb = min(a.shape[1], xs.max() + 1 + pad), min(a.shape[0], ys.max() + 1 + pad)
cropped = Image.fromarray(rgba).crop((l, t, rr, bb))
print("cropped:", cropped.size)

target_h = 160
target_w = int(round(cropped.width * target_h / cropped.height))
final = cropped.resize((target_w, target_h), Image.LANCZOS)

fa = np.asarray(final).copy()
falpha = fa[..., 3]
fa[..., 3] = np.where(falpha < 14, 0, falpha).astype(np.uint8)
final = Image.fromarray(fa)
final.save(OUT)
print("saved:", OUT, final.size)

o = np.asarray(final)[..., 3]
print("opaque px:", int((o > 128).sum()), f"({100*(o>128).mean():.1f}%)")
h, w = o.shape
for k, v in {"top-left": o[:16, :16], "top-right": o[:16, -16:], "bottom-left": o[-16:, :16], "bottom-right": o[-16:, -16:]}.items():
    print(k, "opaque:", int((v > 40).sum()))

cream = Image.new("RGBA", (final.width + 96, final.height + 64), (250, 248, 242, 255))
cream.paste(final, (48, 32), final)
cream.convert("RGB").save(PREVIEW, quality=92)
print("preview:", PREVIEW)
