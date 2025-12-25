import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const msgType = msg.type();
    const text = msg.text();
    console.log('[CONSOLE ' + msgType + '] ' + text);
  });
  
  page.on('pageerror', error => {
    console.log('[PAGE ERROR] ' + error.message);
  });
  
  console.log('Navigating...');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(3000);
  
  const blockCount = await page.locator('[data-block-id]').count();
  console.log('Blocks rendered: ' + blockCount);
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
