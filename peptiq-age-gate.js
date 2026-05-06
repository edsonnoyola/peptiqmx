// PEPTIQ Age Gate + Research Use Only Disclaimer
// Imitates Certified-PepMex MX flow · Meta compliance
(function () {
  'use strict';

  // Check cookie · skip if already accepted (30 day expiry)
  const KEY = 'peptiq_age_research_ack';
  const COOKIE_DAYS = 30;

  function readCookie(name) {
    return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1];
  }
  function setCookie(name, val, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${val}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  }

  if (readCookie(KEY) === '1') return;

  // Build modal
  const overlay = document.createElement('div');
  overlay.id = 'peptiq-agegate';
  overlay.innerHTML = `
    <style>
      #peptiq-agegate {
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(8, 12, 18, 0.92); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #peptiq-agegate .modal {
        background: #0d1117; color: #f5f3ee; max-width: 480px; width: 100%;
        border: 1px solid #988646; border-radius: 8px; padding: 32px;
        text-align: left; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      }
      #peptiq-agegate .badge {
        display: inline-block; background: #988646; color: #0d1117;
        padding: 6px 14px; border-radius: 20px; font-size: 11px;
        font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
        margin-bottom: 20px;
      }
      #peptiq-agegate h2 {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 26px; margin: 0 0 14px; line-height: 1.2;
      }
      #peptiq-agegate p {
        font-size: 14px; line-height: 1.6; color: #c8c4ba;
        margin: 0 0 14px;
      }
      #peptiq-agegate .accept {
        display: block; width: 100%; padding: 16px;
        background: #988646; color: #0d1117; border: none;
        border-radius: 4px; font-size: 13px; font-weight: 700;
        letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
        margin-top: 20px; transition: 0.2s;
      }
      #peptiq-agegate .accept:hover { background: #b59c52; }
      #peptiq-agegate .reject {
        display: block; width: 100%; padding: 12px;
        background: transparent; color: #6c6863; border: none;
        font-size: 11px; cursor: pointer; margin-top: 8px;
        text-decoration: underline; letter-spacing: 1px;
      }
      #peptiq-agegate .legal {
        font-size: 10px; color: #6c6863; margin-top: 18px;
        padding-top: 14px; border-top: 1px solid #2a2520;
        line-height: 1.5;
      }
    </style>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pag-title">
      <span class="badge">Investigación</span>
      <h2 id="pag-title">Solo para uso en investigación</h2>
      <p>
        Al navegar este sitio, reconoces que todos los productos y la información se
        proporcionan únicamente con <strong>fines de investigación</strong> y no están
        destinados al consumo humano ni a uso médico.
      </p>
      <p>
        <strong>El uso de este producto es responsabilidad de quien lo usa.</strong>
      </p>
      <p>
        Debes tener <strong>18 años de edad o más</strong> para utilizar este sitio web.
      </p>
      <button class="accept" id="pag-accept">Entiendo · Soy mayor de 18</button>
      <a class="reject" href="https://www.google.com">Salir del sitio</a>
      <div class="legal">
        PEPTIQ MX · Compuestos de investigación research-grade · No aprobado por COFEPRIS
        ni FDA para uso humano · El uso es responsabilidad del investigador.
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('pag-accept').addEventListener('click', () => {
    setCookie(KEY, '1', COOKIE_DAYS);
    overlay.remove();
    document.body.style.overflow = '';
  });
})();
