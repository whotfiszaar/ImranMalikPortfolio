#!/usr/bin/env python3
"""Analyze + trim the user-pasted Tira logo and inspect current logo assets."""
from PIL import Image
import numpy as np

PASTED = "/home/z/my-project/upload/pasted_image_1789481363362.png"
CUR = "/home/z/my-project/public/images/logos/tira.png"

img = Image.open(PASTED).convert("RGB")
a = np.array(img)
print("pasted:", img.size, img.mode)

# Find non-white content bounds
nonwhite = np.any(a < 245, axis=2)
rows = np.any(nonwhite, axis=1)
cols = np.any(nonwhite, axis=0)
if rows.any():
    top, bottom = np.argmax(rows), len(rows) - np.argmax(rows[::-1])
    left, right = np.argmax(cols), len(cols) - np.argmax(cols[::-1])
    print(f"content bounds: x[{left},{right}] y[{top},{bottom}] -> {right-left}x{bottom-top}")
    # dominant colors of content
    content = a[top:bottom, left:right]
    mask = np.any(content < 245, axis=2)
    px = content[mask]
    print("content mean RGB:", px.mean(axis=0).round(1))
    print("content max RGB:", px.max(axis=0))
    print("min RGB:", px.min(axis=0))
else:
    print("all white?!")

# current logo check
cur = Image.open(CUR)
print("\ncurrent tira.png:", cur.size, cur.mode)
ca = np.array(cur.convert("RGBA"))
# alpha stats
if ca.shape[2] == 4:
    alpha = ca[:, :, 3]
    print("current alpha: opaque px:", int((alpha > 128).sum()), "transparent px:", int((alpha <= 128).sum()))
    opaque = ca[alpha > 128][:, :3]
    print("current opaque mean RGB:", opaque.mean(axis=0).round(1))
