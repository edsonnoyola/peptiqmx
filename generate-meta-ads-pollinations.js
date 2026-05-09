// PEPTIQ Meta Ads · Generación gratis con Pollinations.ai (Flux, sin auth)
// Uso: node generate-meta-ads-pollinations.js
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './meta-ads-output';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ADS = [
  { name: '01-profesionales', prompt: 'Editorial portrait of a stunning 48-year-old Mexican mestiza woman, long abundant thick wavy jet-black hair flowing past shoulders, warm olive skin with luminous quality, defined cheekbones, full natural lips, deep almond brown eyes with long lashes, subtle natural makeup, contemplative knowing smile. Wearing cream cashmere turtleneck. Sitting elegantly in sunlit minimalist home library, holding leather-bound book. White peonies in stone vase blurred foreground. Antique leather books on shelves behind. Golden hour window light from her left. Small gold huggie hoop earrings. Hermes-lab editorial aesthetic. 85mm lens shallow depth of field. Hyperrealistic 8k commercial photography. Premium quiet luxury. Architectural Digest interiors.' },
  { name: '02-investigacion-longevidad', prompt: 'Editorial portrait of distinguished 58-year-old Mexican man with full salt-and-pepper hair well-groomed, defined jawline with light grey stubble, warm olive skin, intelligent brown eyes, contemplative subtle smile. Wearing soft beige merino crew-neck sweater over white shirt collar peeking. Standing at tall arched window in minimalist home study with floor-to-ceiling oak bookshelves, looking thoughtfully outside. Golden hour afternoon light streaming in. Brass desk lamp blurred foreground. GQ editorial photography. 85mm lens. Hyperrealistic 8k. Premium quiet luxury.' },
  { name: '03-estandar-cientifico', prompt: 'Cinematic close-up editorial photography of woman elegant manicured hands with neutral nude polish holding open scientific certificate document on beige linen tablecloth. Single delicate gold band ring on ring finger. Soft warm window light from upper left. Blurred laboratory glassware Erlenmeyer flask beaker and leather-bound book in background bokeh. Ceramic espresso cup to side. 100mm macro lens. Cream and stone palette with amber. Hyperrealistic 8k commercial photography.' },
  { name: '04-ciencia-no-marketing', prompt: 'Overhead flat lay editorial photograph on polished white Carrara marble surface arranged in golden ratio: open scientific journal showing abstract typography and graphs, brown leather Moleskine notebook closed, vintage Montblanc fountain pen with cap off, round tortoiseshell reading glasses, white ceramic cup with espresso, single fresh white peony stem laid diagonally, brass paper clip. Warm overhead natural light from upper right with soft shadows. 50mm lens. Magazine editorial composition. Premium minimalist. Hyperrealistic 8k.' },
  { name: '05-leen-antes-de-elegir', prompt: 'Vertical editorial portrait of beautiful 44-year-old Latina woman, long abundant thick wavy dark brunette hair pulled into loose low ponytail with face-framing strands, warm olive skin with subtle freckles, intelligent concentrated expression, oversized round black acetate reading glasses. Wearing stone-grey wool blazer over cream silk blouse, gold minimalist jewelry. Sitting at vintage wooden desk reading thick scientific book intently. Large window behind creating soft backlight on hair. Leather notebook and small brass desk lamp visible. Minimalist home office. 85mm lens. Hyperrealistic 8k.' },
  { name: '06-excelencia-silenciosa', prompt: 'Editorial still life detail shot of sophisticated home library shelf: row of antique leather-bound books in burgundy and dark brown, single white orchid in small grey stone vase, brass vintage banker desk lamp with green glass shade emitting warm light, antique world atlas globe, small framed vintage botanical illustration. Neutral wood and cream tones. Late afternoon warm window light from left. No people, no products. Architectural Digest aesthetic. Quiet luxury. Shallow depth of field. Hyperrealistic 8k.' },
  { name: '07-conversacion-profesional', prompt: 'Editorial portrait of two sophisticated mature professional women in their early 50s sitting across long walnut consultation table in profile, having thoughtful intimate conversation with subtle hand gestures. Left woman Mexican mestiza long thick wavy black hair on shoulders warm olive skin cream cashmere blazer. Right woman olive skin chestnut wavy mid-length hair stone-grey turtleneck. Both natural makeup gold minimalist jewelry. Books and open notebook between them, two ceramic tea cups with steam visible. Soft directional natural light from left. Linen curtains. 85mm lens shallow depth. Hyperrealistic 8k.' },
  { name: '08-mens-editorial', prompt: 'Editorial GQ-style portrait of elegant 62-year-old Mexican man, full silver-grey hair brushed back perfectly, distinguished features, well-groomed light grey stubble, intelligent dark brown eyes, contemplative confident expression with subtle smile. Wearing charcoal cashmere cardigan over crisp white Oxford shirt. Sitting in tan leather Eames lounge chair in sophisticated home library, holding leather-bound notebook one hand and tortoiseshell reading glasses the other. Side table with books and brass lamp. Warm directional window light from his right. Premium quiet luxury. 85mm lens. Hyperrealistic 8k.' },
  { name: '09-cocina-coleccionista', prompt: 'Editorial overhead photograph of sophisticated minimalist Scandinavian kitchen morning scene on white quartz marble counter: single ceramic stoneware mug with black tea steaming, open vintage botanical illustration book, fresh white peonies in clear glass vase with stems visible, half-eaten croissant on small ceramic plate, single ripe orange whole, clean folded linen napkin. Soft morning light through linen curtains creating gentle long shadows. Cream stone pale ochre warm palette. Architectural Digest interiors photography. Hyperrealistic 8k.' },
  { name: '10-logo-tagline', prompt: 'Vertical minimalist editorial detail photograph of heavy cream linen presentation folder lying open on dark walnut executive desk surface, showing upper-right corner of embossed scientific certificate document peeking. Antique brass round paperweight beside, vintage Montblanc fountain pen closed, partial leather notebook corner. Ambient warm desk lamp light from upper right creating dramatic long shadows. Very shallow depth of field f/1.4. Cream walnut brass amber palette. Hyperrealistic 8k.' },
];

const FORMATS = [
  { suffix: '_1080x1350', width: 1080, height: 1350 },
  { suffix: '_1080x1080', width: 1080, height: 1080 },
  { suffix: '_1080x1920', width: 1080, height: 1920 },
];

const NEGATIVE = 'text, logos, watermarks, syringes, vials with labels, gym, fitness clothing, before/after, body shots, modern tech, plastic, cartoon, illustration';

async function generateOne(ad, format) {
  const filename = `${ad.name}${format.suffix}.png`;
  const outPath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(outPath)) {
    const sz = fs.statSync(outPath).size;
    if (sz > 50000) {
      console.log(`✅ Skip (existe ${(sz/1024).toFixed(0)}KB): ${filename}`);
      return true;
    }
  }
  const prompt = encodeURIComponent(ad.prompt);
  const neg = encodeURIComponent(NEGATIVE);
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=${format.width}&height=${format.height}&model=flux&nologo=true&enhance=true&private=true&negative=${neg}&seed=${Math.floor(Math.random()*100000)}`;
  console.log(`🎨 Generando ${filename}...`);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PEPTIQ-MetaAds/1.0' } });
    if (!res.ok) {
      console.error(`❌ HTTP ${res.status} ${filename}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10000) {
      console.error(`❌ Buffer muy pequeño (${buf.length}B) ${filename}`);
      return false;
    }
    fs.writeFileSync(outPath, buf);
    console.log(`✅ ${filename} (${(buf.length/1024).toFixed(0)} KB)`);
    return true;
  } catch (e) {
    console.error(`❌ ${filename}: ${e.message}`);
    return false;
  }
}

async function main() {
  const total = ADS.length * FORMATS.length;
  console.log(`📋 Pollinations.ai · Generando ${total} imágenes (gratis, sin auth)\n`);
  let success = 0, failed = 0, i = 0;
  for (const ad of ADS) {
    for (const fmt of FORMATS) {
      i++;
      console.log(`[${i}/${total}]`);
      const ok = await generateOne(ad, fmt);
      if (ok) success++; else failed++;
      // Pausa corta para no saturar
      if (i < total) await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`✅ Exitosas: ${success}/${total}`);
  console.log(`❌ Fallidas: ${failed}/${total}`);
  console.log(`📁 Carpeta: ${path.resolve(OUTPUT_DIR)}/`);
}

main();
