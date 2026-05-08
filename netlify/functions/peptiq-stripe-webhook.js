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
  'dRmcN62sDfwk3PH2lads403': { name: 'GLOW Essential', items: [{ peptide: 'Trinity', vials: 1 }, { peptide: 'BAC Water', vials: 1 }], amount: 7499 },
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

  return { statusCode: 200, body: JSON.stringify({ ok: true, product: product.name, user: userKey }) };
};
