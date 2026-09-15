#!/usr/bin/env python3
"""Face-focused avatar cropper using VLM face bounding boxes."""
import json
import os
import re
import subprocess
import sys

from PIL import Image

UPLOAD = "/home/z/my-project/upload"
OUT = "/home/z/my-project/public/images/people"

PEOPLE = {
    "ratika": "ratika.jpg",
    "kasturi": "kasturi.jpg",
    "neel": "neel.jpg",
    "karishma": "karishma.jpg",
    "prasad": "prasad.jpg",
    "sandeep": "sandeep.jpg",
    "saumya": "6.jpg",
    "ashwani": "7.jfif",
    "nirant": "pasted_image_1789473777677.png",
    "shawnak": "pasted_image_1789473794685.png",
    "vikas": "pasted_image_1789473805111.png",
    "arfat": "pasted_image_1789473820758.png",
}

FACE_PROMPT = (
    "Locate the main human face in this photo. Reply ONLY in this exact format, "
    "no other words: left=<int>% top=<int>% width=<int>% height=<int>% where the values "
    "are the face bounding box position and size as percentages of image dimensions."
)


def get_face_box(path):
    result = subprocess.run(
        ["z-ai", "vision", "-p", FACE_PROMPT, "-i", path],
        capture_output=True,
        text=True,
        timeout=120,
    )
    txt = result.stdout
    m = re.search(r"\{.*\}", txt, re.S)
    if not m:
        return None
    try:
        data = json.loads(m.group(0))
        content = data["choices"][0]["message"]["content"]
    except Exception:
        return None
    nums = re.findall(r"(\d+(?:\.\d+)?)\s*%", content)
    if len(nums) < 4:
        return None
    l, t, w, h = [float(n) for n in nums[:4]]
    return {"left": l / 100, "top": t / 100, "w": w / 100, "h": h / 100}


# Per-person crop tightness multiplier (smaller = face fills more of frame)
MULTIPLIER = {"karishma": 1.7, "shawnak": 1.5, "prasad": 1.7, "ashwani": 1.8}


def crop_avatar(src_path, box, out_path, size=160, mult=2.1):
    img = Image.open(src_path).convert("RGB")
    W, H = img.size
    if box is None:
        # fallback: square from top-center (faces are usually upper area)
        side = min(W, H)
        left = max(0, (W - side) // 2)
        top = 0
        crop = img.crop((left, top, left + side, top + side))
    else:
        # face center in pixels
        fcx = (box["left"] + box["w"] / 2) * W
        fcy = (box["top"] + box["h"] / 2) * H
        face_h = max(box["h"] * H, 1)
        # square side ~ mult x face height so the face fills a good portion
        side = int(min(max(face_h * mult, min(W, H) * 0.4), max(W, H)))
        left = int(max(0, min(W - side, fcx - side / 2)))
        top = int(max(0, min(H - side, fcy - side / 2.2)))
        crop = img.crop((left, top, left + side, top + side))
    crop = crop.resize((size, size), Image.LANCZOS)
    crop.save(out_path, "JPEG", quality=86, optimize=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, src in PEOPLE.items():
        src_path = os.path.join(UPLOAD, src)
        box = get_face_box(src_path)
        crop_avatar(src_path, box, os.path.join(OUT, f"{name}.jpg"), mult=MULTIPLIER.get(name, 2.1))
        print(f"{name}: box={box}")

    # contact sheet
    names = list(PEOPLE.keys())
    sheet = Image.new("RGB", (4 * 160, 3 * 160), "white")
    for i, n in enumerate(names):
        img = Image.open(os.path.join(OUT, f"{n}.jpg"))
        sheet.paste(img, ((i % 4) * 160, (i // 4) * 160))
    sheet.save("/tmp/logos/people-sheet2.jpg", quality=85)
    print("sheet saved: /tmp/logos/people-sheet2.jpg")


if __name__ == "__main__":
    sys.exit(main())
