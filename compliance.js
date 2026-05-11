/* PEPTIQ MX · Compliance global script
 * - Age gate +18 (LFPDPPP, COFEPRIS posicionamiento research-use)
 * - RUO disclaimer banner (research-use only)
 * - Cookie consent (LFPDPPP)
 *
 * Uso: <script src="/compliance.js" defer></script> en todas las paginas.
 * Idempotente: detecta si ya hay instancias y no duplica.
 */
(function(){
  if (window.__PEPTIQ_COMPLIANCE_LOADED__) return;
  window.__PEPTIQ_COMPLIANCE_LOADED__ = true;

  var LS_AGE = 'peptiq_age_verified_v1';
  var LS_COOKIE = 'peptiq_cookie_consent_v1';

  function injectCSS(){
    if (document.getElementById('peptiq-compliance-css')) return;
    var s = document.createElement('style');
    s.id = 'peptiq-compliance-css';
    s.textContent = [
      '.pq-overlay{position:fixed;inset:0;background:rgba(10,9,8,.95);z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(12px);font-family:Inter,-apple-system,sans-serif}',
      '.pq-modal{background:#0A0908;border:1px solid #C9AE6B;max-width:520px;width:100%;padding:36px 32px;text-align:center;color:#F0E8D4}',
      '.pq-modal h2{font-family:"Playfair Display",serif;font-size:28px;font-weight:500;margin:0 0 8px;letter-spacing:-.5px}',
      '.pq-modal h2 em{font-style:italic;color:#C9AE6B}',
      '.pq-modal .pq-eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9AE6B;margin-bottom:16px;font-weight:600}',
      '.pq-modal p{font-size:14px;line-height:1.6;color:#A89B85;margin:12px 0}',
      '.pq-modal .pq-rule{height:1px;background:rgba(201,174,107,.3);margin:20px 0}',
      '.pq-modal .pq-check{display:flex;align-items:flex-start;gap:10px;margin:14px 0;text-align:left;font-size:12.5px;color:#F0E8D4;line-height:1.5;cursor:pointer}',
      '.pq-modal .pq-check input{margin-top:3px;accent-color:#C9AE6B;flex-shrink:0}',
      '.pq-modal .pq-btn{display:block;width:100%;padding:14px;background:#C9AE6B;color:#0A0908;border:0;font-family:Inter,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;cursor:pointer;margin-top:16px;transition:opacity .2s}',
      '.pq-modal .pq-btn:disabled{opacity:.3;cursor:not-allowed}',
      '.pq-modal .pq-btn:hover:not(:disabled){background:#D9BE7B}',
      '.pq-modal .pq-reject{display:block;width:100%;padding:10px;background:transparent;color:#A89B85;border:1px solid rgba(168,155,133,.3);font-family:Inter;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;margin-top:8px}',
      '.pq-modal a{color:#C9AE6B;border-bottom:1px solid rgba(201,174,107,.4);text-decoration:none}',
      '.pq-disclaimer{position:fixed;left:0;right:0;bottom:0;background:rgba(17,17,17,.95);color:#F5F5F5;font-size:10.5px;line-height:1.5;letter-spacing:.3px;text-align:center;padding:8px 60px;z-index:9998;backdrop-filter:blur(8px);font-family:Inter,sans-serif}',
      '.pq-cookie{position:fixed;left:16px;right:16px;bottom:48px;max-width:480px;margin:0 auto;background:#0A0908;border:1px solid #C9AE6B;color:#F0E8D4;padding:16px 20px;z-index:9997;font-family:Inter,sans-serif;font-size:12.5px;line-height:1.5;display:none}',
      '.pq-cookie.show{display:block}',
      '.pq-cookie a{color:#C9AE6B;text-decoration:underline}',
      '.pq-cookie .pq-cookie-btns{display:flex;gap:8px;margin-top:10px}',
      '.pq-cookie .pq-cookie-btns button{flex:1;padding:8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;cursor:pointer;border:0;font-family:Inter}',
      '.pq-cookie .pq-cookie-accept{background:#C9AE6B;color:#0A0908}',
      '.pq-cookie .pq-cookie-reject{background:transparent;color:#A89B85;border:1px solid rgba(168,155,133,.3)}'
    ].join('');
    document.head.appendChild(s);
  }

  function renderAgeGate(){
    if (localStorage.getItem(LS_AGE) === 'yes') return;
    if (document.getElementById('pq-age-gate')) return;
    var overlay = document.createElement('div');
    overlay.className = 'pq-overlay';
    overlay.id = 'pq-age-gate';
    overlay.innerHTML = [
      '<div class="pq-modal" role="dialog" aria-modal="true" aria-labelledby="pq-age-title">',
      '  <div class="pq-eyebrow">PEPTIQ Research</div>',
      '  <h2 id="pq-age-title">Acceso <em>restringido</em></h2>',
      '  <p>Este sitio comercializa peptidos research-grade exclusivamente para fines de investigacion cientifica. <b>No son medicamentos</b> y no estan aprobados por COFEPRIS, FDA ni EMA.</p>',
      '  <div class="pq-rule"></div>',
      '  <label class="pq-check"><input type="checkbox" id="pq-c1"> Confirmo que soy mayor de <b>18 anos</b> y tengo capacidad legal plena.</label>',
      '  <label class="pq-check"><input type="checkbox" id="pq-c2"> Entiendo que los productos son para <b>investigacion unicamente</b> y que su uso es responsabilidad de quien lo aplique.</label>',
      '  <label class="pq-check"><input type="checkbox" id="pq-c3"> Acepto los <a href="/legal.html#terminos" target="_blank">Terminos</a>, <a href="/legal.html#privacidad" target="_blank">Aviso de Privacidad</a> y <a href="/legal.html#aviso" target="_blank">Aviso Legal de Uso</a>.</label>',
      '  <button class="pq-btn" id="pq-accept" disabled>Confirmar y continuar</button>',
      '  <button class="pq-reject" id="pq-reject">Salir del sitio</button>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);
    var c1=document.getElementById('pq-c1'),c2=document.getElementById('pq-c2'),c3=document.getElementById('pq-c3'),btn=document.getElementById('pq-accept');
    function upd(){ btn.disabled = !(c1.checked && c2.checked && c3.checked); }
    [c1,c2,c3].forEach(function(c){ c.addEventListener('change', upd); });
    btn.addEventListener('click', function(){
      try{
        localStorage.setItem(LS_AGE, 'yes');
        localStorage.setItem('peptiq_age_verified_at', new Date().toISOString());
      }catch(e){}
      overlay.remove();
    });
    document.getElementById('pq-reject').addEventListener('click', function(){
      window.location.href = 'https://www.google.com';
    });
  }

  function renderDisclaimer(){
    if (document.getElementById('peptiq-global-disclaimer')) return;
    if (document.querySelector('.pq-disclaimer')) return;
    var d = document.createElement('div');
    d.className = 'pq-disclaimer';
    d.id = 'peptiq-global-disclaimer';
    d.textContent = 'Producto de uso exclusivo para investigacion. El uso es responsabilidad de quien lo aplique. Solo +18.';
    document.body.appendChild(d);
    document.body.style.paddingBottom = '36px';
  }

  function renderCookieBanner(){
    if (localStorage.getItem(LS_COOKIE)) return;
    if (document.getElementById('pq-cookie-banner')) return;
    var c = document.createElement('div');
    c.className = 'pq-cookie show';
    c.id = 'pq-cookie-banner';
    c.innerHTML = [
      'Usamos cookies para mejorar tu experiencia, medir trafico y personalizar contenido. ',
      'Consulta nuestro <a href="/legal.html#privacidad">Aviso de Privacidad</a>.',
      '<div class="pq-cookie-btns">',
      '  <button class="pq-cookie-reject" id="pq-cookie-reject">Solo esenciales</button>',
      '  <button class="pq-cookie-accept" id="pq-cookie-accept">Aceptar todas</button>',
      '</div>'
    ].join('');
    document.body.appendChild(c);
    document.getElementById('pq-cookie-accept').addEventListener('click', function(){
      try{ localStorage.setItem(LS_COOKIE, 'accept_all'); }catch(e){}
      c.remove();
    });
    document.getElementById('pq-cookie-reject').addEventListener('click', function(){
      try{ localStorage.setItem(LS_COOKIE, 'essentials_only'); }catch(e){}
      c.remove();
    });
  }

  function init(){
    injectCSS();
    renderDisclaimer();
    renderAgeGate();
    setTimeout(renderCookieBanner, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
