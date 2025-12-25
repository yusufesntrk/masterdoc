import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    if (text.includes('editorStore') || text.includes('content') || text.includes('ERROR')) {
      console.log('[LOG]', text);
    }
  });

  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('[ERROR]', error.message);
  });

  console.log('Navigating...');
  await page.goto('http://localhost:5174/editor/new');
  
  console.log('Waiting for page to load...');
  await page.waitForTimeout(3000);
  
  // Inject debug code
  const debugResult = await page.evaluate(() => {
    try {
      // Check if React is loaded
      const reactRoot = document.getElementById('root');
      const hasContent = reactRoot && reactRoot.children.length > 0;
      
      return {
        reactMounted: hasContent,
        rootHTML: reactRoot?.innerHTML?.substring(0, 200) || 'empty',
      };
    } catch (e) {
      return { error: e.message };
    }
  });
  
  console.log('\nDebug Result:', debugResult);
  console.log('\nTotal Errors:', errors.length);

  await browser.close();
})();
