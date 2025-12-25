import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('\n=== STEP 1: Editor lädt ===');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: '.debug/screenshots/r6-loads.png',
    fullPage: true 
  });
  console.log('Screenshot: r6-loads.png');
  
  const initialBlocks = await page.locator('[data-block-id]').count();
  console.log('Initial blocks:', initialBlocks);
  
  console.log('\n=== STEP 2: Block hinzufügen (1x klicken) ===');
  
  const addButton = page.locator('button:has-text("Block hinzufügen")').first();
  await addButton.click();
  await page.waitForTimeout(1000);
  
  const blocksAfterAdd = await page.locator('[data-block-id]').count();
  console.log('Blocks after 1 click:', blocksAfterAdd);
  
  await page.screenshot({ 
    path: '.debug/screenshots/r6-blocks.png',
    fullPage: true 
  });
  console.log('Screenshot: r6-blocks.png');
  
  console.log('\n=== STEP 3: Drag testen ===');
  
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log('[BROWSER]', text);
  });
  
  const firstBlock = page.locator('[data-block-id]').first();
  const gripHandle = firstBlock.locator('[data-grip-handle]').first();
  
  await firstBlock.hover();
  await page.waitForTimeout(500);
  
  const gripBox = await gripHandle.boundingBox();
  if (!gripBox) {
    console.log('Grip handle not found!');
  } else {
    console.log('Grip handle visible');
    
    await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(500);
    
    await page.mouse.move(gripBox.x + 100, gripBox.y + 100, { steps: 10 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '.debug/screenshots/r6-drag.png',
      fullPage: true 
    });
    console.log('Screenshot: r6-drag.png');
    
    console.log('\n=== STEP 4: Side-by-Side Drop ===');
    
    const secondBlock = page.locator('[data-block-id]').nth(1);
    const secondBox = await secondBlock.boundingBox();
    
    if (secondBox) {
      await page.mouse.move(
        secondBox.x + secondBox.width - 20, 
        secondBox.y + secondBox.height / 2,
        { steps: 10 }
      );
      await page.waitForTimeout(1000);
      
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: '.debug/screenshots/r6-sidebyside.png',
        fullPage: true 
      });
      console.log('Screenshot: r6-sidebyside.png');
    }
  }
  
  console.log('\n=== CONSOLE LOGS ===');
  const dragStartLogs = consoleLogs.filter(log => log.includes('DRAG START'));
  const rightZoneLogs = consoleLogs.filter(log => log.includes('RIGHT ZONE'));
  const dropRightLogs = consoleLogs.filter(log => log.includes('DROP RIGHT'));
  
  console.log('DRAG START logs:', dragStartLogs.length);
  dragStartLogs.forEach(log => console.log('  -', log));
  
  console.log('RIGHT ZONE logs:', rightZoneLogs.length);
  rightZoneLogs.forEach(log => console.log('  -', log));
  
  console.log('DROP RIGHT logs:', dropRightLogs.length);
  dropRightLogs.forEach(log => console.log('  -', log));
  
  console.log('\n=== SUMMARY ===');
  console.log('Editor loads:', initialBlocks > 0 ? 'PASS' : 'FAIL');
  console.log('Block count after 1 click:', blocksAfterAdd, '(expected:', initialBlocks + 1, ')', blocksAfterAdd === initialBlocks + 1 ? 'PASS' : 'FAIL');
  console.log('Drag starts:', dragStartLogs.length > 0 ? 'PASS' : 'FAIL');
  console.log('Drop zones visible:', rightZoneLogs.length > 0 ? 'PASS' : 'FAIL');
  console.log('Side-by-side works:', dropRightLogs.length > 0 ? 'PASS' : 'FAIL');
  
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
