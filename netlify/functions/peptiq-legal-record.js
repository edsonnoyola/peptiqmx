// PEPTIQ Legal Record Persistence
// Writes consent/action_ack/health_profile records to Netlify Blobs
// (durable object storage with automatic retention, no DB setup needed).
// Records can be retrieved via Netlify CLI: `netlify blobs:list peptiq-legal`
// or programmatically via the Blobs API.

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid JSON' }) };
  }

  const recordType = body.record_type;
  if (!['consent', 'action_ack', 'health_profile', 'visit', 'cta_click'].includes(recordType)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid record_type' }) };
  }

  const ip = event.headers['x-nf-client-connection-ip']
          || event.headers['x-forwarded-for']
          || event.headers['client-ip']
          || null;
  const userAgent = (event.headers['user-agent'] || '').slice(0, 500);
  const requestId = event.headers['x-nf-request-id'] || null;
  const timestamp = new Date().toISOString();

  const record = {
    record_type: recordType,
    email: (body.email || '').slice(0, 255) || null,
    signature: (body.signature || '').slice(0, 255) || null,
    action_key: (body.action_key || '').slice(0, 100) || null,
    agreement_version: (body.agreement_version || 'v1.5-2026-05').slice(0, 50),
    payload: body.payload || body,
    user_agent: userAgent,
    client_ip: ip,
    netlify_request_id: requestId,
    created_at: timestamp
  };

  // Generate unique key: {YYYY-MM-DD}/{type}/{timestamp}-{random}.json
  const date = timestamp.slice(0, 10);
  const random = Math.random().toString(36).slice(2, 10);
  const key = `${date}/${recordType}/${timestamp}-${random}.json`;

  try {
    const storeOpts = { name: 'peptiq-legal', consistency: 'strong' };
    if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
      storeOpts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
      storeOpts.token = process.env.NETLIFY_BLOBS_TOKEN;
    }
    const store = getStore(storeOpts);
    await store.setJSON(key, record, {
      metadata: {
        record_type: recordType,
        email: record.email || 'anon',
        signature: record.signature || '',
        action_key: record.action_key || ''
      }
    });

    // Also append to a daily index for easy listing
    const indexKey = `_index/${date}.jsonl`;
    let existingIndex = '';
    try {
      const existing = await store.get(indexKey);
      if (existing) existingIndex = existing;
    } catch (e) {}
    const indexLine = JSON.stringify({ key, ...record }) + '\n';
    await store.set(indexKey, existingIndex + indexLine);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ok: true, key, ts: timestamp })
    };
  } catch (err) {
    console.error('peptiq-legal-record error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
