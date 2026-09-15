#!/usr/bin/env python3
"""
Process the official LIGHT-WEIGHT Tira wordmark (user-confirmed variant):
white background removal, tight trim, 160px height, cream-tile preview.
Source: cdn.tirabeauty.com free-logo original KOQG1kRmW-Tira.png (368x160).
"""
from PIL import Image
import numpy as np

SRC = "/home/z/my-project/scripts/tira-candidates-v2/conv-wordmark-b.png"
OUT = "/home/z/my-project/public/images/logos/tira.png"
PREVIEW = "/home/z/my-project/scripts/tira-candidates-v2/light-preview.jpg"

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
print("source:", im.size)

# Color stats of clearly-red pixels
redness = r - np.maximum(g, b)
red_mask = redness > 60
if red_mask.any():
    print("red px mean RGB:", a[red_mask].mean(axis=0).round(1), "count:", int(red_mask.sum()))

# alpha: opaque for strong red, partial on thin antialiased strokes.
# Light-weight strokes are thin -> more edge pixels -> gentler curve (x4) keeps them solid.
alpha = np.clip(redness * 4, 0, 255).astype(np.uint8)
near_white = (r > 222) & (g > 222) & (b > 212)
alpha[near_white] = 0

rgba = np.dstack([a[..., 0].astype(np.uint8), a[..., 1].astype(np.uint8), a[..., 2].astype(np.uint8), alpha])

# Trim to content bounds with small padding
strong = alpha > 60
ys, xs = np.where(strong)
print("strong bounds:", xs.min(), ys.min(), xs.max(), ys.max())
pad = 3
l, t = max(0, xs.min() - pad), max(0, ys.min() - pad)
rr, bb = min(a.shape[1], xs.max() + 1 + pad), min(a.shape[0], ys.max() + 1 + pad)
cropped = Image.fromarray(rgba).crop((l, t, rr, bb))
print("cropped:", cropped.size)

# Target 160px height
target_h = 160
target_w = int(round(cropped.width * target_h / cropped.height))
final = cropped.resize((target_w, target_h), Image.LANCZOS)

# Kill residual faint speckles after resize
fa = np.asarray(final).copy()
falpha = fa[..., 3]
fa[..., 3] = np.where(falpha < 14, 0, falpha).astype(np.uint8)
final = Image.fromarray(fa)
final.save(OUT)
print("saved:", OUT, final.size)

# Opaque coverage check (light strokes should still be clearly visible)
o = np.asarray(final)[..., 3]
print("opaque px:", int((o > 128).sum()), "of", o.size, f"({100*(o>128).mean():.1f}%)")

cream = Image.new("RGBA", (final.width + 96, final.height + 64), (250, 248, 242, 255))
cream.paste(final, (48, 32), final)
cream.convert("RGB").save(PREVIEW, quality=92)
print("preview:", PREVIEW)
