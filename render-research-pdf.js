const puppeteer = require('/Users/end/Desktop/es /node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const htmlPath = 'file://' + path.resolve(__dirname, 'MARKET-RESEARCH-PEPTIQ.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.resolve(__dirname, 'MARKET-RESEARCH-PEPTIQ.pdf'),
    format: 'Letter',
    landscape: true,
    printBackground: true,
    margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' }
  });
  await browser.close();
  console.log('PDF creado: MARKET-RESEARCH-PEPTIQ.pdf');
})();
