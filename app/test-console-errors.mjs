import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    allLogs.push({ type, text });
    console.log('[CONSOLE-' + type + ']', text);
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
  });

  page.on('requestfailed', request => {
    console.log('[REQUEST FAILED]', request.url(), request.failure().errorText);
  });

  console.log('Navigating to http://localhost:5174/editor/new...\n');
  
  try {
    await page.goto('http://localhost:5174/editor/new', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    console.log('\nPage loaded, waiting for React...');
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    console.log('HTML Length:', html.length);
    
    const rootElement = await page.locator('#root').innerHTML().catch(() => null);
    if (rootElement) {
      console.log('\n=== #root content (first 500 chars) ===');
      console.log(rootElement.substring(0, 500));
    } else {
      console.log('\n#root element not found or empty');
    }
    
  } catch (error) {
    console.log('\nNavigation error:', error.message);
  }

  await browser.close();
})();
