#!/usr/bin/env python3
"""Genera todas las imagenes PEPTIQ branded consistentes (label realista + cap neutra)
via Gemini (nano-banana-pro-preview).
"""
from google import genai
from google.genai import types
import os, time

client = genai.Client(api_key="AIzaSyDhdB_pgL8D6s1ax7-eF4h4FJMFN38U_tc")
OUT = "/Users/end/Desktop/tdi-peptidos/peptiqmx/img"

BASE = (
    "Professional pharmaceutical product photography of a single 10ml glass peptide vial, "
    "perfectly centered and vertical, on a clean pure white studio background. "
    "Clear borosilicate glass vial. "
    "CAP IS PLAIN NEUTRAL SILVER/GRAY aluminum crimp cap — NO colored caps, NO rose gold, "
    "NO burgundy, NO beige, NO gold — just standard gray metallic pharmaceutical cap "
    "identical to hospital vial caps. "
    "White label with realistic pharmaceutical printing showing: "
    "top of label: 'PEPTIQ | Hack Your Limits' in black and gold text. "
    "middle: large bold black category line name and compound name. "
    "below: dose in mg, 'HPLC verified' text. "
    "bottom: 'Lot PQ25-xxx-001' and 'Exp APR/2028' fine print. "
    "Subtle gold accent stripes on label edges. "
    "Shot on 85mm macro lens f/8, studio softbox lighting, ultra sharp focus, "
    "commercial pharmaceutical advertising quality, 4K. "
)

vials = [
    # WOLVERINE line (recovery) — burgundy accent on LABEL only
    ("bpc-157",
     BASE + "Category 'WOLVERINE' top (dark red/burgundy label accent). "
     "Main text 'BPC-157' bold black. Below: '10 mg - HPLC verified - 99.6% Janoshik'. "
     "Lot 'PQ25-BPC-001'. White lyophilized powder filling 40% from bottom."),
    ("tb-500",
     BASE + "Category 'WOLVERINE' top (dark red/burgundy label accent). "
     "Main text 'TB-500' bold black. Below: '10 mg - HPLC verified - 99.3% Janoshik'. "
     "Lot 'PQ25-TB-001'. White lyophilized powder filling 40% from bottom."),
    ("kpv",
     BASE + "Category 'WOLVERINE' top (dark red/burgundy label accent). "
     "Main text 'KPV' bold black. Below: '10 mg - HPLC verified - 99.1% Janoshik'. "
     "Lot 'PQ25-KPV-001'. White lyophilized powder filling 30% from bottom."),
    ("heal-stack",
     BASE + "Category 'WOLVERINE BLEND' top (dark red label accent). "
     "Main text 'BPC-157 + TB-500' bold black. Below: '20 mg total - HPLC verified - 99.5% Janoshik'. "
     "Small gold 'SYSTEM' badge on label. Lot 'PQ25-WOL-001'. White powder filling 50% from bottom."),

    # HIGHLANDER line (longevity) — gold accent
    ("nad",
     BASE + "Category 'HIGHLANDER' top (gold label accent). "
     "Main text 'NAD+' bold black. Below: '1000 mg - HPLC verified - 99.5% Janoshik'. "
     "Lot 'PQ25-NAD-001'. Off-white lyophilized powder filling 60% from bottom."),
    ("epithalon",
     BASE + "Category 'HIGHLANDER' top (gold label accent). "
     "Main text 'EPITHALON' bold black. Below: '10 mg - HPLC verified - 99.3% Janoshik'. "
     "Lot 'PQ25-EPI-001'. White lyophilized powder filling 30% from bottom."),

    # GLOW line (beauty) — beige/rose label accent
    ("ghk-cu",
     BASE + "Category 'GLOW' top (beige/rose gold label accent). "
     "Main text 'GHK-Cu' bold black. Below: '50 mg - HPLC verified - 99.4% Janoshik'. "
     "Lot 'PQ25-GHK-001'. Distinctive light blue copper-tinted lyophilized powder filling 40% from bottom."),
    ("ahk-cu",
     BASE + "Category 'GLOW' top (beige/rose gold label accent). "
     "Main text 'AHK-Cu' bold black. Below: '50 mg - HPLC verified - 99.2% Janoshik'. "
     "Lot 'PQ25-AHK-001'. Light blue copper-tinted lyophilized powder filling 40% from bottom."),
    ("trinity",
     BASE + "Category 'GLOW' top (beige/rose gold label accent). "
     "Main text 'TRINITY' bold black with small subtitle 'BPC + GHK-Cu + TB-500'. "
     "Below: '70 mg - HPLC verified - 99.4% Janoshik'. "
     "Small gold 'SYSTEM' badge on label. Lot 'PQ25-TRN-001'. Cream lyophilized powder filling 50% from bottom."),

    # PRIME line (performance) — black/gold accent
    ("ipamorelin",
     BASE + "Category 'PRIME' top (black and gold label accent). "
     "Main text 'IPAMORELIN' bold black. Below: '10 mg - HPLC verified - 99.2% Janoshik'. "
     "Lot 'PQ25-IPA-001'. White lyophilized powder filling 35% from bottom."),
    ("tesamorelin",
     BASE + "Category 'PRIME' top (black and gold label accent). "
     "Main text 'TESAMORELIN' bold black. Below: '10 mg - HPLC verified - 99.3% Janoshik'. "
     "Lot 'PQ25-TSM-001'. White lyophilized powder filling 35% from bottom."),
    ("gh-stack",
     BASE + "Category 'PRIME' top (black and gold label accent). "
     "Main text 'GH STACK' bold black with subtitle 'CJC-1295 + IPAMORELIN'. "
     "Below: '10 mg - HPLC verified - 99.4% Janoshik'. "
     "Small gold 'SYSTEM' badge on label. Lot 'PQ25-GHS-001'. White lyophilized powder filling 40% from bottom."),

    # NEURO — black accent
    ("semax",
     BASE + "Category 'NEURO' top (black and silver label accent). "
     "Main text 'SEMAX' bold black. Below: '10 mg - HPLC verified - 99.5% Janoshik'. "
     "Lot 'PQ25-SEM-001'. White lyophilized powder filling 30% from bottom."),

    # SUPPORT — liquid, not powder
    ("bac-water",
     "Professional pharmaceutical product photography of a single 3ml glass vial containing "
     "clear sterile liquid water, on clean pure white studio background. "
     "Clear borosilicate glass vial with plain gray/silver neutral aluminum crimp cap. "
     "White label: 'PEPTIQ | Hack Your Limits' top in black/gold. "
     "Category 'SUPPORT' top (silver accent). Main text 'AGUA BACTERIOSTATICA'. "
     "Below: '3 ml - 0.9% Benzyl Alcohol - Sterile'. Lot 'PQ25-BAC-001' Exp APR/2028. "
     "Shot on 85mm macro f/8, studio lighting, 4K quality."),
]

print(f"Generating {len(vials)} PEPTIQ images...")
for name, prompt in vials:
    print(f"Generating {name}...")
    try:
        response = client.models.generate_content(
            model="nano-banana-pro-preview",
            contents=prompt,
            config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                with open(f"{OUT}/{name}.jpg", "wb") as f:
                    f.write(part.inline_data.data)
                print(f"  -> {name}.jpg ({len(part.inline_data.data)//1024}KB)")
                break
        time.sleep(3)
    except Exception as e:
        print(f"  ERROR {name}: {str(e)[:150]}")

print("\nDone. Images saved to:", OUT)
