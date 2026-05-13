#!/usr/bin/env node
/**
 * PEPTIQ WhatsApp blast · Meta Cloud API + Graph
 *
 * Uso:
 *   META_ACCESS_TOKEN=xxx META_PHONE_NUMBER_ID=xxx node blast-via-whatsapp.js --dry-run
 *   META_ACCESS_TOKEN=xxx META_PHONE_NUMBER_ID=xxx node blast-via-whatsapp.js --batch=20 --template=peptiq_b2b_estetica
 *
 * Requiere:
 *   - META_ACCESS_TOKEN (system user token, sin expirar)
 *   - META_PHONE_NUMBER_ID (de Meta Business Manager)
 *   - Template APPROVED por Meta
 */
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_ID = process.env.META_PHONE_NUMBER_ID;
const DRY = process.argv.includes('--dry-run');
const BATCH = (process.argv.find(a => a.startsWith('--batch=')) || '').split('=')[1];
const LIMIT = BATCH ? parseInt(BATCH) : Infinity;
const TEMPLATE_OVERRIDE = (process.argv.find(a => a.startsWith('--template=')) || '').split('=')[1];

if (!DRY && (!TOKEN || !PHONE_ID)) {
  console.error('❌ Need META_ACCESS_TOKEN and META_PHONE_NUMBER_ID env vars');
  process.exit(1);
}

const SUPABASE_URL = 'https://hwyrxlnycrlgohrecbpx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_KEY env var'); process.exit(1); }
const PEPTIQ_TENANT = '00000000-0000-0000-0000-000000000002';

// Map category → template name (MUST match approved templates in Meta)
const CATEGORY_TEMPLATES = {
  estetica: 'peptiq_b2b_estetica',
  dermatologia: 'peptiq_b2b_estetica',  // share template
  spa_medico: 'peptiq_b2b_estetica',
  peso: 'peptiq_b2b_peso',
  nutriologos: 'peptiq_b2b_peso',
  anti_aging: 'peptiq_b2b_longevity',
  peptidos: 'peptiq_b2b_longevity',
};

function parseCsvLine(line) {
  const cells = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) { cells.push(cur); cur = ''; }
    else cur += ch;
  }
  cells.push(cur);
  return cells.map(c => c.trim());
}

const csv = fs.readFileSync(path.join(__dirname, 'peptiq-whatsapp-clean.csv'), 'utf8').trim().split('\n');
const header = parseCsvLine(csv.shift());
const rows = csv.map(line => {
  const cells = parseCsvLine(line);
  const r = {};
  header.forEach((h, i) => r[h] = (cells[i] || '').replace(/^"|"$/g, '').trim());
  return r;
});
console.log(`📋 Loaded ${rows.length} WhatsApp leads`);
if (DRY) console.log('🧪 DRY RUN — no sends, no DB writes');

async function loadAlreadySent() {
  if (DRY) return new Set();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?tenant_id=eq.${PEPTIQ_TENANT}&select=phone,notes&notes->>blast_wa_campaign=eq.lanzamiento_b2b_wa_v1`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  }).then(r => r.json()).catch(() => []);
  const set = new Set();
  if (Array.isArray(r)) {
    for (const l of r) {
      if (l.phone) set.add(l.phone.replace(/\D/g,''));
    }
  }
  return set;
}

async function sendTemplate(to, templateName, vars) {
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'es_MX' },
      components: [
        {
          type: 'body',
          parameters: vars.map(v => ({ type: 'text', text: v }))
        }
      ]
    }
  };
  const r = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data));
  return data;
}

async function logWa(phone, name, templateName, msgId, category, city) {
  const existing = await fetch(`${SUPABASE_URL}/rest/v1/leads?phone=eq.${encodeURIComponent(phone)}&tenant_id=eq.${PEPTIQ_TENANT}&select=id,notes`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  }).then(r => r.json());
  if (existing.length > 0) {
    const lead = existing[0];
    const notes = lead.notes || {};
    notes.wa_messages = notes.wa_messages || [];
    notes.wa_messages.push({ id: msgId, template: templateName, sent_at: new Date().toISOString() });
    notes.blast_wa_campaign = 'lanzamiento_b2b_wa_v1';
    await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_id: PEPTIQ_TENANT,
        phone,
        name: name || 'WhatsApp Lead',
        status: 'new',
        source: 'whatsapp_blast',
        notes: { category, city, blast_wa_campaign: 'lanzamiento_b2b_wa_v1', wa_messages: [{ id: msgId, template: templateName, sent_at: new Date().toISOString() }] }
      })
    });
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const already = await loadAlreadySent();
  if (already.size > 0) console.log(`⏭️  ${already.size} leads ya recibieron WA · se omiten`);
  let sent = 0, dedup = 0, skipped = 0, failed = 0;
  const byCat = {};
  for (const row of rows) {
    if (sent >= LIMIT) break;
    const phone = (row.whatsapp || '').replace(/\D/g, '');
    if (!phone || phone.length < 10) { skipped++; continue; }
    if (already.has(phone)) { dedup++; continue; }

    const cat = row.category || 'peptidos';
    const templateName = TEMPLATE_OVERRIDE || CATEGORY_TEMPLATES[cat] || 'peptiq_b2b_longevity';
    const firstName = row.first_name || 'Doctor/a';
    const city = row.city || 'México';
    byCat[cat] = (byCat[cat] || 0) + 1;

    if (DRY) {
      console.log(`[DRY] ${phone.padEnd(15)} · ${cat.padEnd(12)} · ${templateName} · ${firstName} / ${city}`);
      sent++; continue;
    }

    try {
      const res = await sendTemplate(phone, templateName, [firstName, city]);
      const msgId = res.messages?.[0]?.id || 'unknown';
      await logWa(phone, row.name_full, templateName, msgId, cat, city);
      sent++;
      if (sent % 10 === 0) console.log(`✅ ${sent} enviados`);
      await sleep(1500); // anti-spam delay
    } catch (e) {
      console.error(`❌ ${phone}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\n🎯 Total: ${sent} · dedup ${dedup} · skipped ${skipped} · failed ${failed}`);
  console.log(`📊 Por categoría:`, byCat);
})();
