// PEPTIQ Push Subscribe · Guarda suscripción Web Push del usuario
// POST { endpoint, keys: { p256dh, auth }, wa?, email?, peptide? }
//
// Para que las notifications lleguen necesitas también:
//   1. Generar VAPID keys: npx web-push generate-vapid-keys
//   2. Set en Netlify env: VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY + VAPID_SUBJECT (mailto:tu@email.com)
//   3. Cron `peptiq-reminder-cron.js` debe usar web-push para mandar notifications a las suscripciones

const { getStore } = require('@netlify/blobs');

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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: CORS, body: 'invalid json' };
  }

  const { endpoint, keys, wa, email, peptide, recommendedHour, timezone } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'endpoint + keys required' }) };
  }

  const waNorm = normalizeWa(wa);
  const userKey = waNorm ? `wa-${waNorm}` : email ? `email-${email.toLowerCase()}` : `endpoint-${Buffer.from(endpoint).toString('base64').slice(0, 24)}`;

  const subscription = {
    endpoint,
    keys,
    wa: waNorm,
    email: email || '',
    peptide: peptide || '',
    recommendedHour: recommendedHour || '07:30',
    timezone: timezone || 'America/Mexico_City',
    subscribedAt: new Date().toISOString(),
    enabled: true,
  };

  try {
    const store = getStore(getBlobsOpts('peptiq-push-subs'));
    await store.setJSON(`subs/${userKey}.json`, subscription);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, key: userKey }) };
  } catch (e) {
    console.error('PEPTIQ push subscribe error', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed' }) };
  }
};
