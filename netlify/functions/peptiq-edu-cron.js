// PEPTIQ Educational Carousels Cron · publishes 1 educational IG carousel per day
// Schedule: daily at 11am MX (peak engagement window)
const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const igAccountId = process.env.PEPTIQ_IG_ACCOUNT_ID || '17841424834151773';
  const igToken = process.env.PEPTIQ_IG_PAGE_TOKEN;

  if (!igToken) return { statusCode: 200, body: JSON.stringify({skipped:'no token'}) };

  const opts = { name: 'peptiq-edu', consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  const store = getStore(opts);

  let manifest = await store.get('schedule.json', { type: 'json' }).catch(()=>null);
  if (!manifest || !manifest.items) return { statusCode: 200, body: JSON.stringify({error:'no schedule'}) };

  const nowMx = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City'}));
  const startMx = new Date(manifest.created_at);
  const startMxLocal = new Date(startMx.toLocaleString('en-US', {timeZone: 'America/Mexico_City'}));
  const daysSinceStart = Math.floor((new Date(nowMx.toISOString().slice(0,10)) - new Date(startMxLocal.toISOString().slice(0,10))) / 86400000);
  const currentHour = nowMx.getHours();

  let posted = 0, failed = 0;
  const log = [];

  for (const item of manifest.items) {
    if (item.status !== 'queued') continue;
    if (item.scheduled_day_offset !== daysSinceStart) continue;
    if (currentHour < item.scheduled_hour_mx || currentHour >= item.scheduled_hour_mx + 2) continue;

    try {
      // Create children
      const childIds = [];
      for (const url of item.image_urls) {
        const r = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: new URLSearchParams({
            image_url: url + '?cb=cron' + Date.now(),
            is_carousel_item: 'true',
            access_token: igToken
          })
        });
        const j = await r.json();
        if (!j.id) throw new Error('child fail: ' + JSON.stringify(j).slice(0,200));
        childIds.push(j.id);
        await new Promise(r => setTimeout(r, 1500));
      }
      // Container
      const cR = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          media_type: 'CAROUSEL',
          children: childIds.join(','),
          caption: item.caption,
          access_token: igToken
        })
      });
      const cJ = await cR.json();
      if (!cJ.id) throw new Error('container fail: ' + JSON.stringify(cJ).slice(0,200));

      await new Promise(r => setTimeout(r, 8000));
      const pR = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media_publish`, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({creation_id: cJ.id, access_token: igToken})
      });
      const pJ = await pR.json();
      if (pJ.id) {
        posted++;
        item.status = 'posted';
        item.posted_at = new Date().toISOString();
        item.ig_id = pJ.id;
        log.push({id:item.id, status:'posted', ig_id:pJ.id});
      } else {
        throw new Error('publish fail: ' + JSON.stringify(pJ).slice(0,200));
      }
    } catch (err) {
      failed++;
      item.status = 'failed';
      item.error = err.message.slice(0,300);
      log.push({id:item.id, error:err.message.slice(0,200)});
    }
  }

  if (posted > 0 || failed > 0) await store.setJSON('schedule.json', manifest);

  return {
    statusCode: 200,
    body: JSON.stringify({ts: nowMx.toISOString(), daysSinceStart, currentHour, posted, failed, log})
  };
};
