// PEPTIQ Quiz Submit · captura evaluación + crea lead en SARA + manda WhatsApp + email
//
// Flow:
//   1. Recibe { name, phone, email, answers, utm, submittedAt }
//   2. Guarda en blob `peptiq-quiz-leads`
//   3. Llama SARA backend para crear/upsert lead con score, notes, intent
//   4. SARA enviará el catálogo + audio bienvenida automáticamente vía detectCatalogIntent
//   5. (Opcional) Manda email transaccional vía Resend si está configurado

const { getStore } = require('@netlify/blobs');

const SARA_BACKEND = process.env.SARA_BACKEND_URL || 'https://sara-backend.edson-633.workers.dev';
const SARA_API_KEY = process.env.SARA_API_KEY || process.env.PEPTIQ_API_KEY || '';
const RESEND_KEY = process.env.RESEND_API_KEY || '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const BUNDLE_BY_OBJECTIVE = {
  longevidad:  { line: 'highlander', catalogTrigger: 'longevidad' },
  recovery:    { line: 'wolverine',  catalogTrigger: 'recuperación' },
  estetica:    { line: 'glow',       catalogTrigger: 'piel' },
  metabolismo: { line: 'prime',      catalogTrigger: 'composición corporal' },
  cognicion:   { line: 'cerebro',    catalogTrigger: 'foco' },
  sueno:       { line: 'sueno',      catalogTrigger: 'no puedo dormir' },
};

function normalizeWa(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? '521' + digits : digits;
}

function getBlobsOpts(name) {
  const opts = { name, consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  return opts;
}

async function pushLeadToSara(payload) {
  if (!SARA_API_KEY) {
    console.warn('SARA_API_KEY not set, skipping SARA lead creation');
    return { ok: false, reason: 'no api key' };
  }
  const wa = payload.phone;
  const a = payload.answers || {};
  const bundle = BUNDLE_BY_OBJECTIVE[a.objetivo] || BUNDLE_BY_OBJECTIVE.longevidad;
  // Compose intent message that triggers SARA's catalog detector
  const msg = `[QUIZ] Hola, completé la evaluación PEPTIQ. Mi objetivo principal es ${bundle.catalogTrigger}. Edad ${a.edad || 'no especificada'}, género ${a.genero || 'no especificado'}, experiencia ${a.experiencia || 'novato'}, presupuesto ${a.presupuesto || 'evaluando'}. Quiero el catálogo y los COAs.`;

  // Score by signals
  let score = 30;
  if (a.experiencia === 'usuario' || a.experiencia === 'profesional') score += 25;
  if (a.presupuesto === '10k_20k' || a.presupuesto === 'mas_20k') score += 25;
  if (a.apoyo_clinico === 'si_actual') score += 10;
  if (a.objetivo === 'metabolismo' || a.objetivo === 'recovery') score += 10;
  score = Math.min(score, 95);

  try {
    const url = `${SARA_BACKEND}/test-lead?phone=${encodeURIComponent(wa)}&name=${encodeURIComponent(payload.name)}&msg=${encodeURIComponent(msg)}&api_key=${encodeURIComponent(SARA_API_KEY)}`;
    const r = await fetch(url, { method: 'GET' });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, score, data };
  } catch (e) {
    console.error('SARA push failed:', e);
    return { ok: false, error: e.message };
  }
}

async function sendResendEmail(payload) {
  if (!RESEND_KEY) return { ok: false, reason: 'no resend key' };
  const a = payload.answers || {};
  const bundle = BUNDLE_BY_OBJECTIVE[a.objetivo] || BUNDLE_BY_OBJECTIVE.longevidad;
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#0E0E0E;color:#F6F3EE;padding:24px;max-width:600px;margin:0 auto">
    <h1 style="font-family:'Playfair Display',serif;font-size:28px;color:#C6A969;font-weight:500">Hola ${payload.name.split(' ')[0]},</h1>
    <p>Gracias por completar la evaluación PEPTIQ. En base a tus respuestas, esta es la línea más relevante para ti:</p>
    <div style="background:#1A1A1A;border:1px solid #C6A969;padding:20px;margin:20px 0">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C6A969">Tu línea recomendada</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:22px;margin:6px 0 12px">${bundle.line.charAt(0).toUpperCase()+bundle.line.slice(1)}</h2>
      <p style="font-size:13px;line-height:1.6">Un especialista PEPTIQ ya recibió tu evaluación. Te contacta hoy mismo por WhatsApp con el catálogo técnico, los COAs Janoshik del lote vigente y un protocolo sugerido.</p>
    </div>
    <p>Mientras tanto, puedes verificar nuestros certificados públicos en <a href="https://peptiqmx.com/verify" style="color:#C6A969">peptiqmx.com/verify</a></p>
    <p style="font-size:11px;color:#8a8274;margin-top:30px;line-height:1.6">PEPTIQ MX · Investigación · Longevidad · México<br>Compuestos exclusivos para investigación. No es producto médico.</p>
  </body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'PEPTIQ MX <hola@peptiqmx.com>',
        to: payload.email,
        subject: `${payload.name.split(' ')[0]}, tu reporte personalizado PEPTIQ`,
        html,
      }),
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'method not allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers: CORS, body: 'invalid json' }; }
  const { name, phone, email, answers, utm, submittedAt } = body;
  if (!name || !phone || !email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'name, phone, email required' }) };
  }
  const wa = normalizeWa(phone);
  if (wa.length < 12) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid phone' }) };

  const lead = {
    id: 'quiz-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    name, phone: wa, email,
    answers, utm,
    submittedAt: submittedAt || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };

  // 1) Save to blob
  try {
    const store = getStore(getBlobsOpts('peptiq-quiz-leads'));
    await store.setJSON(`leads/${lead.id}.json`, lead);
  } catch (e) {
    console.error('blob save failed', e);
  }

  // 2 + 3) Push to SARA + send email in parallel
  const [saraResult, emailResult] = await Promise.all([
    pushLeadToSara(lead),
    sendResendEmail(lead),
  ]);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, leadId: lead.id, sara: saraResult, email: emailResult }),
  };
};
