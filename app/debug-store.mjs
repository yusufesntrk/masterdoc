import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating and monitoring store...');
  
  page.on('console', msg => {
    const text = msg.text();
    console.log('CONSOLE:', text);
  });
  
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  // Check Zustand store
  const storeContent = await page.evaluate(() => {
    const w = window;
    const state = w.useEditorStore?.getState?.();
    return {
      hasStore: !!state,
      content: state?.content,
      contentType: typeof state?.content,
      contentIsArray: Array.isArray(state?.content),
      contentLength: state?.content?.length
    };
  });
  
  console.log('\n=== STORE STATE ===');
  console.log(JSON.stringify(storeContent, null, 2));
  
  await page.screenshot({ path: '../.debug/screenshots/store-debug.png', fullPage: true });
  
  console.log('\nBrowser stays open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
