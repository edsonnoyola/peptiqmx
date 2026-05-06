#!/usr/bin/env node
/**
 * PEPTIQ IG Carousel publisher.
 * Usage: node post-ig-carousel.js <carrusel-folder> [--dry]
 * Requires env: META_TOKEN, IG_USER_ID
 * Reads caption.txt + ordered NN-name.png files from folder.
 */
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.META_TOKEN;
const IG = process.env.IG_USER_ID;
const DRY = process.argv.includes('--dry');
const FOLDER = process.argv[2];
const BASE_URL = 'https://peptiqmx.com/img/ig/';

if (!FOLDER) { console.error('USAGE: post-ig-carousel.js <folder-name>'); process.exit(1); }
if (!DRY && (!TOKEN || !IG)) { console.error('Missing META_TOKEN or IG_USER_ID env'); process.exit(1); }

const dir = path.join(__dirname, '..', 'img', 'ig', FOLDER);
const captionPath = path.join(dir, 'caption.txt');
if (!fs.existsSync(captionPath)) { console.error(`Missing ${captionPath}`); process.exit(1); }
const caption = fs.readFileSync(captionPath, 'utf8').trim();

const slides = fs.readdirSync(dir)
  .filter(f => /^\d+-.*\.png$/.test(f))
  .sort()
  .map(f => `${BASE_URL}${FOLDER}/${f}`);

if (slides.length < 2 || slides.length > 10) {
  console.error(`Carousel needs 2-10 images. Found ${slides.length}.`); process.exit(1);
}

console.log(`Carousel: ${slides.length} slides`);
slides.forEach((u, i) => console.log(`  ${i+1}. ${u}`));
console.log(`\nCaption (${caption.length} chars):\n${caption}\n`);

if (DRY) { console.log('DRY RUN — no API calls.'); process.exit(0); }

async function gp(url, params, method = 'POST') {
  const u = new URL(url);
  Object.entries({ ...params, access_token: TOKEN }).forEach(([k,v]) => u.searchParams.set(k, v));
  const res = await fetch(u, { method });
  const json = await res.json();
  if (json.error) { console.error('API error:', JSON.stringify(json.error, null, 2)); throw new Error(json.error.message); }
  return json;
}

(async () => {
  const childIds = [];
  for (let i = 0; i < slides.length; i++) {
    console.log(`Uploading ${i+1}/${slides.length}...`);
    const r = await gp(`https://graph.facebook.com/v21.0/${IG}/media`, {
      image_url: slides[i],
      is_carousel_item: 'true'
    });
    childIds.push(r.id);
  }
  console.log('Creating carousel container...');
  const c = await gp(`https://graph.facebook.com/v21.0/${IG}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption
  });
  console.log('Waiting 8s for processing...');
  await new Promise(r => setTimeout(r, 8000));
  console.log('Publishing...');
  const pub = await gp(`https://graph.facebook.com/v21.0/${IG}/media_publish`, {
    creation_id: c.id
  });
  console.log(`✓ PUBLISHED · post id: ${pub.id}`);
  console.log(`https://www.instagram.com/p/...`);
})().catch(e => { console.error(e.message); process.exit(1); });
