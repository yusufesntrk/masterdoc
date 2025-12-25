import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  page.on('console', msg => console.log('[CONSOLE]', msg.text()));
  page.on('pageerror', err => console.log('[ERROR]', err.message));
  
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '.debug/screenshots/current-state.png', fullPage: true });
  console.log('Screenshot saved');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
