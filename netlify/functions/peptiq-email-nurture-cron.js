// PEPTIQ Email Nurture Cron · corre cada hora
// Lee leads del blob `peptiq-quiz-leads` y manda email D+2, D+5, D+10, D+20 según corresponda
// Marca cada email enviado en el lead para no duplicar

const { getStore } = require('@netlify/blobs');

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const FROM = 'PEPTIQ MX <hola@peptiqmx.com>';

const BUNDLES = {
  longevidad:     { stack: 'Highlander Longevity Stack', line: 'Highlander', price: '$14,999', moleculas: 'NAD+ + Epithalon + GHK-Cu', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-HIGHLANDER-Catalogo.pdf' },
  recovery:       { stack: 'Wolverine PRO', line: 'Wolverine', price: '$6,999', moleculas: 'BPC-157 + TB-500', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-WOLVERINE-Catalogo.pdf' },
  estetica:       { stack: 'GLOW PRO', line: 'GLOW', price: '$9,999', moleculas: 'Trinity + GHK-Cu', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-GLOW-Catalogo.pdf' },
  cabello:        { stack: 'Hair Reset Stack', line: 'GLOW Cabello', price: '$7,098', moleculas: 'AHK-Cu + GHK-Cu', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-CABELLO-B2C-V2.pdf' },
  bajar_peso:     { stack: 'Shred Stack', line: 'Shred', price: '$12,999', moleculas: 'Retatrutide', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-SHRED-Catalogo.pdf' },
  grasa_visceral: { stack: 'Visceral Cut Protocol', line: 'Visceral Cut', price: '$10,398', moleculas: 'Tesamorelin + Ipamorelin', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-GRASA-VISCERAL-B2C-V2.pdf' },
  hipertrofia:    { stack: 'TITAN Performance', line: 'Prime', price: '$14,999', moleculas: 'Tesamorelin + Ipamorelin + NAD+', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-PRIME-Catalogo.pdf' },
  libido:         { stack: 'Vitality Stack', line: 'Vitality', price: '$5,499', moleculas: 'PT-141 + Kisspeptin', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-FUNCION-SEXUAL-B2C-V2.pdf' },
  sueno:          { stack: 'Sleep Reset', line: 'Sleep', price: '$8,999', moleculas: 'Ipamorelin + Epithalon', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-SUENO-B2C-V2.pdf' },
  cognicion:      { stack: 'Neuro Focus', line: 'Neuro', price: '$8,999', moleculas: 'Semax + Epithalon', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-CEREBRO-B2C-V2.pdf' },
  menopausia:     { stack: 'Menopause Reset', line: 'Menopausia', price: 'Consulta', moleculas: 'Kisspeptin + GHK-Cu + Epithalon', catalog: 'https://peptiqmx.com/catalogos-b2c/PEPTIQ-MENOPAUSIA-B2C-V2.pdf' },
  gut:            { stack: 'Gut Reset', line: 'Wolverine Gut', price: '$5,999', moleculas: 'BPC-157 + KPV', catalog: 'https://peptiqmx.com/catalogos/PEPTIQ-WOLVERINE-Catalogo.pdf' },
};

// ─── Plantillas de los 4 emails de nurture ───
function emailLayout(content, firstName) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#0E0E0E;color:#F6F3EE;padding:0;margin:0">
    <div style="max-width:560px;margin:0 auto;padding:30px 24px">
      <div style="text-align:center;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:2px">PEPTIQ</div>
        <div style="font-size:9px;letter-spacing:2.5px;color:#C6A969;margin-top:4px;text-transform:uppercase">Investigación · Longevidad · México</div>
      </div>
      ${content}
      <p style="font-size:11px;color:#8a8274;margin-top:32px;line-height:1.7;border-top:1px solid rgba(255,255,255,.1);padding-top:18px">
        PEPTIQ MX · Compuestos exclusivos para investigación. No es producto médico ni sustituto de consulta médica.<br>
        <a href="https://peptiqmx.com" style="color:#C6A969">peptiqmx.com</a> · <a href="https://wa.me/5214445770445" style="color:#C6A969">WhatsApp specialist</a> · <a href="https://peptiqmx.com/privacidad" style="color:#C6A969">Privacidad</a>
      </p>
    </div>
  </body></html>`;
}

function ctaButton(text, url) {
  return `<div style="text-align:center;margin:24px 0">
    <a href="${url}" style="display:inline-block;background:#C6A969;color:#0E0E0E;padding:14px 28px;text-decoration:none;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:12px">${text}</a>
  </div>`;
}

function email_d2(lead, bundle) {
  const fn = lead.name.split(' ')[0];
  const content = `
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#C6A969;font-weight:500;margin:24px 0 12px">3 preguntas que más nos hacen sobre ${bundle.line}</h1>
    <p style="font-size:14px;line-height:1.65;opacity:.85">${fn}, vimos que viste el catálogo. Antes de decidirte, quizás te ayudan estas respuestas:</p>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:16px;color:#C6A969;margin-bottom:8px">1. ¿Cómo verifico que es real?</h3>
      <p style="font-size:13.5px;line-height:1.6;opacity:.85">Cada vial tiene un QR que lleva a la página pública de su COA Janoshik (laboratorio acreditado UE). Lo verificas tú antes de pagar. Somos la única marca en México que publica esto por lote.</p>
    </div>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:16px;color:#C6A969;margin-bottom:8px">2. ¿Necesito médico para investigar con esto?</h3>
      <p style="font-size:13.5px;line-height:1.6;opacity:.85">Recomendamos siempre asesoría profesional. Te conectamos con specialists que conocen los compuestos research-grade si quieres. Sin costo extra, sin presión.</p>
    </div>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:16px;color:#C6A969;margin-bottom:8px">3. ¿En cuánto veo resultados?</h3>
      <p style="font-size:13.5px;line-height:1.6;opacity:.85">Depende del compuesto y objetivo. La literatura científica reporta ventanas: BPC-157 4-6 semanas, GHK-Cu 30-60 días, Tesamorelin 8-12 semanas. Te mandamos los papers de respaldo si quieres.</p>
    </div>

    ${ctaButton('Hablar con specialist →', 'https://wa.me/5214445770445?text=' + encodeURIComponent('Hola, vi el email D+2 sobre ' + bundle.line + ', tengo una duda'))}
  `;
  return {
    subject: `${fn}, las 3 dudas más comunes sobre ${bundle.line}`,
    html: emailLayout(content, fn),
  };
}

function email_d5(lead, bundle) {
  const fn = lead.name.split(' ')[0];
  const content = `
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#C6A969;font-weight:500;margin:24px 0 12px">${fn}, el código LANZA20 vence pronto</h1>
    <p style="font-size:14px;line-height:1.65;opacity:.85">Si todavía estás considerando el protocolo <strong style="color:#C6A969">${bundle.stack}</strong>, esta semana cierra la promo de lanzamiento:</p>

    <div style="background:#1A1A1A;border:1px solid #C6A969;padding:22px;margin:20px 0;text-align:center">
      <div style="font-size:10px;letter-spacing:2.5px;color:#C6A969;text-transform:uppercase;margin-bottom:8px">Código de lanzamiento</div>
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;letter-spacing:3px">LANZA20</div>
      <div style="font-size:13px;opacity:.7;margin-top:6px">−20% en tu primer pedido · vence esta semana</div>
    </div>

    <p style="font-size:14px;line-height:1.65;opacity:.85">Tu protocolo recomendado:</p>
    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:14px 0">
      <div style="font-size:10px;letter-spacing:2px;color:#C6A969;text-transform:uppercase;margin-bottom:6px">${bundle.line}</div>
      <h2 style="font-family:Georgia,serif;font-size:20px;color:#F6F3EE;margin-bottom:8px">${bundle.stack}</h2>
      <div style="font-size:13.5px;opacity:.85;line-height:1.6">${bundle.moleculas}</div>
      <div style="font-size:13.5px;color:#C6A969;margin-top:6px">Precio: <strong>${bundle.price}</strong></div>
    </div>

    <p style="font-size:13px;color:#8a8274;line-height:1.6;font-style:italic;margin:14px 0">Después de esta semana, se aplica el precio Elite normal.</p>

    ${ctaButton('Cerrar pedido con LANZA20 →', 'https://wa.me/5214445770445?text=' + encodeURIComponent('Hola, quiero cerrar ' + bundle.stack + ' con LANZA20'))}
  `;
  return {
    subject: `Última semana del LANZA20 · -20% en ${bundle.stack}`,
    html: emailLayout(content, fn),
  };
}

function email_d10(lead, bundle) {
  const fn = lead.name.split(' ')[0];
  const content = `
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#C6A969;font-weight:500;margin:24px 0 12px">¿Por qué tantos profesionales eligen ${bundle.line}?</h1>
    <p style="font-size:14px;line-height:1.65;opacity:.85">${fn}, cuando alguien decide investigar compuestos research-grade, casi siempre revisa 3 cosas antes de invertir:</p>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:15px;color:#C6A969;margin-bottom:6px">✓ Pureza verificable independiente</h3>
      <p style="font-size:13px;line-height:1.6;opacity:.85">Janoshik Analytical es el laboratorio referencia para verificación de péptidos en Europa. Acreditado ISO/IEC 17025. Publicamos los COAs por lote en peptiqmx.com/verify.</p>
    </div>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:15px;color:#C6A969;margin-bottom:6px">✓ Cadena de frío garantizada</h3>
      <p style="font-size:13px;line-height:1.6;opacity:.85">Los péptidos liofilizados pierden actividad sin transporte refrigerado. PEPTIQ envía con cadena de frío 24-72h México. Si recibes algo dañado, te reemplazamos sin preguntas.</p>
    </div>

    <div style="background:#1A1A1A;border-left:3px solid #C6A969;padding:18px 20px;margin:18px 0">
      <h3 style="font-family:Georgia,serif;font-size:15px;color:#C6A969;margin-bottom:6px">✓ Soporte 1-on-1 con specialist</h3>
      <p style="font-size:13px;line-height:1.6;opacity:.85">Cada cliente PEPTIQ tiene acceso a un specialist por WhatsApp para reconstitución, dosing, timing y dudas técnicas. Sin costo extra.</p>
    </div>

    <p style="font-size:14px;line-height:1.65;opacity:.85;margin-top:18px">Si quieres profundizar antes de decidir, tu catálogo técnico de <strong style="color:#C6A969">${bundle.line}</strong> sigue disponible:</p>

    ${ctaButton('Ver catálogo técnico →', bundle.catalog)}
    ${ctaButton('Hablar con specialist →', 'https://wa.me/5214445770445?text=' + encodeURIComponent('Hola, tengo dudas técnicas sobre ' + bundle.line))}
  `;
  return {
    subject: `${fn}, las 3 cosas que importan en péptidos research-grade`,
    html: emailLayout(content, fn),
  };
}

function email_d20(lead, bundle) {
  const fn = lead.name.split(' ')[0];
  const content = `
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#C6A969;font-weight:500;margin:24px 0 12px">¿Sigue en pie tu interés, ${fn}?</h1>
    <p style="font-size:14px;line-height:1.65;opacity:.85">Es nuestro último contacto si no nos respondes. No queremos saturar tu bandeja.</p>

    <p style="font-size:14px;line-height:1.65;opacity:.85;margin:14px 0">Si tu objetivo cambió, puedes volver a tomar la evaluación:</p>
    ${ctaButton('Repetir evaluación →', 'https://peptiqmx.com/evaluacion')}

    <p style="font-size:14px;line-height:1.65;opacity:.85;margin:18px 0">Si sigues evaluando ${bundle.line}, tu specialist está aquí:</p>
    ${ctaButton('Conversar con specialist →', 'https://wa.me/5214445770445?text=' + encodeURIComponent('Hola, sigo evaluando ' + bundle.line))}

    <p style="font-size:13px;color:#8a8274;line-height:1.6;font-style:italic;margin-top:24px">Si no es momento, no pasa nada. Te dejamos de escribir aquí. Cuando quieras volver, peptiqmx.com siempre está abierto.</p>
  `;
  return {
    subject: `${fn}, último contacto · ¿sigues investigando?`,
    html: emailLayout(content, fn),
  };
}

const SCHEDULE = [
  { dayOffset: 2,  flag: 'sent_d2',  fn: email_d2  },
  { dayOffset: 5,  flag: 'sent_d5',  fn: email_d5  },
  { dayOffset: 10, flag: 'sent_d10', fn: email_d10 },
  { dayOffset: 20, flag: 'sent_d20', fn: email_d20 },
];

function getBlobsOpts(name) {
  const opts = { name, consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  return opts;
}

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) return { ok: false, reason: 'no resend key' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

exports.handler = async (event) => {
  const store = getStore(getBlobsOpts('peptiq-quiz-leads'));
  const list = await store.list({ prefix: 'leads/' });
  let processed = 0, sent = 0, skipped = 0, errors = 0;
  const now = Date.now();

  for (const blob of (list.blobs || [])) {
    processed++;
    try {
      const lead = await store.get(blob.key, { type: 'json' });
      if (!lead || !lead.email || !lead.submittedAt) { skipped++; continue; }
      // Skip si ya compró (notes.last_purchase) o si dijo STOP
      if (lead.unsubscribed || lead.purchased) { skipped++; continue; }

      const ageMs = now - new Date(lead.submittedAt).getTime();
      const ageDays = Math.floor(ageMs / 86400000);

      const objetivo = lead?.answers?.objetivo || 'longevidad';
      const bundle = BUNDLES[objetivo] || BUNDLES.longevidad;

      lead.nurtureFlags = lead.nurtureFlags || {};

      for (const step of SCHEDULE) {
        if (ageDays >= step.dayOffset && !lead.nurtureFlags[step.flag]) {
          const { subject, html } = step.fn(lead, bundle);
          const r = await sendEmail(lead.email, subject, html);
          if (r.ok) {
            lead.nurtureFlags[step.flag] = new Date().toISOString();
            sent++;
            console.log(`✅ Email ${step.flag} sent to ${lead.email}`);
          } else {
            errors++;
            console.warn(`❌ Email ${step.flag} failed for ${lead.email}:`, r);
          }
          break; // un email por lead por run
        }
      }

      // Save flags back
      if (Object.keys(lead.nurtureFlags).length > 0) {
        await store.setJSON(blob.key, lead);
      }
    } catch (e) {
      errors++;
      console.error('Error processing lead', blob.key, e);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, processed, sent, skipped, errors }),
  };
};
