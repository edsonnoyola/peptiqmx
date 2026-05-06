// Save user's reminder opt-in to Netlify Blobs
// POST { whatsapp, peptide, recommendedHour, email, signature }
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {statusCode:204, headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}};
  }
  if (event.httpMethod !== 'POST') return {statusCode:405, body:'method not allowed'};

  let body;
  try { body = JSON.parse(event.body||'{}'); } catch(e){ return {statusCode:400, body:'invalid json'}; }
  if (!body.whatsapp || !body.peptide) return {statusCode:400, body:JSON.stringify({error:'whatsapp + peptide required'})};

  // Normalize WA: keep digits only, prepend 521 if MX 10-digit
  let wa = String(body.whatsapp).replace(/\D/g,'');
  if (wa.length===10) wa='521'+wa;
  if (wa.length<12) return {statusCode:400, body:JSON.stringify({error:'invalid whatsapp'})};

  const record = {
    whatsapp: wa,
    peptide: String(body.peptide).slice(0,50),
    recommendedHour: String(body.recommendedHour||'07:30').slice(0,5),
    fastingRule: String(body.fastingRule||'').slice(0,80),
    email: (body.email||'').slice(0,255),
    signature: (body.signature||'').slice(0,255),
    optedInAt: new Date().toISOString(),
    enabled: true,
    timezone: body.timezone || 'America/Mexico_City'
  };

  try {
    const opts = {name:'peptiq-reminders', consistency:'strong'};
    if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
      opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
      opts.token = process.env.NETLIFY_BLOBS_TOKEN;
    }
    const store = getStore(opts);
    // Key by WA so re-opt-in updates the same record
    await store.setJSON(`users/${wa}.json`, record);
    return {statusCode:201, headers:{'Access-Control-Allow-Origin':'*'}, body:JSON.stringify({ok:true,wa})};
  } catch(err){
    console.error('reminder-optin error:', err);
    return {statusCode:500, headers:{'Access-Control-Allow-Origin':'*'}, body:JSON.stringify({error:err.message})};
  }
};
