import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  const logMsg = (msg) => {
    const msgType = msg.type();
    const text = msg.text();
    console.log('[BROWSER ' + msgType + '] ' + text);
  };
  page.on('console', logMsg);
  
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '../.debug/screenshots/manual-1-initial.png', fullPage: true });
  
  const addBlockBtn = page.locator('button:has-text("Block hinzufügen")');
  await addBlockBtn.click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '../.debug/screenshots/manual-2-after-first-click.png', fullPage: true });
  
  await addBlockBtn.click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '../.debug/screenshots/manual-3-two-blocks.png', fullPage: true });
  
  const grips = page.locator('.lucide-grip-vertical').locator('..');
  const gripCount = await grips.count();
  console.log('Found ' + gripCount + ' grip handles');
  
  if (gripCount >= 2) {
    const firstBlock = page.locator('[data-slate-node="element"]').first();
    await firstBlock.hover();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: '../.debug/screenshots/manual-4-hover-first.png', fullPage: true });
    
    const firstGrip = grips.first();
    const firstBox = await firstGrip.boundingBox();
    
    const secondBlock = page.locator('[data-slate-node="element"]').nth(1);
    const secondBox = await secondBlock.boundingBox();
    
    if (firstBox && secondBox) {
      await page.mouse.move(firstBox.x + 5, firstBox.y + firstBox.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(200);
      
      await page.screenshot({ path: '../.debug/screenshots/manual-5-drag-start.png', fullPage: true });
      
      await page.mouse.move(
        secondBox.x + secondBox.width - 5,
        secondBox.y + secondBox.height / 2,
        { steps: 10 }
      );
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: '../.debug/screenshots/manual-6-over-right-zone.png', fullPage: true });
      
      await page.mouse.up();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: '../.debug/screenshots/manual-7-after-drop.png', fullPage: true });
    }
  }
  
  console.log('Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
