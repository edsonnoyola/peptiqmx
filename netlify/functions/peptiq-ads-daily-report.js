// PEPTIQ Daily Ads Report · 9am MX
// Pulls Meta Ads stats last 24h · sends WhatsApp report + recommendations
// User reviews and decides scale/pause · Claude executes via chat

const META_GRAPH = 'https://graph.facebook.com/v21.0';

exports.handler = async () => {
  const TOKEN = process.env.META_ADS_TOKEN;
  const CAMPAIGN = process.env.META_CAMPAIGN_ID || '52502657928372';
  const WA_NUMBER = process.env.ALERT_WA_NUMBER || '5214445770445';
  const SARA = process.env.SARA_BACKEND_URL || 'https://sara-backend.edson-633.workers.dev';

  if (!TOKEN) return { statusCode: 200, body: JSON.stringify({skip:'no token'}) };

  // Pull last 24h insights at ad-level
  const fields = 'ad_id,ad_name,impressions,clicks,spend,actions,ctr,cpc,cpm,frequency';
  const url = `${META_GRAPH}/${CAMPAIGN}/insights?level=ad&date_preset=yesterday&fields=${fields}&access_token=${TOKEN}`;

  let insights = [];
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (d.error) {
      console.error('Meta API error:', d.error);
      return { statusCode: 200, body: JSON.stringify({error: d.error}) };
    }
    insights = d.data || [];
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({error: String(e)}) };
  }

  // Aggregate + classify per ad
  const recommendations = [];
  let totalSpend = 0, totalLeads = 0, totalClicks = 0, totalImp = 0;

  for (const ad of insights) {
    const spend = parseFloat(ad.spend || 0);
    const clicks = parseInt(ad.clicks || 0);
    const imp = parseInt(ad.impressions || 0);
    const ctr = parseFloat(ad.ctr || 0);
    const cpc = parseFloat(ad.cpc || 0);
    const freq = parseFloat(ad.frequency || 0);

    // Count "Contact" / "Messaging conversation started" actions as leads
    let leads = 0;
    for (const a of (ad.actions || [])) {
      if (['onsite_conversion.messaging_conversation_started_7d', 'contact', 'lead'].includes(a.action_type)) {
        leads += parseInt(a.value || 0);
      }
    }
    const cpl = leads > 0 ? spend / leads : 0;

    totalSpend += spend; totalLeads += leads; totalClicks += clicks; totalImp += imp;

    // Recommendation logic
    let rec = '⏸ MANTENER';
    if (cpl > 0 && cpl < 200 && leads >= 2) rec = '🚀 ESCALAR +30%';
    else if (cpl > 500) rec = '🔴 PAUSAR (CPL alto)';
    else if (ctr < 0.6 && imp > 1000) rec = '🟡 KILL creative (CTR <0.6%)';
    else if (freq > 4) rec = '🟡 ROTAR (frequency alta)';
    else if (leads === 0 && spend > 100) rec = '⚠ Sin leads · evaluar';

    recommendations.push({
      name: ad.ad_name?.replace('PEPTIQ_', '').slice(0, 28) || ad.ad_id,
      spend, leads, cpl, ctr, freq, rec
    });
  }

  // Build WhatsApp message
  const today = new Date().toLocaleDateString('es-MX', {timeZone:'America/Mexico_City', day:'numeric', month:'short'});
  let msg = `☕ PEPTIQ Daily · ${today}\n\n`;
  msg += `📊 Últimas 24h\n`;
  msg += `Spend: $${totalSpend.toFixed(0)} MXN\n`;
  msg += `Impresiones: ${totalImp.toLocaleString()}\n`;
  msg += `Clicks: ${totalClicks}\n`;
  msg += `Leads (WhatsApp): ${totalLeads}\n`;
  if (totalLeads > 0) msg += `CPL: $${(totalSpend/totalLeads).toFixed(0)}\n`;
  msg += `\n--- Por ad ---\n`;

  for (const r of recommendations) {
    msg += `\n${r.name}\n`;
    msg += `  $${r.spend.toFixed(0)} · ${r.leads}L · CTR ${r.ctr}%\n`;
    if (r.cpl > 0) msg += `  CPL $${r.cpl.toFixed(0)}\n`;
    msg += `  ${r.rec}\n`;
  }

  msg += `\n💬 Responde a Claude con qué activar/pausar.\nReglas: max $300/día · max 5 días.`;

  // Send via Resend email (Resend domain peptiqmx.com already verified)
  const RESEND_KEY = process.env.RESEND_API_KEY || 're_QkbDhBw4_DuChcCdaVLDQ1AjUAG71XU7N';
  const TO_EMAIL = process.env.ALERT_EMAIL || 'edson@marketingtdi.com';

  const htmlBody = msg.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
  const subject = `PEPTIQ Daily Ads · ${today} · $${totalSpend.toFixed(0)} spend · ${totalLeads} leads`;

  let emailSent = false, emailErr = null;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'PEPTIQ Ads <ads@peptiqmx.com>',
        to: [TO_EMAIL],
        subject,
        text: msg,
        html: `<pre style="font-family: ui-monospace,monospace; font-size: 13px; white-space: pre-wrap;">${msg}</pre>`
      })
    });
    const d = await r.json();
    emailSent = r.ok;
    if (!r.ok) emailErr = d;
  } catch (e) {
    emailErr = String(e);
  }

  return { statusCode: 200, body: JSON.stringify({
    email_sent: emailSent,
    email_error: emailErr,
    report: { total_spend: totalSpend, total_leads: totalLeads, ads_count: recommendations.length },
    preview: msg.slice(0, 800)
  }) };
};
