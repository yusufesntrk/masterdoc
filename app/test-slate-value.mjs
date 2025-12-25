import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  // Check editor content via React DevTools or window
  const debugInfo = await page.evaluate(() => {
    // Try to access the Slate editor instance
    const editableDiv = document.querySelector('[contenteditable="true"]');
    return {
      hasEditableDiv: !!editableDiv,
      editableContent: editableDiv ? editableDiv.innerHTML : null,
      blockCount: document.querySelectorAll('[data-block-id]').length,
    };
  });
  
  console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
