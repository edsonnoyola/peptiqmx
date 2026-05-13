#!/usr/bin/env node
/**
 * PEPTIQ blast — Resend + tracking.
 * Template structure: [{category, categoryLabel, sequence: [{step, day, subject, body, signature}]}]
 * Only sends step 1 (day 0). Cadencia follows via SARA if they respond to WhatsApp.
 *
 * Uso:
 *   node blast-via-resend.js --dry-run           # no envía
 *   node blast-via-resend.js --dry-run --batch=5 # solo primeros 5 dry
 *   RESEND_API_KEY=re_xxx node blast-via-resend.js --batch=5 # enviar 5 reales
 *   RESEND_API_KEY=re_xxx node blast-via-resend.js           # todos (386)
 */
const fs = require('fs');
const path = require('path');

const RESEND_API = 'https://api.resend.com';
const SUPABASE_URL = 'https://hwyrxlnycrlgohrecbpx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_KEY env var'); process.exit(1); }
const PEPTIQ_TENANT = '00000000-0000-0000-0000-000000000002';
const FROM = 'PEPTIQ MX <hola@peptiqmx.com>';
const REPLY_TO = 'hola@peptiqmx.com';
const DRY = process.argv.includes('--dry-run');
const BATCH = (process.argv.find(a => a.startsWith('--batch=')) || '').split('=')[1];
const LIMIT = BATCH ? parseInt(BATCH) : Infinity;

const RESEND_KEY = process.env.RESEND_API_KEY;
if (!RESEND_KEY && !DRY) {
  console.error('❌ RESEND_API_KEY missing. Set env var or use --dry-run.');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════
// LOAD
// ═══════════════════════════════════════════════════════════
const templates = JSON.parse(fs.readFileSync(path.join(__dirname, 'peptiq-emails-rebranded.json'), 'utf8'));
const tplByCategory = Object.fromEntries(templates.map(t => [t.category, t]));

// Proper CSV parser: handles empty fields + quoted commas
function parseCsvLine(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } // escaped quote
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map(c => c.trim());
}
const csv = fs.readFileSync(path.join(__dirname, 'peptiq-emails-clean.csv'), 'utf8').trim().split('\n');
const header = parseCsvLine(csv.shift());
const rows = csv.map(line => {
  const cells = parseCsvLine(line);
  const r = {};
  header.forEach((h, i) => r[h] = (cells[i] || '').replace(/^"|"$/g, '').trim());
  return r;
});
console.log(`📋 Loaded ${rows.length} leads · ${templates.length} template categories`);
if (DRY) console.log('🧪 DRY RUN — no sends · no DB writes');

// ═══════════════════════════════════════════════════════════
// CATEGORY MAPPING (csv has: estetica, dermatologia, nutriologo, peso, antiaging, spa, general)
// ═══════════════════════════════════════════════════════════
function mapCategory(cat) {
  const c = (cat || '').toLowerCase().trim();
  const map = {
    estetica: 'estetica',
    medicina_estetica: 'estetica',
    dermatologia: 'dermatologia',
    nutricion: 'nutriologos',
    nutriologo: 'nutriologos',
    nutriologos: 'nutriologos',
    peso: 'peso',
    obesidad: 'peso',
    antiaging: 'anti_aging',
    anti_aging: 'anti_aging',
    longevidad: 'anti_aging',
    spa: 'spa_medico',
    spa_medico: 'spa_medico',
    peptidos: 'peptidos',
    general: 'peptidos',
  };
  return map[c] || 'peptidos'; // generic peptidos fallback
}

function personalize(str, vars) {
  if (!str) return '';
  return str.replace(/\{(\w+)\}/g, (m, key) => vars[key] !== undefined ? vars[key] : m);
}

function bodyToHtml(body) {
  // Plain-text with paragraph breaks → simple HTML
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;font-size:14.5px;line-height:1.6;color:#2b2b2b;max-width:620px;margin:0 auto;padding:24px}
p{margin:0 0 14px}
a{color:#9a7c3a;text-decoration:none}
.signature{margin-top:22px;padding-top:16px;border-top:1px solid #e3ded6;color:#6b6b6b;font-size:12.5px}
.disclaimer{margin-top:14px;font-size:10.5px;color:#9b9b9b;font-style:italic}
</style></head><body>
${escaped.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n')}
<div class="disclaimer">Research products · Not for human consumption. El uso de este producto es responsabilidad de quien lo use, solo para investigación.</div>
</body></html>`;
}

function greetingFor(first_name) {
  if (!first_name) return 'Hola equipo';
  return `Hola ${first_name}`;
}

// ═══════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════
async function sendResend(to, subject, html) {
  const r = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM, to, subject, html, reply_to: REPLY_TO,
      tags: [{ name: 'campaign', value: 'lanzamiento_b2b_v1' }],
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

async function upsertLead(email, name, category, city, nombre_negocio) {
  const existing = await fetch(`${SUPABASE_URL}/rest/v1/leads?email=eq.${encodeURIComponent(email)}&tenant_id=eq.${PEPTIQ_TENANT}&select=id,notes`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  }).then(r => r.json());
  if (existing.length > 0) return existing[0];
  const created = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({
      tenant_id: PEPTIQ_TENANT,
      phone: `email:${email.substring(0, 24)}`,
      name: name || 'Lead',
      email,
      status: 'new',
      source: 'email_blast',
      notes: { category, city, nombre_negocio, blast_campaign: 'lanzamiento_b2b_v1' },
    }),
  }).then(r => r.json());
  return Array.isArray(created) ? created[0] : created;
}

async function logEmailSent(leadId, resendId, template, subject, to) {
  const [lead] = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}&select=notes`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  }).then(r => r.json());
  const notes = lead?.notes || {};
  notes.emails = notes.emails || [];
  notes.emails.push({
    id: resendId, template, subject, to_email: to,
    sent_at: new Date().toISOString(),
    opened_at: null, clicked_at: null, replied_at: null,
  });
  await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════
// PRELOAD: which leads already received campaign 'lanzamiento_b2b_v1'
// ═══════════════════════════════════════════════════════════
async function loadAlreadySent() {
  if (DRY) return new Set();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?tenant_id=eq.${PEPTIQ_TENANT}&select=email,notes&notes->>blast_campaign=eq.lanzamiento_b2b_v1`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  }).then(r => r.json()).catch(() => []);
  const set = new Set();
  if (Array.isArray(r)) {
    for (const lead of r) {
      const emails = lead.notes?.emails || [];
      const hasCampaign = emails.some(e => (e.template || '').includes('lanzamiento_b2b_v1'));
      if (hasCampaign && lead.email) set.add(lead.email.toLowerCase());
    }
  }
  return set;
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
(async () => {
  const alreadySent = await loadAlreadySent();
  if (alreadySent.size > 0) console.log(`⏭️  ${alreadySent.size} leads ya recibieron campaign · se omiten`);
  let sent = 0, skipped = 0, failed = 0, dedup = 0;
  const byCat = {};
  for (const row of rows) {
    if (sent >= LIMIT) break;
    const { email, first_name, name_full, nombre_negocio, category, city } = row;
    if (!email || email.includes('example') || email.includes('placeholder')) { skipped++; continue; }
    if (alreadySent.has(email.toLowerCase())) { dedup++; continue; }

    const catKey = mapCategory(category);
    const tpl = tplByCategory[catKey];
    if (!tpl || !tpl.sequence?.[0]) { console.warn(`⚠️  ${email} · no template for '${category}' → '${catKey}'`); skipped++; continue; }

    const step = tpl.sequence[0]; // always step 1 in blast

    const vars = {
      greeting: greetingFor(first_name),
      first_name: first_name || '',
      nombre_negocio: nombre_negocio || name_full || 'tu negocio',
      ciudad: city || 'México',
      category,
    };

    const subject = personalize(step.subject, vars);
    const body = personalize(step.body, vars) + (step.signature ? '\n\n' + personalize(step.signature, vars) : '');
    const html = bodyToHtml(body);

    byCat[catKey] = (byCat[catKey] || 0) + 1;

    if (DRY) {
      console.log(`[DRY] ${email.padEnd(40)} · ${catKey.padEnd(12)} · ${subject.substring(0, 60)}`);
      sent++; continue;
    }

    try {
      const lead = await upsertLead(email, name_full, catKey, city, nombre_negocio);
      const res = await sendResend(email, subject, html);
      await logEmailSent(lead.id, res.id, `lanzamiento_b2b_v1_${catKey}`, subject, email);
      sent++;
      if (sent % 10 === 0) console.log(`✅ ${sent}/${rows.length} enviados`);
      await sleep(600);
    } catch (e) {
      console.error(`❌ ${email}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\n🎯 Total: ${sent} · dedup ${dedup} · skipped ${skipped} · failed ${failed}`);
  console.log(`📊 Por categoría:`, byCat);
})();
