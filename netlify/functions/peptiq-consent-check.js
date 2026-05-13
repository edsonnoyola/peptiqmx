// PEPTIQ Consent Check · server-truth gate
// GET /api/consent-check?email=...&wa=...
// Returns { accepted: true/false, timestamp? }

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method not allowed' };

  const url = new URL(event.rawUrl);
  const email = (url.searchParams.get('email') || '').toLowerCase();
  const wa = (url.searchParams.get('wa') || '').replace(/\D/g, '');

  if (!email && !wa) {
    return { statusCode: 400, body: JSON.stringify({ accepted: false, reason: 'identifier required' }) };
  }

  try {
    const opts = { name: 'peptiq-legal' };
    if (process.env.NETLIFY_BLOBS_TOKEN) {
      opts.token = process.env.NETLIFY_BLOBS_TOKEN;
      opts.siteID = process.env.NETLIFY_SITE_ID;
    }
    const store = getStore(opts);
    // Search recent consents by email/wa
    const list = await store.list({ prefix: 'consent/' });
    const blobs = (list.blobs || []).slice(-100);
    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: 'json' });
      if (data && (data.email === email || data.whatsapp === wa) && data.accepted) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accepted: true, timestamp: data.timestamp })
        };
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepted: false })
    };
  } catch (e) {
    console.error('consent-check error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
