// PEPTIQ · server-side legal consent log
// Stores every "He leído y acepto" with timestamp + IP + UA in Blob storage
// Endpoint: POST /api/consent-log
const { getStore } = require('@netlify/blobs');

function getBlobsOpts(name) {
  const opts = { name };
  if (process.env.NETLIFY_BLOBS_TOKEN && process.env.NETLIFY_SITE_ID) {
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
    opts.siteID = process.env.NETLIFY_SITE_ID;
  }
  return opts;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors() };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'invalid json' }) }; }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  const userAgent = (event.headers['user-agent'] || '').slice(0, 240);
  const now = new Date().toISOString();

  const record = {
    timestamp: now,
    ip,
    userAgent,
    type: body.type || 'consent_app_v1',       // consent_app_v1 / consent_checkout_v2 / etc
    email: (body.email || '').toLowerCase().slice(0, 120),
    whatsapp: (body.whatsapp || '').replace(/\D/g, '').slice(0, 15),
    name: (body.name || '').slice(0, 80),
    accepted: body.accepted === true,
    checkboxes: body.checkboxes || {},
    version: body.version || '1.0',
    source: body.source || 'app',
  };

  if (!record.accepted) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'must accept' }) };
  }

  try {
    const store = getStore(getBlobsOpts('peptiq-legal'));
    const key = `consent/${now.slice(0,10)}/${record.whatsapp || record.email || 'anon'}-${Date.now()}.json`;
    await store.setJSON(key, record);
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, key }) };
  } catch (e) {
    console.error('consent-log write failed:', e);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: 'storage failed' }) };
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}
