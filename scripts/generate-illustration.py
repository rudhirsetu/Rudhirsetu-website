"""
Generate a brand illustration in the Rudhirsetu house style (3D clay / glass, crimson palette)
and save it as a transparent, trimmed WebP ready for `public/images/`.

    pip install pillow numpy scipy
    set OPENROUTER_API_KEY=...            (Windows)   |   export OPENROUTER_API_KEY=...   (macOS/Linux)

    python scripts/generate-illustration.py --name empty-volunteers \
        --subject "A small clay clipboard with a glossy crimson heart pinned to it, three-quarter view" \
        --variants 2

Each variant is written to `public/images/illustrations/<name>-<n>.webp` (raw renders go to
`scripts/.renders/`, which is git-ignored). Look at the variants, keep the best one, rename it to
`<name>.webp`, delete the rest, and add it to the asset table in docs/BRAND.md.

Options:
    --bg white   opaque clay objects (default). Background is removed by flood fill.
    --bg black   glowing glass objects meant for dark surfaces. Alpha comes from brightness.
    --size 2K    1K | 2K (default 2K, ~$0.05 per image with the default model).
    --out-dir    defaults to public/images/illustrations

Rules (see docs/BRAND.md "Illustration"): describe only the object; the house style below is
appended automatically. Never generate people, real places, real camps or logos. Real event
photography always comes from Sanity.
"""
from __future__ import annotations

import argparse
import base64
import concurrent.futures as cf
import json
import os
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

MODEL = "google/gemini-nano-banana-2.1"
ROOT = Path(__file__).resolve().parent.parent

HOUSE_STYLE = (
    "Soft 3D render, smooth matte clay with subtle frosted-glass highlights, "
    "monochrome crimson palette (deep maroon #450A0A, crimson #B91C1C, soft rose highlights), "
    "gentle studio lighting, single centered object with generous empty space around it, "
    "premium minimal healthcare-NGO brand illustration. "
    "No text, no letters, no numbers, no logos, no real people."
)
BACKGROUNDS = {
    "white": "Isolated on a perfectly flat pure white #FFFFFF background, no floor, no cast shadow, no gradient.",
    "black": "Isolated on a perfectly flat pure black #000000 background, no floor, no reflections, no gradient.",
}


def api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key and sys.platform == "win32":
        try:  # a user-level variable set after this shell started
            import winreg

            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as k:
                key = winreg.QueryValueEx(k, "OPENROUTER_API_KEY")[0]
        except OSError:
            key = None
    if not key:
        sys.exit("Set OPENROUTER_API_KEY first.")
    return key


def render(subject: str, bg: str, size: str) -> tuple[bytes, float]:
    body = {
        "model": MODEL,
        "messages": [{"role": "user", "content": f"{subject} {HOUSE_STYLE} {BACKGROUNDS[bg]}"}],
        "modalities": ["image", "text"],
        "image_config": {"aspect_ratio": "1:1", "image_size": size},
    }
    request = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {api_key()}", "Content-Type": "application/json"},
    )
    data = json.load(urllib.request.urlopen(request, timeout=240))
    images = data["choices"][0]["message"].get("images") or []
    if not images:
        raise RuntimeError("No image returned: " + json.dumps(data)[:300])
    raw = base64.b64decode(images[0]["image_url"]["url"].split(",", 1)[1])
    return raw, float((data.get("usage") or {}).get("cost") or 0)


def cut_white(rgb: np.ndarray):
    """Opaque objects on white: remove the border-connected background and large enclosed
    pure-white pockets (e.g. inside a ribbon loop), feather the edge, un-mix white from edge pixels."""
    diff = (255 - rgb).max(axis=2)
    labels, _ = ndimage.label(diff < 18)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, border[border > 0])
    pure, count = ndimage.label(diff < 8)
    if count:
        sizes = ndimage.sum(np.ones_like(diff), pure, range(1, count + 1))
        bg |= np.isin(pure, np.where(sizes > 1500)[0] + 1)
    alpha = (~bg).astype(np.float32)
    edge = ndimage.binary_dilation(bg, iterations=2) & ~ndimage.binary_erosion(bg, iterations=2)
    alpha = np.where(edge, np.clip(diff / 40.0, 0, 1) * (~bg), alpha)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))) / 255.0
    a = np.maximum(alpha[..., None], 1e-3)
    color = np.where(alpha[..., None] > 0, (rgb / 255.0 - (1 - a)) / a, 0)
    return np.clip(color * 255, 0, 255), alpha


def cut_black(rgb: np.ndarray):
    """Glowing glass on black: alpha = brightness, colour un-premultiplied (behaves like `screen`)."""
    a = np.clip((rgb.max(axis=2) - 6) / 249.0, 0, 1)
    color = np.where(a[..., None] > 0, rgb / 255.0 / np.maximum(a[..., None], 1e-3), 0)
    return np.clip(color * 255, 0, 255), a


def to_webp(raw_png: Path, bg: str, out: Path, max_side: int = 800) -> Image.Image:
    rgb = np.asarray(Image.open(raw_png).convert("RGB")).astype(np.float32)
    color, alpha = (cut_white if bg == "white" else cut_black)(rgb)
    image = Image.fromarray(np.dstack([color, alpha * 255]).astype(np.uint8), "RGBA")
    image = image.crop(image.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    pad = int(max(image.size) * 0.04)
    canvas = Image.new("RGBA", (image.width + 2 * pad, image.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(image, (pad, pad))
    canvas.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "WEBP", quality=84, method=6)
    return canvas


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--name", required=True, help="kebab-case file name, e.g. empty-volunteers")
    parser.add_argument("--subject", required=True, help="describe ONLY the object")
    parser.add_argument("--bg", choices=["white", "black"], default="white")
    parser.add_argument("--size", choices=["1K", "2K"], default="2K")
    parser.add_argument("--variants", type=int, default=2)
    parser.add_argument("--out-dir", default=str(ROOT / "public" / "images" / "illustrations"))
    args = parser.parse_args()

    renders = ROOT / "scripts" / ".renders"
    renders.mkdir(parents=True, exist_ok=True)

    def job(n: int):
        raw, cost = render(args.subject, args.bg, args.size)
        raw_path = renders / f"{args.name}-{n}.png"
        raw_path.write_bytes(raw)
        out = Path(args.out_dir) / f"{args.name}-{n}.webp"
        image = to_webp(raw_path, args.bg, out)
        return out, image.size, out.stat().st_size // 1024, cost

    total = 0.0
    # All variants are requested at once (OpenRouter has no discounted batch API; this just saves time).
    with cf.ThreadPoolExecutor(max_workers=min(args.variants, 6)) as pool:
        for out, size, kb, cost in pool.map(job, range(1, args.variants + 1)):
            total += cost
            print(f"{out.relative_to(ROOT)}  {size[0]}x{size[1]}  {kb} KB  ${cost:.3f}")
    print(f"Total cost: ${total:.3f}")


if __name__ == "__main__":
    main()
