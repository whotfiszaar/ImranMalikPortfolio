#!/usr/bin/env python3
"""
Process official Tira wordmark v2: robust near-white removal, noise cleanup,
tight trim, 160px height, cream-tile preview.
"""
from PIL import Image
import numpy as np

SRC = "/home/z/my-project/scripts/tira-candidates/official-1-rgba.png"
OUT = "/home/z/my-project/public/images/logos/tira.png"

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.int16)  # H x W x 3
r, g, b = a[..., 0], a[..., 1], a[..., 2]

# Brand red is around (242, 25, 1). Compute redness = R - max(G, B).
redness = r - np.maximum(g, b)
# alpha: fully opaque for strong red, partial on antialiased edges
alpha = np.clip(redness * 3, 0, 255).astype(np.uint8)

# Also guard: near-white pixels must be fully transparent even if greenish
near_white = (r > 225) & (g > 225) & (b > 215)
alpha[near_white] = 0

rgba = np.dstack([a[..., 0].astype(np.uint8), a[..., 1].astype(np.uint8), a[..., 2].astype(np.uint8), alpha])
img = Image.fromarray(rgba, "RGBA")

# Drop isolated noise: keep only the largest connected blob region via bbox of strong pixels
strong = alpha > 80
ys, xs = np.where(strong)
print("strong content bounds:", xs.min(), ys.min(), xs.max(), ys.max())
pad = 4
l = max(0, xs.min() - pad)
t = max(0, ys.min() - pad)
rr = min(a.shape[1], xs.max() + 1 + pad)
bb = min(a.shape[0], ys.max() + 1 + pad)
cropped = img.crop((l, t, rr, bb))
print("cropped:", cropped.size)

target_h = 160
ratio = target_h / cropped.height
target_w = int(round(cropped.width * ratio))
final = cropped.resize((target_w, target_h), Image.LANCZOS)

# Clean any residual low-alpha speckles after resize
fa = np.asarray(final).copy()
falpha = fa[..., 3]
fa[..., 3] = np.where(falpha < 12, 0, falpha).astype(np.uint8)
final = Image.fromarray(fa)
final.save(OUT)
print("saved:", OUT, final.size)

cream = Image.new("RGBA", (final.width + 100, final.height + 70), (250, 248, 242, 255))
cream.paste(final, (50, 35), final)
cream.convert("RGB").save("/home/z/my-project/scripts/tira-candidates/final-preview.jpg", quality=92)
print("preview saved")
