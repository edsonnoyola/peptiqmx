// PEPTIQ Reminder Cron · Netlify Scheduled Function
// Runs every 15 min · checks all opted-in users · sends WA template if their hour matches
// Schedule defined in netlify.toml [[scheduled]]
const { getStore } = require('@netlify/blobs');

const META_API = 'https://graph.facebook.com/v21.0';

exports.handler = async (event) => {
  const phoneId = process.env.PEPTIQ_WA_PHONE_ID;
  const token = process.env.PEPTIQ_WA_TOKEN;
  const templateName = process.env.PEPTIQ_WA_TEMPLATE_REMINDER || 'peptiq_daily_reminder';

  if (!phoneId || !token) {
    console.warn('PEPTIQ WA credentials not configured · skipping cron tick');
    return { statusCode: 200, body: JSON.stringify({skipped:'no credentials'}) };
  }

  const opts = {name:'peptiq-reminders', consistency:'strong'};
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  const reminders = getStore(opts);

  // Sent log to avoid double-send same day
  const sentOpts = {...opts, name:'peptiq-reminders-sent'};
  const sentLog = getStore(sentOpts);

  const now = new Date();
  const nowMx = new Date(now.toLocaleString('en-US',{timeZone:'America/Mexico_City'}));
  const hour = nowMx.getHours();
  const minute = nowMx.getMinutes();
  const dateKey = nowMx.toISOString().slice(0,10);
  const dayOfWeek = nowMx.getDay(); // 0 dom · 6 sab

  let processed = 0, sent = 0, skipped = 0, errors = 0;

  const list = await reminders.list({prefix:'users/'});
  for (const blob of (list.blobs||[])) {
    processed++;
    let user;
    try { user = await reminders.get(blob.key, {type:'json'}); } catch(e){ errors++; continue; }
    if (!user || !user.enabled || !user.whatsapp || !user.peptide) { skipped++; continue; }

    // Skip dose-day check based on peptide protocol (lun-vie typical)
    const isDailyMonFri = ['BPC-157','TB-500','GHK-Cu','NAD+','Tesamorelin','Ipamorelin','Semax','KPV','CJC+Ipa','MOTS-c'].includes(user.peptide);
    if (isDailyMonFri && (dayOfWeek===0 || dayOfWeek===6)) { skipped++; continue; }

    // Check if current time is within 15 min of recommendedHour
    const [recH, recM] = (user.recommendedHour||'07:30').split(':').map(n=>parseInt(n));
    const currentMins = hour*60 + minute;
    const recMins = recH*60 + (recM||0);
    if (currentMins < recMins || currentMins >= recMins + 15) { skipped++; continue; }

    // Check if already sent today
    const sentKey = `${dateKey}/${user.whatsapp}.json`;
    let alreadySent = null;
    try { alreadySent = await sentLog.get(sentKey, {type:'json'}); } catch(e){}
    if (alreadySent) { skipped++; continue; }

    // Compute greeting variant
    let greetSuffix = 'os días';
    if (recH >= 12 && recH < 19) greetSuffix = 'as tardes';
    if (recH >= 19 || recH < 5) greetSuffix = 'as noches';

    const userName = user.signature?.split(' ')[0] || 'amig@';
    const doseLine = user.dose || (user.peptide+' subcutáneo');
    const fasting = user.fastingRule && user.fastingRule!=='cualquier momento' ? user.fastingRule : 'cualquier momento';

    // Send template
    try {
      const r = await fetch(`${META_API}/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: user.whatsapp,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'es_MX' },
            components: [{
              type: 'body',
              parameters: [
                { type:'text', text: greetSuffix },
                { type:'text', text: userName },
                { type:'text', text: user.peptide },
                { type:'text', text: doseLine },
                { type:'text', text: user.recommendedHour },
                { type:'text', text: fasting }
              ]
            }]
          }
        })
      });

      if (r.ok) {
        sent++;
        await sentLog.setJSON(sentKey, {ts: new Date().toISOString(), wa: user.whatsapp, peptide: user.peptide});
      } else {
        errors++;
        const errBody = await r.text();
        console.error('Meta send failed:', user.whatsapp, r.status, errBody);
      }
    } catch (err) {
      errors++;
      console.error('Send exception:', err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ts: nowMx.toISOString(),
      processed, sent, skipped, errors,
      hour, minute, dayOfWeek
    })
  };
};
