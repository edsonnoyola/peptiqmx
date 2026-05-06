// PEPTIQ Stories Cron · publishes IG Stories from queue
// Runs every hour · checks if any queued story matches current MX time
// Schedule defined in netlify.toml [[scheduled]]
const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const igAccountId = process.env.PEPTIQ_IG_ACCOUNT_ID || '17841424834151773';
  const igToken = process.env.PEPTIQ_IG_PAGE_TOKEN;

  if (!igToken) {
    console.warn('PEPTIQ_IG_PAGE_TOKEN missing · skipping');
    return { statusCode: 200, body: JSON.stringify({skipped: 'no token'}) };
  }

  const opts = { name: 'peptiq-stories', consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  const store = getStore(opts);

  // Load schedule manifest
  let manifest;
  try {
    manifest = await store.get('schedule.json', { type: 'json' });
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({error: 'no schedule loaded'}) };
  }
  if (!manifest || !manifest.items) {
    return { statusCode: 200, body: JSON.stringify({error: 'invalid schedule'}) };
  }

  // Compute current MX time
  const nowMx = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City'}));
  const startMx = new Date(manifest.created_at);
  const startMxLocal = new Date(startMx.toLocaleString('en-US', {timeZone: 'America/Mexico_City'}));

  // Day offset since start
  const startDayKey = startMxLocal.toISOString().slice(0,10);
  const todayKey = nowMx.toISOString().slice(0,10);
  const daysSinceStart = Math.floor((new Date(todayKey) - new Date(startDayKey)) / (1000*60*60*24));
  const currentHour = nowMx.getHours();

  let posted = 0, failed = 0, skipped = 0;
  const log = [];

  for (const item of manifest.items) {
    if (item.status !== 'queued') { skipped++; continue; }
    if (item.scheduled_day_offset !== daysSinceStart) { continue; }
    // Match if current hour ≥ scheduled hour AND ≤ scheduled hour + 1
    if (currentHour < item.scheduled_hour_mx || currentHour >= item.scheduled_hour_mx + 1) { continue; }

    // Publish IG story
    try {
      const createR = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          image_url: item.image_url,
          media_type: 'STORIES',
          access_token: igToken
        })
      });
      const createJson = await createR.json();
      if (!createJson.id) {
        failed++;
        log.push({id: item.id, error: 'create failed', resp: createJson});
        item.status = 'failed';
        item.error = JSON.stringify(createJson).slice(0,300);
        continue;
      }
      // Wait for processing
      await new Promise(r => setTimeout(r, 5000));
      const pubR = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media_publish`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({creation_id: createJson.id, access_token: igToken})
      });
      const pubJson = await pubR.json();
      if (pubJson.id) {
        posted++;
        log.push({id: item.id, status: 'posted', ig_id: pubJson.id});
        item.status = 'posted';
        item.posted_at = new Date().toISOString();
        item.ig_id = pubJson.id;
      } else {
        failed++;
        log.push({id: item.id, error: 'publish failed', resp: pubJson});
        item.status = 'failed';
      }
    } catch (err) {
      failed++;
      log.push({id: item.id, error: err.message});
      item.status = 'failed';
    }
  }

  // Save updated manifest
  if (posted > 0 || failed > 0) {
    await store.setJSON('schedule.json', manifest);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ts: nowMx.toISOString(),
      daysSinceStart, currentHour,
      posted, failed, skipped,
      log
    })
  };
};
