const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');

  // Click "CONFIRMAR IDENTIDAD"
  await page.click('#btn-confirmar-nombre');

  // Click "SALTAR INTRO" - wait for it to be visible first
  await page.waitForSelector('#btn-saltar-intro', { state: 'visible', timeout: 5000 });
  await page.click('#btn-saltar-intro');

  // Wait for the game to load and the apartment to be visible
  await page.waitForSelector('#btn-salir-apartamento', { state: 'visible', timeout: 5000 });
  await page.click('#btn-salir-apartamento');

  // Wait for the map to be visible
  await page.waitForSelector('#mapa-contenedor', { state: 'visible', timeout: 5000 });

  // Check if MERCADO button exists
  const mercadoBtn = await page.$('button:has-text("MERCADO")');
  if (mercadoBtn) {
    console.log('MERCADO button found on map');
    await page.screenshot({ path: 'mapa_mercado_v2.png' });

    await mercadoBtn.click();
    await page.waitForTimeout(1000); // Wait for transition
    await page.screenshot({ path: 'zona_mercado_v2.png' });
  } else {
    console.log('MERCADO button NOT found on map');
    await page.screenshot({ path: 'mapa_fail.png' });

    // Log all buttons to see what's there
    const buttons = await page.$$eval('button', btns => btns.map(b => b.innerText));
    console.log('Buttons found:', buttons);
  }

  await browser.close();
})();
