#!/usr/bin/env python3
"""Test: relabel ONE vial from NOVA PEPTIDES to PEPTIQ MX via Gemini 2.5 Flash Image."""
import os, base64, sys
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = 'AIzaSyBc505FXsXYfrP7GDOqVPu7Hfc_50gHZmc'
IMG_DIR = Path('/Users/end/Desktop/tdi-peptidos/peptiqmx/img')
OUT_DIR = IMG_DIR / '_peptiq-relabeled'
OUT_DIR.mkdir(exist_ok=True)

client = genai.Client(api_key=API_KEY)

source = sys.argv[1] if len(sys.argv) > 1 else 'trinity.jpg'
src = IMG_DIR / source
assert src.exists(), f'Missing {src}'

print(f'Loading {src.name} ({src.stat().st_size} bytes)')
img_bytes = src.read_bytes()

prompt = (
    "Edit this pharmaceutical vial image. Replace any text that reads "
    "'NOVA PEPTIDES' or 'NOVAPEPTIDES' with 'PEPTIQ MX' in a similar "
    "minimalist serif/sans-serif style. Keep the product name, dose, lot number, "
    "HPLC purity percentage, expiration date, and Janoshik verification badge "
    "IDENTICAL. Keep the vial shape, cap color, powder color, lighting, "
    "background, and camera angle IDENTICAL. Only change 'NOVA PEPTIDES' to "
    "'PEPTIQ MX'. Return the edited image only."
)

print(f'Calling Gemini 2.5 Flash Image...')
response = client.models.generate_content(
    model='gemini-2.5-flash-image',
    contents=[
        types.Part.from_bytes(data=img_bytes, mime_type='image/jpeg'),
        prompt,
    ],
)

for i, part in enumerate(response.candidates[0].content.parts):
    if part.inline_data:
        out = OUT_DIR / f'{src.stem}-peptiq.png'
        out.write_bytes(part.inline_data.data)
        print(f'✅ Saved {out} ({out.stat().st_size} bytes)')
    elif part.text:
        print(f'Text response: {part.text[:200]}')
