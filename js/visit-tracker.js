// PEPTIQ Visit Tracker · ligero · fire-and-forget
// Captura visitas al sitio para evidencia legal + analytics
(function() {
  try {
    var key = 'peptiq_visit_session';
    var sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(key, sessionId);
    }

    var payload = {
      record_type: 'visit',
      payload: {
        session_id: sessionId,
        page: location.pathname + location.search,
        referrer: document.referrer || null,
        screen: screen.width + 'x' + screen.height,
        viewport: window.innerWidth + 'x' + window.innerHeight,
        lang: navigator.language || null,
        platform: navigator.platform || null,
        title: document.title || null,
        utm: {
          source: new URLSearchParams(location.search).get('utm_source') || null,
          medium: new URLSearchParams(location.search).get('utm_medium') || null,
          campaign: new URLSearchParams(location.search).get('utm_campaign') || null
        },
        ts: new Date().toISOString()
      }
    };

    // Fire and forget · no bloquea la página
    if (navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/legal-record', blob);
    } else {
      fetch('/api/legal-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(){});
    }

    // Track CTA clicks (compra, WhatsApp, etc)
    document.addEventListener('click', function(e) {
      var t = e.target.closest('a, button');
      if (!t) return;
      var label = (t.textContent || '').trim().slice(0, 80);
      var href = t.getAttribute('href') || '';
      var isCTA = href.includes('wa.me') ||
                  href.includes('checkout') ||
                  href.includes('catalogos') ||
                  /comprar|pedir|agendar|whatsapp|stack/i.test(label);
      if (!isCTA) return;
      try {
        var ctaPayload = {
          record_type: 'cta_click',
          payload: {
            session_id: sessionId,
            label: label,
            href: href,
            page: location.pathname,
            ts: new Date().toISOString()
          }
        };
        var b = new Blob([JSON.stringify(ctaPayload)], { type: 'application/json' });
        if (navigator.sendBeacon) navigator.sendBeacon('/api/legal-record', b);
      } catch(e){}
    }, { capture: true, passive: true });
  } catch(e) {}
})();
