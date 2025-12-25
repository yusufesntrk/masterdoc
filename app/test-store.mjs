import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.addInitScript(() => {
    const originalCreateElement = React.createElement;
    React.createElement = function(...args) {
      if (args[0]?.name === 'Slate' || args[0]?.displayName === 'Slate') {
        console.log('Slate props:', args[1]);
      }
      return originalCreateElement.apply(this, args);
    };
  });

  page.on('console', msg => {
    console.log('[BROWSER]', msg.text());
  });

  page.on('pageerror', error => {
    console.log('ERROR:', error.message);
  });

  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
