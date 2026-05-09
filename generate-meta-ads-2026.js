// PEPTIQ · Generate Meta-compliant ad images via Replicate Flux Pro
// Uso:
//   export REPLICATE_API_TOKEN=r8_...
//   node generate-meta-ads-2026.js
//
// Output: ./meta-ads-output/01-profesionales.png ... 10-logo-tagline.png

import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const OUTPUT_DIR = './meta-ads-output';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ADS = [
  {
    name: '01-profesionales',
    prompt: 'Editorial portrait of a 50-year-old Mexican woman with long dark wavy hair, wearing a cream cashmere turtleneck, sitting in a sunlit home library reading a book, white peonies in vase blurred foreground, warm natural lighting through window, contemplative expression, professional photography, magazine editorial style, shallow depth of field, soft golden hour light, 4k, hyperrealistic',
  },
  {
    name: '02-investigacion-longevidad',
    prompt: 'Editorial portrait of a distinguished 55-year-old Mexican man with salt-and-pepper hair, wearing a simple beige merino sweater, standing at a tall window in a minimalist home study with bookshelves, looking out thoughtfully, warm afternoon light, architectural digest aesthetic, shallow depth of field, professional editorial photography, 4k',
  },
  {
    name: '03-estandar-cientifico',
    prompt: 'Close-up editorial photography of hands holding a scientific certificate document on a beige linen tablecloth, soft natural light, blurred laboratory glassware in background, neutral palette, premium minimalist aesthetic, magazine quality, no text visible on document, shallow depth of field, hyperrealistic',
  },
  {
    name: '04-ciencia-no-marketing',
    prompt: 'Editorial flat lay photography on a marble surface: an open scientific journal with abstract text, a leather notebook, fountain pen, pair of round reading glasses, ceramic coffee cup, single white peony stem, warm overhead natural light, neutral color palette, magazine editorial composition, professional photography, 4k',
  },
  {
    name: '05-leen-antes-de-elegir',
    prompt: 'Editorial portrait of a 45-year-old Latina woman with shoulder-length brunette hair in a low ponytail, reading a thick scientific book at a wooden desk, wearing oversized round glasses and a stone-grey blazer, large window with soft diffused light, minimal home office aesthetic, warm muted tones, depth of field, professional editorial photography',
  },
  {
    name: '06-excelencia-silenciosa',
    prompt: 'Editorial still life photograph of a sophisticated home library shelf: leather-bound books, a single white orchid in a stone vase, brass desk lamp turned on, vintage atlas globe, neutral wood and cream tones, shallow depth of field, warm window light, architectural digest aesthetic, no people, magazine quality, 4k',
  },
  {
    name: '07-conversacion-profesional',
    prompt: 'Editorial portrait of two mature professional women age 50 to 58, one Mexican mestiza and one with European features, having a thoughtful conversation across a wooden table in a minimalist consultation room, warm natural lighting, neutral palette, both wearing soft beige and white tones, books and a tea service on table, magazine editorial photography, depth of field',
  },
  {
    name: '08-mens-editorial',
    prompt: 'Editorial portrait of a 60-year-old elegant Mexican man with full head of grey hair, wearing a charcoal cashmere cardigan over a white shirt, sitting in a leather chair in a sophisticated home library, reading a leather-bound notebook with reading glasses, warm directional window light, depth of field, GQ magazine editorial style, contemplative, 4k',
  },
  {
    name: '09-cocina-coleccionista',
    prompt: 'Editorial photography of a sophisticated minimalist Scandinavian kitchen with marble counter, single ceramic cup of black tea, open book of botanical illustrations, white peonies in glass vase, morning light through linen curtains, warm neutral palette, no text, no products visible, magazine quality interiors photography, architectural digest aesthetic',
  },
  {
    name: '10-logo-tagline',
    prompt: 'Minimalist editorial photograph of a heavy cream linen folder open showing the corner of a scientific certificate document on a dark walnut desk, brass paperweight, fountain pen, ambient warm desk lamp light, very shallow depth of field, magazine editorial aesthetic, neutral premium palette, no text visible, 4k',
  },
];

const FORMATS = [
  { suffix: '_1080x1350', aspect_ratio: '4:5',  width: 1080, height: 1350 }, // Feed portrait
  { suffix: '_1080x1080', aspect_ratio: '1:1',  width: 1080, height: 1080 }, // Feed square
  { suffix: '_1080x1920', aspect_ratio: '9:16', width: 1080, height: 1920 }, // Reel/Story
];

async function generateOne(ad, format) {
  const filename = `${ad.name}${format.suffix}.png`;
  const outPath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(outPath)) {
    console.log(`✅ Already exists, skipping: ${filename}`);
    return;
  }
  console.log(`🎨 Generating ${filename}...`);
  try {
    const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
      input: {
        prompt: ad.prompt,
        aspect_ratio: format.aspect_ratio,
        output_format: 'png',
        output_quality: 95,
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    });
    const url = Array.isArray(output) ? output[0] : output;
    if (!url) throw new Error('no output url');
    const res = await fetch(typeof url === 'string' ? url : url.url ? url.url() : String(url));
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outPath, buf);
    console.log(`✅ Saved: ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.error(`❌ Error generating ${filename}:`, e.message);
  }
}

async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ Set REPLICATE_API_TOKEN env var');
    process.exit(1);
  }
  console.log(`📋 Generating ${ADS.length} ads × ${FORMATS.length} formats = ${ADS.length * FORMATS.length} images\n`);
  for (const ad of ADS) {
    for (const fmt of FORMATS) {
      await generateOne(ad, fmt);
    }
  }
  console.log(`\n✅ Done. Files in ${OUTPUT_DIR}/`);
}

main();
