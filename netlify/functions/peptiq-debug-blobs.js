const { getStore } = require('@netlify/blobs');
exports.handler = async () => {
  const opts = { name: 'peptiq-stories', consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  const store = getStore(opts);
  let listResult, getResult, error;
  try { listResult = await store.list(); } catch(e){ error=e.message; }
  try { getResult = await store.get('schedule.json'); } catch(e){ error = (error||'')+' '+e.message; }
  return { statusCode:200, body: JSON.stringify({
    has_blobs_id: !!process.env.NETLIFY_BLOBS_SITE_ID,
    has_blobs_token: !!process.env.NETLIFY_BLOBS_TOKEN,
    list: listResult,
    get_length: getResult ? getResult.length : null,
    get_first_50: getResult ? getResult.slice(0,50) : null,
    error
  }, null, 2) };
};
