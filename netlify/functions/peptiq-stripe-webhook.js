// PEPTIQ Stripe Webhook → auto-popular inventario del cliente en Blobs
// Trigger: checkout.session.completed
// Effect: guarda compra en peptiq-inventory blob por whatsapp/email del cliente
//
// Env vars requeridas:
//   STRIPE_WEBHOOK_SECRET — para verificar firma
//   NETLIFY_BLOBS_SITE_ID + TOKEN (opcional, autoinjected en Netlify functions)
//
// Stripe Dashboard → Developers → Webhooks → Add endpoint:
//   URL: https://peptiqmx.com/.netlify/functions/peptiq-stripe-webhook
//   Eventos: checkout.session.completed
//   Copia signing secret → set STRIPE_WEBHOOK_SECRET en Netlify env vars

const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

// Stripe link → product mapping (sincroniza con catálogo)
// Si agregas/cambias links de stripe, actualiza este mapeo
const STRIPE_LINK_TO_PRODUCT = {
  // Stacks
  'dRmaEY4AL2Jycmd6Bqds400': { name: 'Wolverine', items: [{ peptide: 'Wolverine Blend', vials: 1 }, { peptide: 'BAC Water', vials: 1 }], amount: 5499 },
  'bJedRa4ALgAo5XP4tids401': { name: 'Wolverine PRO', items: [{ peptide: 'BPC-157', vials: 1 }, { peptide: 'TB-500', vials: 1 }, { peptide: 'BAC Water', vials: 2 }], amount: 6999 },
  'fZu3cwebl0Bqae52lads402': { name: 'GH Boost', items: [{ peptide: 'CJC+Ipa', vials: 1 }, { peptide: 'BAC Water', vials: 1 }], amount: 5499 },
  'cNifZi2sD2Jy1Hzf7Wds40m': { name: 'GLOW Essential', items: [{ peptide: 'Trinity', vials: 1 }, { peptide: 'BAC Water', vials: 1 }], amount: 7999 },
  '3cI5kEgjt5VK5XPaRGds404': { name: 'GLOW PRO', items: [{ peptide: 'Trinity', vials: 1 }, { peptide: 'GHK-Cu', vials: 1 }, { peptide: 'BAC Water', vials: 2 }], amount: 9999 },
  '5kQ3cw4ALesg2LD3peds405': { name: 'Gut Reset', items: [{ peptide: 'BPC-157', vials: 1 }, { peptide: 'KPV', vials: 1 }, { peptide: 'BAC Water', vials: 2 }], amount: 5999 },
  '00w9AUd7h0Bq2LDf7Wds406': { name: 'Neuro Focus', items: [{ peptide: 'Semax', vials: 1 }, { peptide: 'Epithalon', vials: 1 }, { peptide: 'BAC Water', vials: 2 }], amount: 8999 },
  '6oU3cwd7hbg4gCt7Fuds407': { name: 'Highlander Longevity', items: [{ peptide: 'NAD+', vials: 1 }, { peptide: 'Epithalon', vials: 1 }, { peptide: 'GHK-Cu', vials: 1 }, { peptide: 'BAC Water', vials: 3 }], amount: 14999 },
  '4gM00E5aB2DN10Ydqi8wQ02': { name: 'TITAN Performance', items: [{ peptide: 'Tesamorelin', vials: 1 }, { peptide: 'Ipamorelin', vials: 1 }, { peptide: 'NAD+', vials: 1 }, { peptide: 'BAC Water', vials: 3 }], amount: 14999 },
};

function verifyStripeSig(payload, sig, secret) {
  if (!sig || !secret) return false;
  try {
    const parts = sig.split(',').reduce((acc, p) => {
      const [k, v] = p.split('=');
      acc[k] = v;
      return acc;
    }, {});
    if (!parts.t || !parts.v1) return false;
    const signedPayload = `${parts.t}.${payload}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    // Constant-time compare
    if (expected.length !== parts.v1.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch (e) {
    return false;
  }
}

function normalizeWa(wa) {
  if (!wa) return '';
  let n = String(wa).replace(/\D/g, '');
  if (n.length === 10) n = '521' + n;
  return n;
}

function getBlobsOpts(name) {
  const opts = { name, consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  return opts;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'method not allowed' };
  }

  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  // Verify signature (skip if no secret set — dev mode)
  if (secret) {
    const valid = verifyStripeSig(event.body, sig, secret);
    if (!valid) {
      console.warn('PEPTIQ stripe webhook · invalid signature');
      return { statusCode: 400, body: 'invalid signature' };
    }
  } else {
    console.warn('PEPTIQ stripe webhook · STRIPE_WEBHOOK_SECRET no configurado · skipping verification');
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'invalid json' };
  }

  if (payload.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ skipped: payload.type }) };
  }

  const session = payload.data?.object || {};
  const customerEmail = session.customer_details?.email || session.customer_email || '';
  const customerPhone = session.customer_details?.phone || '';
  const wa = normalizeWa(customerPhone);
  const amount = (session.amount_total || 0) / 100;
  const stripePaymentLinkId = session.payment_link || '';

  // Identify product from payment_link or amount
  let product = STRIPE_LINK_TO_PRODUCT[stripePaymentLinkId];
  if (!product) {
    // Fallback: match by amount
    product = Object.values(STRIPE_LINK_TO_PRODUCT).find((p) => p.amount === amount) || null;
  }
  if (!product) {
    console.warn(`PEPTIQ stripe webhook · producto no identificado · payment_link=${stripePaymentLinkId} amount=${amount}`);
    return { statusCode: 200, body: JSON.stringify({ skipped: 'product unknown' }) };
  }

  if (!wa && !customerEmail) {
    console.warn('PEPTIQ stripe webhook · sin WA ni email · no se puede asignar a usuario');
    return { statusCode: 200, body: JSON.stringify({ skipped: 'no user identifier' }) };
  }

  const userKey = wa ? `wa-${wa}` : `email-${customerEmail.toLowerCase()}`;
  const order = {
    orderId: session.id,
    productName: product.name,
    items: product.items,
    amount,
    stripeSessionId: session.id,
    paymentLinkId: stripePaymentLinkId,
    purchasedAt: new Date().toISOString(),
    customerEmail,
    customerPhone: wa,
  };

  try {
    const inventoryStore = getStore(getBlobsOpts('peptiq-inventory'));
    const existing = (await inventoryStore.get(`users/${userKey}.json`, { type: 'json' })) || { orders: [], inventory: {} };

    // Append order
    existing.orders = existing.orders || [];
    existing.orders.push(order);

    // Update inventory totals
    existing.inventory = existing.inventory || {};
    for (const item of product.items) {
      existing.inventory[item.peptide] = (existing.inventory[item.peptide] || 0) + item.vials;
    }
    existing.lastUpdated = new Date().toISOString();

    await inventoryStore.setJSON(`users/${userKey}.json`, existing);
    console.log(`PEPTIQ stripe webhook · order recorded for ${userKey}: ${product.name} ($${amount})`);
  } catch (e) {
    console.error('PEPTIQ stripe webhook · blob write failed', e);
    return { statusCode: 500, body: JSON.stringify({ error: 'storage failed' }) };
  }

  // ALSO write to sales/ALL.json (admin CRM) so order shows up in Pedidos tab
  try {
    const salesStore = getStore(getBlobsOpts('peptiq-sales'));
    const salesData = (await salesStore.get('sales/ALL.json', { type: 'json' })) || { sales: [] };
    const customerName = session.customer_details?.name || customerEmail.split('@')[0] || 'Cliente';
    const city = session.customer_details?.address?.city || '';
    const now = new Date();
    const totalProductCost = (product.items || []).reduce((sum, it) => {
      const costMap = { 'BPC-157': 75, 'TB-500': 85, 'Trinity': 250, 'GHK-Cu': 60, 'NAD+': 126, 'Tesamorelin': 120, 'Ipamorelin': 45, 'CJC+Ipa': 65, 'Epithalon': 80, 'Semax': 70, 'KPV': 55, 'Wolverine Blend': 95, 'BAC Water': 5 };
      return sum + ((costMap[it.peptide] || 50) * (it.vials || 1));
    }, 0);
    const shippingCharged = 650;
    const shippingCost = 650;
    const totalCharged = amount + shippingCharged;
    const netProfit = totalCharged - totalProductCost - shippingCost;
    const margin = totalCharged > 0 ? +(netProfit / totalCharged * 100).toFixed(1) : 0;
    salesData.sales.push({
      id: session.id,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      customerName,
      customerPhone: wa,
      customerEmail,
      customerCity: city,
      items: product.items,
      productName: product.name,
      shippingCharged,
      shippingCost,
      totalCharged,
      productCost: totalProductCost,
      netProfit,
      margin,
      shippingStatus: 'pending',
      trackingNumber: '',
      courier: '',
      notes: `Pedido Stripe · ${product.name}`,
      source: 'stripe-webhook',
      stripeSessionId: session.id,
      createdAt: now.toISOString(),
    });
    await salesStore.setJSON('sales/ALL.json', salesData);
    console.log(`PEPTIQ stripe webhook · ALSO recorded in sales/ALL.json`);
  } catch (e) {
    console.error('PEPTIQ stripe webhook · sales blob write failed (non-fatal)', e);
  }

  // ─── EMAIL TRANSACCIONAL POST-COMPRA con disclaimer legal RUO ───
  try {
    if (customerEmail && process.env.RESEND_API_KEY) {
      const orderShort = session.id.slice(-8).toUpperCase();
      const customerName = session.customer_details?.name || customerEmail.split('@')[0] || 'Investigador/a';
      const emailHtml = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;color:#1A1A1A;line-height:1.6">
<div style="text-align:center;border-bottom:2px solid #C4A265;padding-bottom:16px;margin-bottom:20px">
<div style="font-size:28px;font-weight:700;letter-spacing:1px">PEPTIQ<sup style="font-size:12px;color:#C4A265">MX</sup></div>
<div style="font-size:10px;letter-spacing:3px;color:#888">R E S E A R C H · G R A D E</div>
</div>
<h2 style="color:#988646;font-size:20px">Hola ${customerName},</h2>
<p>Confirmamos recepción de tu pedido <strong>#${orderShort}</strong>.</p>
<div style="background:#F9F8F6;padding:16px;border-left:3px solid #C4A265;margin:18px 0">
<div style="font-size:11px;letter-spacing:2px;color:#988646;font-weight:700;margin-bottom:6px">PEDIDO</div>
<div style="font-size:16px;font-weight:700">${product.name}</div>
<div style="font-size:13px;color:#666;margin-top:4px">$${amount.toLocaleString('es-MX')} MXN · Envío 24-72h MX</div>
</div>
<div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:14px;margin:18px 0;border-radius:4px">
<div style="font-size:11px;letter-spacing:2px;color:#92400E;font-weight:700;margin-bottom:6px">★ RECORDATORIO LEGAL</div>
<div style="font-size:13px;color:#78350F;line-height:1.7">Al confirmar esta compra aceptaste que los productos PEPTIQ son material <strong>research-grade exclusivamente para investigación científica</strong>, <strong>NO son medicamentos</strong>, <strong>NO están aprobados</strong> por COFEPRIS/FDA para uso humano o animal, y que <strong>el uso y aplicación es responsabilidad exclusiva tuya</strong>.</div>
</div>
<p><strong>COAs de tu pedido:</strong> <a href="https://peptiqmx.com/coa/" style="color:#988646">peptiqmx.com/coa/</a></p>
<p><strong>Dudas research:</strong><br>WhatsApp: <a href="https://wa.me/5214445770445" style="color:#988646">+52 1 444 577 0445</a><br>Email: <a href="mailto:contacto@peptiqmx.com" style="color:#988646">contacto@peptiqmx.com</a></p>
<div style="margin-top:24px;padding-top:16px;border-top:1px solid #E8E4E0;font-size:11px;color:#888;line-height:1.6">
<strong>PEPTIQ Research</strong> · Material exclusivo para investigación científica · solo +18 · NO apto para consumo humano ni animal · El uso es responsabilidad de quien lo aplique · RUO.<br><br>
<a href="https://peptiqmx.com/terminos.html" style="color:#988646">Términos</a> · <a href="https://peptiqmx.com/privacidad.html" style="color:#988646">Privacidad</a> · <a href="https://peptiqmx.com/eliminar-datos.html" style="color:#988646">Eliminación de Datos</a>
</div>
</div>`;
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PEPTIQ Research <contacto@peptiqmx.com>',
          to: [customerEmail],
          subject: `Pedido confirmado #${orderShort} · PEPTIQ Research`,
          html: emailHtml,
        }),
      });
      console.log(`PEPTIQ webhook · email transaccional sent to ${customerEmail} · ${emailRes.status}`);
    }
  } catch (e) {
    console.error('PEPTIQ webhook · email send failed (non-fatal)', e);
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, product: product.name, user: userKey }) };
};
