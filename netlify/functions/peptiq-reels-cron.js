// PEPTIQ Reels Cron · publishes 1 IG Reel daily at 19:00 MX
// Schedule defined in netlify.toml [[scheduled]]
const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const igAccountId = process.env.PEPTIQ_IG_ACCOUNT_ID || '17841424834151773';
  const igToken = process.env.PEPTIQ_IG_PAGE_TOKEN;
  if (!igToken) return { statusCode: 200, body: JSON.stringify({skipped:'no token'}) };

  const opts = { name: 'peptiq-reels', consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  const store = getStore(opts);

  let manifest;
  try { manifest = await store.get('schedule.json', { type: 'json' }); } catch(e){
    return { statusCode: 200, body: JSON.stringify({error:'no schedule'}) };
  }
  if (!manifest || !manifest.items) return { statusCode: 200, body: JSON.stringify({error:'invalid schedule'}) };

  const nowMx = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City'}));
  const startMx = new Date(new Date(manifest.created_at).toLocaleString('en-US', {timeZone:'America/Mexico_City'}));
  const startKey = startMx.toISOString().slice(0,10);
  const todayKey = nowMx.toISOString().slice(0,10);
  const daysSinceStart = Math.floor((new Date(todayKey) - new Date(startKey)) / (1000*60*60*24));
  const currentHour = nowMx.getHours();

  let posted = 0, errors = 0, skipped = 0;
  const log = [];

  for (const item of manifest.items) {
    if (item.status !== 'queued') { skipped++; continue; }
    if (item.scheduled_day_offset !== daysSinceStart) continue;
    if (currentHour < item.scheduled_hour_mx || currentHour >= item.scheduled_hour_mx + 1) continue;

    try {
      // Step 1: create container
      const r1 = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          video_url: item.video_url,
          media_type: 'REELS',
          caption: item.caption || '',
          share_to_feed: 'true',
          access_token: igToken
        })
      });
      const j1 = await r1.json();
      if (!j1.id) { errors++; log.push({line:item.line, error:'create', resp:j1}); item.status='failed'; continue; }

      // Step 2: poll status
      await new Promise(r=>setTimeout(r, 25000));
      const r2 = await fetch(`https://graph.facebook.com/v21.0/${j1.id}?fields=status_code&access_token=${igToken}`);
      const j2 = await r2.json();
      if (j2.status_code !== 'FINISHED') {
        // Wait more
        await new Promise(r=>setTimeout(r, 25000));
      }

      // Step 3: publish
      const r3 = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media_publish`, {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({creation_id: j1.id, access_token: igToken})
      });
      const j3 = await r3.json();
      if (j3.id) {
        posted++;
        log.push({line:item.line, ig_id:j3.id});
        item.status = 'posted';
        item.posted_at = new Date().toISOString();
        item.ig_id = j3.id;
      } else {
        errors++;
        log.push({line:item.line, error:'publish', resp:j3});
        item.status = 'failed';
      }
    } catch (err) {
      errors++;
      log.push({line:item.line, error:err.message});
    }
  }

  if (posted>0 || errors>0) await store.setJSON('schedule.json', manifest);

  return { statusCode: 200, body: JSON.stringify({ts:nowMx.toISOString(), daysSinceStart, currentHour, posted, errors, skipped, log}) };
};
