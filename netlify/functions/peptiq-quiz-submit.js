// PEPTIQ Quiz Submit · captura evaluación + manda WhatsApp DIRECTO + email + lead a SARA
//
// Flow garantizado:
//   1. Recibe { name, phone, email, answers, utm }
//   2. Guarda blob `peptiq-quiz-leads`
//   3. Manda WhatsApp directo via Meta Cloud API (siempre llega)
//   4. Pushea lead a SARA backend (para que SARA continue el flow conversacional)
//   5. Manda email transaccional vía Resend (si está configurado)

const { getStore } = require('@netlify/blobs');

const SARA_BACKEND = process.env.SARA_BACKEND_URL || 'https://sara-backend.edson-633.workers.dev';
const SARA_API_KEY = process.env.SARA_API_KEY || process.env.PEPTIQ_API_KEY || '';
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const META_TOKEN = process.env.PEPTIQ_WA_TOKEN || process.env.META_ACCESS_TOKEN || '';
const META_PHONE_ID = process.env.PEPTIQ_WA_PHONE_ID || process.env.META_PHONE_NUMBER_ID || '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const RESULT_BUNDLES = {
  longevidad:     { line: 'Highlander', stack: 'Highlander Longevity Stack', price: '$14,999', moleculas: 'NAD+ + Epithalon + GHK-Cu', catalog_trigger: 'longevidad' },
  recovery:       { line: 'Wolverine PRO', stack: 'Wolverine PRO', price: '$6,999', moleculas: 'BPC-157 + TB-500 + agua bact', catalog_trigger: 'recuperación' },
  estetica:       { line: 'GLOW', stack: 'GLOW PRO', price: '$9,999', moleculas: 'Trinity + GHK-Cu', catalog_trigger: 'piel' },
  cabello:        { line: 'GLOW Cabello', stack: 'Hair Reset Stack', price: '$7,098', moleculas: 'AHK-Cu + GHK-Cu', catalog_trigger: 'cabello' },
  bajar_peso:     { line: 'Shred (off-menu)', stack: 'Shred Stack', price: '$12,999', moleculas: 'Retatrutide + agua bact', catalog_trigger: 'bajar de peso' },
  grasa_visceral: { line: 'Visceral Cut', stack: 'Visceral Cut Protocol', price: '$10,398', moleculas: 'Tesamorelin + Ipamorelin', catalog_trigger: 'grasa visceral' },
  hipertrofia:    { line: 'TITAN', stack: 'TITAN Performance', price: '$14,999', moleculas: 'Tesamorelin + Ipamorelin + NAD+', catalog_trigger: 'masa muscular' },
  libido:         { line: 'Vitality', stack: 'Vitality Stack', price: '$5,499', moleculas: 'PT-141 + Kisspeptin', catalog_trigger: 'función sexual' },
  sueno:          { line: 'Sleep Reset', stack: 'Sleep Reset', price: '$8,999', moleculas: 'Ipamorelin + Epithalon', catalog_trigger: 'no puedo dormir' },
  cognicion:      { line: 'Neuro Focus', stack: 'Neuro Focus', price: '$8,999', moleculas: 'Semax + Epithalon', catalog_trigger: 'foco' },
  menopausia:     { line: 'Menopausia', stack: 'Menopause Reset', price: 'Consulta', moleculas: 'Kisspeptin + GHK-Cu + Epithalon', catalog_trigger: 'menopausia' },
  gut:            { line: 'Gut Reset', stack: 'Gut Reset', price: '$5,999', moleculas: 'BPC-157 + KPV', catalog_trigger: 'inflamación intestinal' },
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

function calcScore(answers) {
  let s = 30;
  if (answers.experiencia === 'usuario' || answers.experiencia === 'avanzado') s += 25;
  if (answers.experiencia === 'profesional') s += 30;
  if (answers.presupuesto === '10k_20k') s += 20;
  if (answers.presupuesto === 'mas_20k') s += 30;
  if (answers.presupuesto === 'evaluando') s -= 10;
  if (answers.apoyo_clinico === 'si_actual') s += 10;
  if (Array.isArray(answers.sintomas) && answers.sintomas.length >= 3) s += 10;
  return Math.max(20, Math.min(s, 95));
}

async function sendWhatsAppDirect(payload, bundle) {
  if (!META_TOKEN || !META_PHONE_ID) {
    console.warn('Meta WA credentials not set');
    return { ok: false, reason: 'no meta credentials' };
  }
  const firstName = payload.name.split(' ')[0];
  const msg = `Hola ${firstName} 👋\n\n` +
    `Soy SARA, especialista de PEPTIQ MX. Recibí tu evaluación.\n\n` +
    `📋 *Tu protocolo recomendado:*\n` +
    `*${bundle.line}*\n` +
    `Compuestos: ${bundle.moleculas}\n` +
    `Stack completo: ${bundle.stack} · ${bundle.price}\n\n` +
    `En unos segundos te mando:\n` +
    `📕 El catálogo técnico de la línea\n` +
    `🔬 Los COAs Janoshik del lote actual\n` +
    `🎙️ Audio personalizado con detalles\n\n` +
    `Mientras tanto, verifica nuestros certificados públicos: https://peptiqmx.com/verify\n\n` +
    `¿Tienes alguna duda específica? Escríbeme aquí mismo.`;

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${META_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${META_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: payload.phone,
        type: 'text',
        text: { body: msg, preview_url: true }
      }),
    });
    const data = await r.json();
    return { ok: r.ok, status: r.status, wamid: data?.messages?.[0]?.id, error: data?.error };
  } catch (e) {
    console.error('Meta WA send error', e);
    return { ok: false, error: e.message };
  }
}

async function pushLeadToSara(payload, score, bundle) {
  if (!SARA_API_KEY) return { ok: false, reason: 'no api key' };
  // Mensaje que dispara catalogSender de SARA
  const msg = `Hola, completé la evaluación PEPTIQ. Mi objetivo es ${bundle.catalog_trigger}. ` +
    `Edad ${payload.answers.edad || '?'}, ${payload.answers.genero || '?'}, experiencia ${payload.answers.experiencia || 'novato'}. ` +
    `Presupuesto ${payload.answers.presupuesto || 'evaluando'}. Quiero el catálogo y los COAs.`;

  try {
    const url = `${SARA_BACKEND}/test-lead?phone=${encodeURIComponent(payload.phone)}&name=${encodeURIComponent(payload.name)}&msg=${encodeURIComponent(msg)}&api_key=${encodeURIComponent(SARA_API_KEY)}`;
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, score, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function sendResendEmail(payload, bundle) {
  if (!RESEND_KEY) return { ok: false, reason: 'no resend key' };
  const firstName = payload.name.split(' ')[0];
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#0E0E0E;color:#F6F3EE;padding:0;margin:0">
    <div style="max-width:560px;margin:0 auto;padding:30px 24px">
      <div style="text-align:center;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:2px">PEPTIQ</div>
        <div style="font-size:9px;letter-spacing:2.5px;color:#C6A969;margin-top:4px;text-transform:uppercase">Evaluación 2026</div>
      </div>
      <h1 style="font-family:Georgia,serif;font-size:26px;color:#C6A969;font-weight:500;margin:24px 0 12px">Hola ${firstName},</h1>
      <p style="font-size:14px;line-height:1.65;opacity:.85">Gracias por completar la evaluación PEPTIQ. En base a tus respuestas, esta es la línea más relevante para ti:</p>

      <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:22px;margin:22px 0">
        <div style="font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C6A969;margin-bottom:8px">Tu protocolo recomendado</div>
        <h2 style="font-family:Georgia,serif;font-size:22px;margin:6px 0 10px;color:#F6F3EE">${bundle.line}</h2>
        <div style="font-size:13.5px;line-height:1.6;opacity:.85">Compuestos: <strong style="color:#C6A969">${bundle.moleculas}</strong></div>
        <div style="font-size:13.5px;line-height:1.6;opacity:.85;margin-top:6px">Stack completo: <strong style="color:#C6A969">${bundle.stack} · ${bundle.price}</strong></div>
      </div>

      <h3 style="font-family:Georgia,serif;font-size:16px;color:#C6A969;margin:24px 0 10px">¿Qué sigue?</h3>
      <ol style="font-size:13.5px;line-height:1.7;opacity:.85;padding-left:18px">
        <li>Revisa tu <strong>WhatsApp</strong> · ya te mandamos el catálogo técnico</li>
        <li>Verifica los <strong>COAs Janoshik</strong> del lote vigente en <a href="https://peptiqmx.com/verify" style="color:#C6A969">peptiqmx.com/verify</a></li>
        <li>Si tienes dudas, escríbenos directo · sin compromiso</li>
      </ol>

      <div style="text-align:center;margin:30px 0">
        <a href="https://wa.me/5214445770445?text=${encodeURIComponent('Hola, completé la evaluación, quiero info de ' + bundle.stack)}" style="display:inline-block;background:#C6A969;color:#0E0E0E;padding:14px 28px;text-decoration:none;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:12px">Hablar con specialist →</a>
      </div>

      <p style="font-size:11px;color:#8a8274;margin-top:32px;line-height:1.7;border-top:1px solid rgba(255,255,255,.1);padding-top:18px">
        PEPTIQ MX · Investigación · Longevidad · México<br>
        Compuestos exclusivos para investigación. No es producto médico ni sustituto de consulta médica.<br>
        El uso es responsabilidad del investigador. <a href="https://peptiqmx.com/privacidad" style="color:#C6A969">Aviso de privacidad</a>
      </p>
    </div>
  </body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'PEPTIQ MX <hola@peptiqmx.com>',
        to: payload.email,
        subject: `${firstName}, tu protocolo PEPTIQ personalizado`,
        html,
      }),
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'method not allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: CORS, body: 'invalid json' }; }

  const { name, phone, email, answers = {}, utm = {}, submittedAt } = body;
  if (!name || !phone || !email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'name, phone, email required' }) };
  }
  const wa = normalizeWa(phone);
  if (wa.length < 12) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid phone' }) };

  const bundle = RESULT_BUNDLES[answers.objetivo] || RESULT_BUNDLES.longevidad;
  const score = calcScore(answers);

  const lead = {
    id: 'quiz-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    name, phone: wa, email, answers, utm, score,
    submittedAt: submittedAt || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };

  // 1) Save blob
  try {
    const store = getStore(getBlobsOpts('peptiq-quiz-leads'));
    await store.setJSON(`leads/${lead.id}.json`, lead);
  } catch (e) {
    console.error('blob save failed', e);
  }

  // 2) Direct WhatsApp + 3) SARA push + 4) Email — todo en paralelo
  const [waResult, saraResult, emailResult] = await Promise.all([
    sendWhatsAppDirect({ ...lead }, bundle),
    pushLeadToSara(lead, score, bundle),
    sendResendEmail(lead, bundle),
  ]);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      leadId: lead.id,
      whatsapp: waResult,
      sara: saraResult,
      email: emailResult,
    }),
  };
};
