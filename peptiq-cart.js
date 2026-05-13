// PEPTIQ MX · Client-side cart (localStorage)
// Adds "Agregar al carrito" + floating cart icon + /carrito.html flow
(function () {
  'use strict';

  const KEY = 'peptiq_cart';
  const API = 'https://api.peptiqmx.com';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function setCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    renderBadge();
    window.dispatchEvent(new CustomEvent('peptiq:cart-updated', { detail: items }));
  }

  window.peptiqCart = {
    items: getCart,
    add: function (productId, name, price, qty = 1) {
      const items = getCart();
      const existing = items.find(i => i.product_id === productId);
      if (existing) existing.qty = (existing.qty || 1) + qty;
      else items.push({ product_id: productId, name, price, qty });
      setCart(items);
      // Pixel
      if (window.fbq) fbq('track', 'AddToCart', {
        content_ids: [productId], content_name: name, value: price, currency: 'MXN'
      });
      showToast(`${name} agregado al carrito`);
    },
    remove: function (productId) {
      setCart(getCart().filter(i => i.product_id !== productId));
    },
    setQty: function (productId, qty) {
      const items = getCart();
      const item = items.find(i => i.product_id === productId);
      if (item) {
        if (qty <= 0) return this.remove(productId);
        item.qty = qty;
        setCart(items);
      }
    },
    clear: function () { setCart([]); },
    total: function () {
      return getCart().reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
    },
    count: function () {
      return getCart().reduce((s, i) => s + (i.qty || 1), 0);
    },
    checkout: async function () {
      const items = getCart();
      if (items.length === 0) return alert('Tu carrito está vacío');
      if (window.fbq) fbq('track', 'InitiateCheckout', {
        contents: items.map(i => ({ id: i.product_id, quantity: i.qty })),
        value: this.total(), currency: 'MXN', num_items: this.count()
      });
      // Try multi-item Stripe via backend
      try {
        const res = await fetch(`${API}/api/peptiq/cart-checkout-public`, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ items, source: 'peptiqmx_cart', utm: window.__peptiqUTM || {} })
        });
        const d = await res.json();
        if (d.payment_url) { window.location.href = d.payment_url; return; }
      } catch (e) {}
      // Fallback: WhatsApp with cart list
      const lines = items.map(i => `• ${i.name} × ${i.qty || 1} = $${(i.price * (i.qty || 1)).toLocaleString('es-MX')} MXN`).join('\n');
      const total = this.total().toLocaleString('es-MX');
      const msg = `Hola, quiero comprar este carrito:\n\n${lines}\n\nTotal: $${total} MXN\n\n¿Cómo continuo con el pago?`;
      window.open(`https://wa.me/5214445770445?text=${encodeURIComponent(msg)}`, '_blank');
    },
  };

  // === FLOATING CART ICON ===
  function injectIcon() {
    if (document.getElementById('peptiq-cart-fab')) return;
    const fab = document.createElement('a');
    fab.id = 'peptiq-cart-fab';
    fab.href = '/carrito.html';
    fab.innerHTML = `
      <style>
        #peptiq-cart-fab {
          position: fixed; bottom: 100px; right: 20px; z-index: 9998;
          width: 52px; height: 52px; border-radius: 50%;
          background: #0d1520; border: 1px solid #988646;
          display: flex; align-items: center; justify-content: center;
          color: #f5f3ee; text-decoration: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          transition: 0.2s ease;
        }
        #peptiq-cart-fab:hover { transform: scale(1.06); border-color: #b59c52; }
        #peptiq-cart-fab svg { width: 22px; height: 22px; stroke: #988646; }
        #peptiq-cart-badge {
          position: absolute; top: -4px; right: -4px;
          min-width: 20px; height: 20px;
          background: #988646; color: #0d1520;
          border-radius: 10px; font-size: 11px; font-weight: 700;
          display: none; align-items: center; justify-content: center;
          padding: 0 5px;
        }
        #peptiq-cart-badge.show { display: flex; }
        #peptiq-toast {
          position: fixed; bottom: 165px; right: 20px; z-index: 9999;
          background: #988646; color: #0d1520;
          padding: 12px 20px; border-radius: 4px;
          font-family: -apple-system,BlinkMacSystemFont,sans-serif;
          font-size: 13px; font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          opacity: 0; transition: opacity 0.3s, transform 0.3s;
          transform: translateX(20px); pointer-events: none;
        }
        #peptiq-toast.show { opacity: 1; transform: translateX(0); }
      </style>
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span id="peptiq-cart-badge"></span>
    `;
    document.body.appendChild(fab);
    renderBadge();
  }

  function renderBadge() {
    const badge = document.getElementById('peptiq-cart-badge');
    if (!badge) return;
    const c = window.peptiqCart.count();
    if (c > 0) { badge.textContent = c; badge.classList.add('show'); }
    else { badge.classList.remove('show'); }
  }

  function showToast(msg) {
    let toast = document.getElementById('peptiq-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'peptiq-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // === ADD-TO-CART HELPER GLOBAL ===
  window.addToCart = function (productId, name, price) {
    window.peptiqCart.add(productId, name, price);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectIcon);
  } else {
    injectIcon();
  }
})();
