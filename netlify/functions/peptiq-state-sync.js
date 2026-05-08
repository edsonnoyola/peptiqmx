// PEPTIQ State Sync · Cloud backup del estado completo de la app
// POST /api/state-sync · Guarda todo el localStorage del usuario (cifrado opcional)
// GET /api/state-sync?wa=521... · Restaura estado al iniciar app en otro device
//
// Usa WhatsApp como identidad (mismo número = mismo state cross-device)
// Token simple: HMAC del WA con SECRET. Cliente lo guarda y lo envía.

const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

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

function makeToken(wa) {
  const secret = process.env.PEPTIQ_STATE_SECRET || 'peptiq-default-state-secret-change-me';
  return crypto.createHmac('sha256', secret).update(wa).digest('hex').slice(0, 32);
}

function verifyToken(wa, token) {
  if (!wa || !token) return false;
  const expected = makeToken(wa);
  if (expected.length !== token.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch (e) {
    return false;
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Peptiq-Token',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };

  // GET — restore (or first-time, returns issued token)
  if (event.httpMethod === 'GET') {
    const wa = normalizeWa(event.queryStringParameters?.wa);
    if (!wa || wa.length < 12) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'wa required' }) };
    }
    const token = makeToken(wa);
    try {
      const store = getStore(getBlobsOpts('peptiq-state'));
      const data = await store.get(`states/${wa}.json`, { type: 'json' });
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, state: data || null }),
      };
    } catch (e) {
      console.error('PEPTIQ state get error', e);
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed' }) };
    }
  }

  // POST — backup
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: CORS, body: 'invalid json' };
  }
  const { wa: rawWa, token, state } = body;
  const wa = normalizeWa(rawWa);
  if (!wa || wa.length < 12) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'wa required' }) };
  }
  if (!verifyToken(wa, token)) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'invalid token' }) };
  }
  if (!state || typeof state !== 'object') {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'state required' }) };
  }
  // Cap size to 100KB to prevent abuse
  const stateStr = JSON.stringify(state);
  if (stateStr.length > 100 * 1024) {
    return { statusCode: 413, headers: CORS, body: JSON.stringify({ error: 'state too large' }) };
  }

  try {
    const store = getStore(getBlobsOpts('peptiq-state'));
    const record = {
      ...state,
      _syncedAt: new Date().toISOString(),
      _wa: wa,
    };
    await store.setJSON(`states/${wa}.json`, record);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, syncedAt: record._syncedAt }) };
  } catch (e) {
    console.error('PEPTIQ state post error', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed' }) };
  }
};
