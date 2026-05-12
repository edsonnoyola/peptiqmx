// PEPTIQ Sales Master · Combina ventas Stripe + manuales + computa stock
// GET /api/sales-master · returns:
//   {
//     sales: [...]                     // todas las ventas (Stripe + manual) ordenadas por fecha desc
//     summary: { count, revenue, profit, avgMargin },
//     stock: { 'BP10': { initial, sold, remaining, ... }, ... }
//     stockByLine: { wolverine: 25, glow: 30, ... }
//     alerts: ['BP10 stock crítico (1 vial)', ...]
//   }
//
// Auth: PEPTIQ_ADMIN_KEY (mismo que sales-manual)

const { getStore } = require('@netlify/blobs');

const CATALOG = {
  'BP10':   { name: 'BPC-157 10mg', cost: 150, elite: 2999, line: 'wolverine', initial: 10 },
  'TB10':   { name: 'TB-500 10mg', cost: 280, elite: 4299, line: 'wolverine', initial: 10 },
  'BB20':   { name: 'Wolverine Blend 20mg', cost: 340, elite: 6499, line: 'wolverine', initial: 10 },
  'GLOW70': { name: 'Trinity GLOW 70mg', cost: 400, elite: 7999, line: 'glow', initial: 10 },
  'CU100':  { name: 'GHK-Cu 100mg', cost: 100, elite: 3299, line: 'glow', initial: 20 },
  'KPV10':  { name: 'KPV 10mg', cost: 120, elite: 2999, line: 'wolverine', initial: 10 },
  'IP10':   { name: 'Ipamorelin 10mg', cost: 140, elite: 2999, line: 'prime', initial: 10 },
  'TSM10':  { name: 'Tesamorelin 10mg', cost: 360, elite: 7999, line: 'prime', initial: 20 },
  'NJ1000': { name: 'NAD+ 1000mg', cost: 252, elite: 5999, line: 'highlander', initial: 10 },
  'ET50':   { name: 'Epithalon 50mg', cost: 280, elite: 6999, line: 'highlander', initial: 10 },
  'SX10':   { name: 'Semax 10mg', cost: 140, elite: 2999, line: 'prime', initial: 10 },
  'SK10':   { name: 'Selank 10mg', cost: 70, elite: 3499, line: 'prime', initial: 0 },
  'RT30':   { name: 'Retatrutide 30mg', cost: 390, elite: 12999, line: 'shred', initial: 10 },
  'CP10':   { name: 'CJC + Ipamorelin 10mg', cost: 200, elite: 5499, line: 'prime', initial: 0 },
  'BA3':    { name: 'Agua Bacteriostática 3ml', cost: 30, elite: 590, line: 'support', initial: 0 },
};

// Stripe payment_link → SKUs (mismo mapeo que peptiq-stripe-webhook)
const STRIPE_LINK_TO_ITEMS = {
  'dRmaEY4AL2Jycmd6Bqds400': { name: 'Wolverine', items: [{ sku: 'BB20', qty: 1 }, { sku: 'BA3', qty: 1 }], amount: 5499 },
  'bJedRa4ALgAo5XP4tids401': { name: 'Wolverine PRO', items: [{ sku: 'BP10', qty: 1 }, { sku: 'TB10', qty: 1 }, { sku: 'BA3', qty: 2 }], amount: 6999 },
  'fZu3cwebl0Bqae52lads402': { name: 'GH Boost', items: [{ sku: 'CP10', qty: 1 }, { sku: 'BA3', qty: 1 }], amount: 5499 },
  'cNifZi2sD2Jy1Hzf7Wds40m': { name: 'GLOW Essential', items: [{ sku: 'GLOW70', qty: 1 }, { sku: 'BA3', qty: 1 }], amount: 7999 },
  '3cI5kEgjt5VK5XPaRGds404': { name: 'GLOW PRO', items: [{ sku: 'GLOW70', qty: 1 }, { sku: 'CU100', qty: 1 }, { sku: 'BA3', qty: 2 }], amount: 9999 },
  '5kQ3cw4ALesg2LD3peds405': { name: 'Gut Reset', items: [{ sku: 'BP10', qty: 1 }, { sku: 'KPV10', qty: 1 }, { sku: 'BA3', qty: 2 }], amount: 5999 },
  '00w9AUd7h0Bq2LDf7Wds406': { name: 'Neuro Focus', items: [{ sku: 'SX10', qty: 1 }, { sku: 'ET50', qty: 1 }, { sku: 'BA3', qty: 2 }], amount: 8999 },
  '6oU3cwd7hbg4gCt7Fuds407': { name: 'Highlander Longevity', items: [{ sku: 'NJ1000', qty: 1 }, { sku: 'ET50', qty: 1 }, { sku: 'CU100', qty: 1 }, { sku: 'BA3', qty: 3 }], amount: 14999 },
  '4gM00E5aB2DN10Ydqi8wQ02': { name: 'TITAN Performance', items: [{ sku: 'TSM10', qty: 1 }, { sku: 'IP10', qty: 1 }, { sku: 'NJ1000', qty: 1 }, { sku: 'BA3', qty: 3 }], amount: 14999 },
};

function getBlobsOpts(name) {
  const opts = { name, consistency: 'strong' };
  if (process.env.NETLIFY_BLOBS_SITE_ID && process.env.NETLIFY_BLOBS_TOKEN) {
    opts.siteID = process.env.NETLIFY_BLOBS_SITE_ID;
    opts.token = process.env.NETLIFY_BLOBS_TOKEN;
  }
  return opts;
}

function checkAuth(event) {
  const key = event.headers['x-peptiq-key'] || event.headers['X-Peptiq-Key'] || (event.queryStringParameters || {}).key;
  const expected = process.env.PEPTIQ_ADMIN_KEY;
  if (!expected) return true;
  return key === expected;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Peptiq-Key',
};

async function loadStripeSales(stripeStore) {
  // Cada user tiene users/<key>.json con orders[]
  const out = [];
  try {
    const list = await stripeStore.list({ prefix: 'users/' });
    for (const blob of (list.blobs || [])) {
      const data = await stripeStore.get(blob.key, { type: 'json' });
      if (!data || !Array.isArray(data.orders)) continue;
      for (const order of data.orders) {
        const map = STRIPE_LINK_TO_ITEMS[order.paymentLinkId] || null;
        const items = map ? map.items : (order.items || []).map(it => ({ sku: it.peptide || it.sku, qty: it.vials || it.qty || 1 }));
        const productCost = items.reduce((s, it) => {
          const p = CATALOG[it.sku];
          return s + (p ? p.cost * it.qty : 0);
        }, 0);
        const totalCharged = order.amount || 0;
        const shippingCost = 0; // Stripe orders no tracked shipping cost — assume 0 for net profit calc
        const netProfit = totalCharged - productCost - shippingCost;
        const margin = totalCharged > 0 ? (netProfit / totalCharged) * 100 : 0;
        out.push({
          id: order.orderId || order.stripeSessionId,
          date: (order.purchasedAt || '').slice(0, 10),
          customerName: order.customerEmail || order.customerPhone || 'Stripe checkout',
          customerCity: '',
          items,
          shippingCharged: 0,
          shippingCost: 0,
          totalCharged,
          productCost,
          netProfit,
          margin: Math.round(margin * 10) / 10,
          notes: `Stripe · ${order.customerEmail || order.customerPhone || ''}`,
          source: 'stripe',
        });
      }
    }
  } catch (e) {
    console.warn('PEPTIQ sales-master · stripe load failed (non-blocking)', e);
  }
  return out;
}

async function loadManualSales(manualStore) {
  try {
    const data = await manualStore.get('sales/ALL.json', { type: 'json' });
    return (data && Array.isArray(data.sales)) ? data.sales : [];
  } catch (e) {
    return [];
  }
}

function computeStock(allSales) {
  const sold = {};
  for (const sku of Object.keys(CATALOG)) sold[sku] = 0;
  for (const sale of allSales) {
    for (const it of (sale.items || [])) {
      if (sold[it.sku] !== undefined) sold[it.sku] += (it.qty || 1);
    }
  }
  const stock = {};
  const stockByLine = {};
  const alerts = [];
  for (const [sku, p] of Object.entries(CATALOG)) {
    const remaining = p.initial - (sold[sku] || 0);
    stock[sku] = {
      sku,
      name: p.name,
      line: p.line,
      cost: p.cost,
      elite: p.elite,
      initial: p.initial,
      sold: sold[sku] || 0,
      remaining,
      pctRemaining: p.initial > 0 ? Math.round((remaining / p.initial) * 100) : 0,
      revenuePotentialElite: remaining * p.elite,
      costInvested: remaining * p.cost,
    };
    stockByLine[p.line] = (stockByLine[p.line] || 0) + remaining;
    if (p.initial > 0 && remaining <= 2) {
      alerts.push(`⚠️ ${sku} (${p.name}) · solo ${remaining} ${remaining === 1 ? 'vial' : 'viales'} restantes`);
    }
    if (p.initial === 0 && p.line !== 'support') {
      alerts.push(`📦 ${sku} (${p.name}) · sin stock — pendiente con proveedor`);
    }
  }
  return { stock, stockByLine, alerts };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: 'method not allowed' };
  if (!checkAuth(event)) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'unauthorized' }) };
  }

  try {
    const stripeStore = getStore(getBlobsOpts('peptiq-inventory'));
    const manualStore = getStore(getBlobsOpts('peptiq-sales-manual'));

    const [stripeSales, manualSales] = await Promise.all([
      loadStripeSales(stripeStore),
      loadManualSales(manualStore),
    ]);

    const allSales = [...manualSales, ...stripeSales].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const summary = {
      count: allSales.length,
      countStripe: stripeSales.length,
      countManual: manualSales.length,
      revenue: allSales.reduce((s, x) => s + (x.totalCharged || 0), 0),
      productCost: allSales.reduce((s, x) => s + (x.productCost || 0), 0),
      shippingCost: allSales.reduce((s, x) => s + (x.shippingCost || 0), 0),
      profit: allSales.reduce((s, x) => s + (x.netProfit || 0), 0),
      avgMargin: allSales.length > 0 ? Math.round((allSales.reduce((s, x) => s + (x.margin || 0), 0) / allSales.length) * 10) / 10 : 0,
    };

    const stockData = computeStock(allSales);

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sales: allSales,
        summary,
        stock: stockData.stock,
        stockByLine: stockData.stockByLine,
        alerts: stockData.alerts,
        catalog: CATALOG,
      }),
    };
  } catch (e) {
    console.error('PEPTIQ sales-master error', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed', detail: e.message }) };
  }
};
