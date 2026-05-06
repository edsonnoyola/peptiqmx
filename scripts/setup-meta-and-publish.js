#!/usr/bin/env node
/**
 * One-time setup + publish for PEPTIQ IG carousel.
 * Input: USER_TOKEN env (short-lived from Graph API Explorer).
 * Steps:
 *  1. /me/accounts → finds Pages + Page Access Tokens
 *  2. {page_id}?fields=instagram_business_account → finds IG ID
 *  3. Saves META_TOKEN + IG_USER_ID + PAGE_ID to .env.peptiq
 *  4. Publishes carousel from img/ig/carrusel-anatomia/
 */
const fs = require('fs');
const path = require('path');

const USER_TOKEN = process.env.USER_TOKEN;
const FOLDER = process.argv[2] || 'carrusel-anatomia';
const BASE_IMG_URL = 'https://peptiqmx.com/img/ig/';
const ENV_PATH = path.join(__dirname, '..', '.env.peptiq');

if (!USER_TOKEN) {
  console.error('Missing USER_TOKEN env. Get one from https://developers.facebook.com/tools/explorer/ with scopes: instagram_basic, instagram_content_publish, pages_show_list, pages_read_engagement, business_management');
  process.exit(1);
}

const v = 'v21.0';

async function gp(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`Meta API: ${json.error.message}`);
  return json;
}

async function gpPost(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json();
  if (json.error) throw new Error(`Meta API: ${json.error.message}`);
  return json;
}

(async () => {
  console.log('[1/5] Looking for Pages...');
  const pages = await gp(`https://graph.facebook.com/${v}/me/accounts?access_token=${USER_TOKEN}`);
  if (!pages.data?.length) throw new Error('No Pages — verify scope pages_show_list');

  console.log(`Found ${pages.data.length} Page(s):`);
  pages.data.forEach(p => console.log(`  - ${p.name} (id ${p.id})`));

  const peptiq = pages.data.find(p => /peptiq/i.test(p.name)) || pages.data[0];
  console.log(`\nUsing Page: ${peptiq.name} (${peptiq.id})`);
  const PAGE_TOKEN = peptiq.access_token;

  console.log('\n[2/5] Resolving Instagram Business Account...');
  const ig = await gp(`https://graph.facebook.com/${v}/${peptiq.id}?fields=instagram_business_account&access_token=${PAGE_TOKEN}`);
  if (!ig.instagram_business_account?.id) throw new Error('No IG Business Account linked. Connect @peptiqmx to this FB Page first.');
  const IG_ID = ig.instagram_business_account.id;
  console.log(`IG Business Account: ${IG_ID}`);

  console.log('\n[3/5] Saving credentials to .env.peptiq...');
  fs.writeFileSync(ENV_PATH, `META_TOKEN=${PAGE_TOKEN}\nIG_USER_ID=${IG_ID}\nPAGE_ID=${peptiq.id}\nPAGE_NAME=${peptiq.name}\n`);
  console.log(`Saved: ${ENV_PATH}`);

  console.log(`\n[4/5] Building carousel from ${FOLDER}...`);
  const dir = path.join(__dirname, '..', 'img', 'ig', FOLDER);
  const captionPath = path.join(dir, 'caption.txt');
  const caption = fs.readFileSync(captionPath, 'utf8').trim();
  const slides = fs.readdirSync(dir).filter(f => /^\d+-.*\.png$/.test(f)).sort();
  console.log(`Caption: ${caption.length} chars · Slides: ${slides.length}`);

  const childIds = [];
  for (let i = 0; i < slides.length; i++) {
    const url = `${BASE_IMG_URL}${FOLDER}/${slides[i]}`;
    process.stdout.write(`  Uploading ${i+1}/${slides.length} ${slides[i]}... `);
    const r = await gpPost(`https://graph.facebook.com/${v}/${IG_ID}/media`, {
      image_url: url,
      is_carousel_item: true,
      access_token: PAGE_TOKEN
    });
    childIds.push(r.id);
    console.log('✓');
  }

  console.log('\n[5/5] Creating carousel container + publishing...');
  const c = await gpPost(`https://graph.facebook.com/${v}/${IG_ID}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
    access_token: PAGE_TOKEN
  });
  console.log('Container created. Waiting 10s for processing...');
  await new Promise(r => setTimeout(r, 10000));

  const pub = await gpPost(`https://graph.facebook.com/${v}/${IG_ID}/media_publish`, {
    creation_id: c.id,
    access_token: PAGE_TOKEN
  });
  console.log(`\n✓ PUBLISHED · post id: ${pub.id}`);
  console.log(`https://www.instagram.com/p/`);
})().catch(e => { console.error('\n✗', e.message); process.exit(1); });
