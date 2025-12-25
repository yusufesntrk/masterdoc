import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('[ERROR]', error.message);
  });

  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  // Prüfe content aus dem Store
  const storeContent = await page.evaluate(() => {
    // @ts-ignore - Access Zustand store
    return window.__ZUSTAND__?.editorStore?.getState?.()?.content;
  });
  
  console.log('Store Content:', JSON.stringify(storeContent, null, 2));
  console.log('\nErrors:', errors);

  await browser.close();
})();
