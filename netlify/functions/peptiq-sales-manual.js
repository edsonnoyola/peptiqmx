// PEPTIQ Sales Manual · CRUD de ventas manuales (no-Stripe)
// GET    /api/sales-manual                → lista todas las ventas manuales
// POST   /api/sales-manual                → crea venta { customerName, customerCity, items, shippingCharged, shippingCost, totalCharged, notes }
// DELETE /api/sales-manual?id=sale-xxx    → elimina venta
//
// Auth: requiere x-peptiq-key header con API_KEY de admin
// Storage: Netlify Blob `peptiq-sales-manual` · key = sales/ALL.json (single doc, append-style)

const { getStore } = require('@netlify/blobs');

const CATALOG = {
  'BP10':   { name: 'BPC-157 10mg', cost: 150, elite: 2999 },
  'TB10':   { name: 'TB-500 10mg', cost: 280, elite: 4299 },
  'BB20':   { name: 'Wolverine BB20', cost: 340, elite: 5499 },
  'GLOW70': { name: 'Trinity GLOW 70mg', cost: 400, elite: 7999 },
  'CU100':  { name: 'GHK-Cu 100mg', cost: 100, elite: 4299 },
  'KPV10':  { name: 'KPV 10mg', cost: 120, elite: 3099 },
  'IP10':   { name: 'Ipamorelin 10mg', cost: 140, elite: 2999 },
  'TSM10':  { name: 'Tesamorelin 10mg', cost: 360, elite: 6999 },
  'NJ1000': { name: 'NAD+ 1000mg', cost: 252, elite: 5499 },
  'ET50':   { name: 'Epithalon 50mg', cost: 280, elite: 4599 },
  'SX10':   { name: 'Semax 10mg', cost: 140, elite: 2999 },
  'RT30':   { name: 'Retatrutide 30mg', cost: 390, elite: 12999 },
  'CP10':   { name: 'CJC + Ipamorelin 10mg', cost: 200, elite: 5499 },
  'BA3':    { name: 'Agua Bacteriostática 3ml', cost: 30, elite: 590 },
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
  if (!expected) return true; // dev mode
  return key === expected;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Peptiq-Key',
};

const SEED_SALE = {
  id: 'first-rodolfo-morelia',
  date: '2026-05-08',
  time: '14:00',
  customerName: 'Rodolfo',
  customerPhone: '5213328388675',
  customerCity: 'Morelia',
  items: [
    { sku: 'BB20', qty: 1 },
    { sku: 'IP10', qty: 1 },
    { sku: 'CU100', qty: 1 },
    { sku: 'BA3', qty: 3 },
  ],
  shippingCharged: 650,
  shippingCost: 650,
  totalCharged: 5000,
  productCost: 670,
  netProfit: 3680,
  margin: 73.6,
  shippingStatus: 'shipped',
  trackingNumber: '',
  courier: '',
  notes: 'Primer pedido PEPTIQ · combo recovery + GH + estética',
  source: 'manual',
  createdAt: '2026-05-08T14:00:00.000Z',
};

async function loadSales(store) {
  let data = await store.get('sales/ALL.json', { type: 'json' });
  if (!data) {
    data = { sales: [SEED_SALE] };
    await store.setJSON('sales/ALL.json', data);
    return data;
  }
  // Migration: si el seed Rodolfo existe sin phone, actualizar
  const seed = (data.sales || []).find(s => s.id === 'first-rodolfo-morelia');
  if (seed && !seed.customerPhone) {
    Object.assign(seed, {
      customerPhone: '5213328388675',
      time: '14:00',
      shippingStatus: 'shipped',
      trackingNumber: '',
      courier: '',
      createdAt: '2026-05-08T14:00:00.000Z',
    });
    await store.setJSON('sales/ALL.json', data);
  }
  return data;
}

function computeSaleTotals(items, totalCharged, shippingCost) {
  const productCost = (items || []).reduce((s, it) => {
    const p = CATALOG[it.sku];
    return s + (p ? p.cost * (it.qty || 1) : 0);
  }, 0);
  const netProfit = totalCharged - productCost - (shippingCost || 0);
  const margin = totalCharged > 0 ? (netProfit / totalCharged) * 100 : 0;
  return { productCost, netProfit, margin: Math.round(margin * 10) / 10 };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (!checkAuth(event)) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'unauthorized' }) };
  }

  const store = getStore(getBlobsOpts('peptiq-sales-manual'));

  try {
    if (event.httpMethod === 'GET') {
      const data = await loadSales(store);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const {
        customerName, customerPhone, customerCity,
        items, shippingCharged, shippingCost, totalCharged,
        saleDate, saleTime, shippingStatus, trackingNumber, courier,
        notes,
      } = body;
      if (!customerName || !Array.isArray(items) || items.length === 0 || !totalCharged) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'customerName + items + totalCharged required' }) };
      }
      const totals = computeSaleTotals(items, totalCharged, shippingCost || 0);
      const now = new Date();
      const sale = {
        id: 'sale-' + Date.now(),
        date: saleDate || now.toISOString().slice(0, 10),
        time: saleTime || now.toTimeString().slice(0, 5), // HH:MM
        customerName: String(customerName).slice(0, 100),
        customerPhone: String(customerPhone || '').replace(/\D/g, '').slice(0, 15),
        customerCity: String(customerCity || '').slice(0, 100),
        items: items.map(it => ({ sku: String(it.sku), qty: parseInt(it.qty) || 1 })).filter(it => CATALOG[it.sku]),
        shippingCharged: parseFloat(shippingCharged) || 0,
        shippingCost: parseFloat(shippingCost) || 0,
        totalCharged: parseFloat(totalCharged) || 0,
        productCost: totals.productCost,
        netProfit: totals.netProfit,
        margin: totals.margin,
        shippingStatus: ['pending','shipped','delivered'].includes(shippingStatus) ? shippingStatus : 'pending',
        trackingNumber: String(trackingNumber || '').slice(0, 50),
        courier: String(courier || '').slice(0, 30),
        notes: String(notes || '').slice(0, 500),
        source: 'manual',
        createdAt: now.toISOString(),
      };
      const data = await loadSales(store);
      data.sales.unshift(sale);
      await store.setJSON('sales/ALL.json', data);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, sale }) };
    }

    // PATCH · update shipping status / tracking de una venta existente
    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      const { id, shippingStatus, trackingNumber, courier } = body;
      if (!id) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'id required' }) };
      const data = await loadSales(store);
      const sale = data.sales.find(s => s.id === id);
      if (!sale) return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'sale not found' }) };
      if (shippingStatus && ['pending','shipped','delivered'].includes(shippingStatus)) sale.shippingStatus = shippingStatus;
      if (trackingNumber !== undefined) sale.trackingNumber = String(trackingNumber).slice(0, 50);
      if (courier !== undefined) sale.courier = String(courier).slice(0, 30);
      await store.setJSON('sales/ALL.json', data);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, sale }) };
    }

    if (event.httpMethod === 'DELETE') {
      const id = (event.queryStringParameters || {}).id;
      if (!id) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'id required' }) };
      const data = await loadSales(store);
      data.sales = data.sales.filter(s => s.id !== id);
      await store.setJSON('sales/ALL.json', data);
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: CORS, body: 'method not allowed' };
  } catch (e) {
    console.error('PEPTIQ sales-manual error', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'storage failed', detail: e.message }) };
  }
};
