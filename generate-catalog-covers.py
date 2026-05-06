#!/usr/bin/env python3
"""Generate 6 lifestyle covers using REAL PEPTIQ vial (from trash) as reference.
Image-to-image: pass the branded vial + prompt scene → Gemini places the exact vial
into the lifestyle scene while preserving its label (PEPTIQ | Hack Your Limits + category banner)."""
import concurrent.futures, time
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = 'AIzaSyBc505FXsXYfrP7GDOqVPu7Hfc_50gHZmc'
IMG = Path('/Users/end/Desktop/tdi-peptidos/peptiqmx/img')
TRASH = IMG / '_trash-wrong-vials'
OUT = IMG / 'covers'
OUT.mkdir(exist_ok=True)

client = genai.Client(api_key=API_KEY)

PRESERVE_LABEL = (
    "CRITICAL: The vial in the generated scene MUST have the SAME LABEL as the "
    "reference image — specifically preserve the text 'PEPTIQ | Hack Your Limits' "
    "header, the category banner in black, the product name, the dose line with "
    "HPLC verified % Janoshik, and the Lot/Exp line. Label text must be clean and "
    "readable, NOT garbled. Preserve powder color inside the vial from reference. "
    "Only change the SCENE around the vial to match the description below.\n\n"
)

CATEGORIES = {
    'glow': {
        'ref': TRASH / 'glow-ghk-cu.jpg',
        'scene': (
            "Place this EXACT vial being held by a woman's elegant hand (30s, "
            "natural French manicure, no rings) on a rose-marble vanity. "
            "Morning pink-gold light. Blurred bokeh: single white orchid + "
            "rolled white linen towel. Dewy skincare ambience. "
            "Palette: cream + dusty rose + warm gold. "
            "Editorial commercial photography, Hermes La Prairie luxury wellness "
            "aesthetic. 4:3 aspect ratio, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
    'wolverine': {
        'ref': TRASH / 'wolverine-bpc157.jpg',
        'scene': (
            "Place this EXACT vial being held by a male athletic hand (30s, "
            "subtle vascularity, post-workout) on a weathered teak locker-room "
            "bench. Blurred bokeh: folded charcoal cotton gym towel + steel "
            "barbell + leather jump rope. Late-afternoon gym window light. "
            "Palette: charcoal + amber leather + steel. "
            "Editorial commercial photography, luxury wellness aesthetic. "
            "4:3, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
    'highlander': {
        'ref': TRASH / 'highlander-nad.jpg',
        'scene': (
            "Place this EXACT vial being held by a distinguished man's hand "
            "(50s, silver wedding band) on an aged oak library desk. Background: "
            "leather-bound books on shelves, tall window with warm golden-hour "
            "light, crystal whiskey decanter blurred bokeh. "
            "Palette: walnut + burgundy + gold. "
            "Editorial commercial photography, Hermes La Prairie luxury aesthetic. "
            "4:3, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
    'prime': {
        'ref': TRASH / 'gh-stack.jpg',
        'scene': (
            "Place this EXACT vial being held by an executive man's hand "
            "(40s, silver minimalist watch on wrist) on a matte-black stone "
            "countertop, penthouse morning scene. Blurred bokeh: espresso cup "
            "on saucer + leather notebook + floor-to-ceiling window with "
            "city skyline at sunrise. "
            "Palette: anthracite + espresso + platinum. "
            "Editorial commercial photography, luxury wellness. "
            "4:3, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
    'shred': {
        'ref': TRASH / 'shred-retatrutide.jpg',
        'scene': (
            "Place this EXACT vial being held by a lean woman's hand (late 30s, "
            "athletic, thin gold bracelet) on a bright white Calacatta marble "
            "kitchen island. Blurred bokeh: glass of green matcha + sliced "
            "pink grapefruit + a soft cloth measuring tape loosely coiled. "
            "Morning sunlight, clinical but warm. "
            "Palette: bright white + sage green + blush pink. "
            "Editorial commercial photography, luxury wellness. "
            "4:3, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
    'spa': {
        'ref': TRASH / 'trinity.jpg',
        'scene': (
            "Place this EXACT vial on a crisp white linen spa treatment table, "
            "held lightly by a therapist's clean hand (no gloves, neutral "
            "polish). Background: a single white orchid in ceramic pot, two "
            "rolled warm hand towels, a small bowl of smooth river stones, "
            "soft diffused skylight. "
            "Palette: pure white + eucalyptus green + pale sand. "
            "Editorial commercial photography, medspa luxury aesthetic. "
            "4:3, shallow depth of field, Kodak Portra 400 film look."
        ),
    },
}


def generate_one(key, cfg):
    out = OUT / f'{key}-hero.png'
    ref = cfg['ref']
    if not ref.exists():
        return f'❌ {key}: ref missing {ref}'
    t0 = time.time()
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-image',
            contents=[
                types.Part.from_bytes(data=ref.read_bytes(), mime_type='image/jpeg'),
                PRESERVE_LABEL + cfg['scene'],
            ],
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                out.write_bytes(part.inline_data.data)
                dt = time.time() - t0
                return f'✅ {key}: {out.name} ({out.stat().st_size // 1024}KB) in {dt:.1f}s'
        return f'⚠️  {key}: no image in response'
    except Exception as e:
        return f'❌ {key}: {str(e)[:140]}'


if __name__ == '__main__':
    import sys
    keys = sys.argv[1:] or list(CATEGORIES.keys())
    print(f'Generating {len(keys)} lifestyle+vial covers in parallel (image-to-image)...')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(generate_one, k, CATEGORIES[k]): k for k in keys}
        for f in concurrent.futures.as_completed(futures):
            print(f.result())
    print(f'\nOutput: {OUT}/')
