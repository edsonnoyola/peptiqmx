// PEPTIQ · Auto-encuesta CRON
// Trigger: hourly (configured in netlify.toml)
// Logic:
//   1. Read sales/ALL.json from peptiq-sales-manual blob
//   2. For each sale: shippingStatus=delivered AND no encuestaSentAt AND deliveredAt >24h ago
//   3. Call SARA backend /admin/peptiq/send-encuesta to dispatch template
//   4. Mark encuestaSentAt in blob
//
// Env vars:
//   PEPTIQ_ADMIN_KEY   — protects PATCH/POST on peptiq-sales-manual
//   SARA_API_SECRET    — auth on sara-backend (same as API_SECRET)

const { getStore } = require('@netlify/blobs');

const SARA_BACKEND = 'https://api.peptiqmx.com';
const SURVEY_TEMPLATE = 'peptiq_encuesta_calidad_v1';
const MIN_HOURS_AFTER_DELIVERY = 24;

function getBlobsOpts(name) {
  const opts = { name, consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  return opts;
}

exports.handler = async () => {
  const apiSecret = process.env.SARA_API_SECRET;
  if (!apiSecret) {
    console.error('PEPTIQ encuesta-cron · SARA_API_SECRET not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'SARA_API_SECRET missing' }) };
  }

  const store = getStore(getBlobsOpts('peptiq-sales-manual'));
  let data;
  try {
    data = await store.get('sales/ALL.json', { type: 'json' });
  } catch (e) {
    console.error('PEPTIQ encuesta-cron · blob read failed', e);
    return { statusCode: 500, body: JSON.stringify({ error: 'blob read failed' }) };
  }

  if (!data || !Array.isArray(data.sales)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'no sales' }) };
  }

  const now = Date.now();
  const cutoff = now - MIN_HOURS_AFTER_DELIVERY * 3600 * 1000;
  const results = [];
  let changed = false;

  for (const sale of data.sales) {
    if (sale.shippingStatus !== 'delivered') continue;
    if (sale.encuestaSentAt) continue;
    if (!sale.customerPhone) continue;
    const deliveredAtMs = sale.deliveredAt ? new Date(sale.deliveredAt).getTime() : new Date(sale.createdAt || sale.date).getTime();
    if (deliveredAtMs > cutoff) continue;

    const firstName = (sale.customerName || 'amigo').split(' ')[0];
    try {
      const r = await fetch(
        `${SARA_BACKEND}/admin/peptiq/send-encuesta?api_key=${encodeURIComponent(apiSecret)}&to=${encodeURIComponent(sale.customerPhone)}&nombre=${encodeURIComponent(firstName)}&template=${encodeURIComponent(SURVEY_TEMPLATE)}`,
        { method: 'GET' }
      );
      const resp = await r.json();
      if (r.ok && resp.ok) {
        sale.encuestaSentAt = new Date().toISOString();
        sale.encuestaWamid = resp.meta_response?.messages?.[0]?.id || '';
        changed = true;
        results.push({ id: sale.id, customer: firstName, status: 'sent', wamid: sale.encuestaWamid });
      } else {
        results.push({ id: sale.id, customer: firstName, status: 'failed', error: resp.meta_response?.error?.message || resp.error || 'unknown' });
      }
    } catch (e) {
      results.push({ id: sale.id, customer: firstName, status: 'failed', error: e.message });
    }
    await new Promise(r => setTimeout(r, 250));
  }

  if (changed) {
    try {
      await store.setJSON('sales/ALL.json', data);
    } catch (e) {
      console.error('PEPTIQ encuesta-cron · blob write failed', e);
    }
  }

  console.log(`PEPTIQ encuesta-cron · processed ${results.length} candidates`);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, processed: results.length, results }, null, 2),
  };
};
