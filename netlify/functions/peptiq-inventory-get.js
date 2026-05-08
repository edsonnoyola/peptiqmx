// PEPTIQ Inventory · Lee inventario del usuario por WhatsApp o email
// GET /.netlify/functions/peptiq-inventory-get?wa=5214445770445
// GET /.netlify/functions/peptiq-inventory-get?email=user@example.com
//
// Returns: { orders: [...], inventory: { 'BPC-157': 2, 'TB-500': 1 }, lastUpdated }

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
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: 'method not allowed' };
  }

  const qs = event.queryStringParameters || {};
  const wa = normalizeWa(qs.wa);
  const email = (qs.email || '').toLowerCase().trim();

  if (!wa && !email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'wa or email required' }) };
  }

  const userKey = wa ? `wa-${wa}` : `email-${email}`;

  try {
    const store = getStore(getBlobsOpts('peptiq-inventory'));
    const data = await store.get(`users/${userKey}.json`, { type: 'json' });
    if (!data) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ orders: [], inventory: {}, lastUpdated: null }) };
    }
    return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
  } catch (e) {
    console.error('PEPTIQ inventory get error', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed' }) };
  }
};
