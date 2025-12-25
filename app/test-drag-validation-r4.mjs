import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log('CONSOLE:', text);
  });

  console.log('\n### Step 1: Editor loads');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  const welcomeText = await page.locator('text=Willkommen bei MasterDoc').count();
  console.log('- Willkommen text visible:', welcomeText > 0 ? 'PASS' : 'FAIL');
  
  await page.screenshot({ path: '../.debug/screenshots/r4-step1-loads.png', fullPage: true });
  console.log('- Screenshot saved: r4-step1-loads.png');

  console.log('\n### Step 2: Block hinzufügen');
  const addButton = page.locator('button:has-text("Block hinzufügen")');
  
  await addButton.click();
  await page.waitForTimeout(500);
  await addButton.click();
  await page.waitForTimeout(500);
  await addButton.click();
  await page.waitForTimeout(1000);
  
  const blockCount = await page.locator('[data-block-id]').count();
  console.log('- Total blocks:', blockCount, '(expected: 4 including initial)');
  
  await page.screenshot({ path: '../.debug/screenshots/r4-step2-blocks.png', fullPage: true });
  console.log('- Screenshot saved: r4-step2-blocks.png');

  console.log('\n### Step 3: Drag & Drop');
  
  const firstGrip = page.locator('[data-block-id]').first().locator('[class*="cursor-grab"]').first();
  const gripBox = await firstGrip.boundingBox();
  
  if (!gripBox) {
    console.log('- ERROR: Could not find grip handle');
  } else {
    console.log('- Found grip at:', gripBox.x, gripBox.y);
    
    await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(300);
    
    const secondBlock = page.locator('[data-block-id]').nth(1);
    const secondBox = await secondBlock.boundingBox();
    
    if (secondBox) {
      const targetX = secondBox.x + secondBox.width - 50;
      const targetY = secondBox.y + secondBox.height / 2;
      
      console.log('- Moving to:', targetX, targetY);
      await page.mouse.move(targetX, targetY, { steps: 20 });
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: '../.debug/screenshots/r4-step3-drop.png', fullPage: true });
      console.log('- Screenshot saved: r4-step3-drop.png');
      
      await page.mouse.up();
      await page.waitForTimeout(1000);
    }
  }

  console.log('\n### Step 4: Side-by-Side Result');
  await page.screenshot({ path: '../.debug/screenshots/r4-step4-columns.png', fullPage: true });
  console.log('- Screenshot saved: r4-step4-columns.png');

  const columnsLayout = await page.locator('[class*="grid-cols"]').count();
  console.log('- Columns layout found:', columnsLayout > 0 ? 'PASS' : 'FAIL');

  console.log('\n### Console Logs:');
  consoleLogs.forEach(log => {
    if (log.includes('DRAG') || log.includes('DROP') || log.includes('ZONE') || log.includes('Error') || log.includes('error')) {
      console.log('  ' + log);
    }
  });

  await page.waitForTimeout(3000);
  await browser.close();
})();
