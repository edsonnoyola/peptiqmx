// PEPTIQ MX · Legal Disclaimer Banner · loaded on every public page
// Auto-injects a fixed footer banner with research-grade regulatory disclaimer
(function() {
  'use strict';

  // Skip if already has manual disclaimer
  if (document.querySelector('.peptiq-legal-banner') ||
      document.body.innerText.includes('Research-grade · Producto de uso exclusivo para investigación')) {
    return;
  }

  // Inject styles
  var style = document.createElement('style');
  style.textContent = `
    .peptiq-legal-banner{
      position:fixed;bottom:0;left:0;right:0;
      background:#000;color:rgba(255,255,255,0.7);
      font-family:'Inter','Helvetica Neue',Arial,sans-serif;
      font-size:11px;line-height:1.45;font-style:italic;font-weight:400;
      padding:10px 20px 12px;
      text-align:center;
      border-top:1px solid #988646;
      z-index:9998;
      backdrop-filter:blur(6px);
      box-shadow:0 -8px 24px rgba(0,0,0,0.4);
    }
    .peptiq-legal-banner b{color:#988646;font-weight:600;font-style:normal;letter-spacing:1px;font-size:10px;text-transform:uppercase;margin-right:6px}
    .peptiq-legal-close{
      position:absolute;top:8px;right:14px;
      background:transparent;border:none;color:rgba(255,255,255,0.5);
      cursor:pointer;font-size:14px;padding:2px 6px;line-height:1;
    }
    .peptiq-legal-close:hover{color:#988646}
    body{padding-bottom:80px !important}
    @media(max-width:600px){
      .peptiq-legal-banner{font-size:10px;padding:10px 32px 12px}
      body{padding-bottom:110px !important}
    }
  `;
  document.head.appendChild(style);

  // Inject banner
  var banner = document.createElement('div');
  banner.className = 'peptiq-legal-banner';
  banner.innerHTML = '<b>⚠ Aviso legal</b> Research-grade · Producto de uso exclusivo para investigación científica · No aprobado por COFEPRIS ni FDA para uso humano · No es medicamento · No es sustituto de tratamiento médico · El uso es responsabilidad de quien lo aplique. La etiqueta del vial puede variar según el lote · compuesto y pureza HPLC verificables vía COA Janoshik.<button class="peptiq-legal-close" onclick="this.parentElement.style.display=\'none\';document.body.style.paddingBottom=\'0\'" aria-label="Cerrar">×</button>';
  document.body.appendChild(banner);
})();
