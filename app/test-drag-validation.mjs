import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('\n=== STEP 1: Navigate and Find Blocks ===');
  await page.goto('http://localhost:5177/editor/new');
  await page.waitForTimeout(2000);
  
  const blocks = await page.locator('[data-block-id]').all();
  console.log('Blocks found (data-block-id):', blocks.length);
  
  for (let i = 0; i < blocks.length; i++) {
    const id = await blocks[i].getAttribute('data-block-id');
    console.log('   Block', i + 1, ':', id);
  }
  
  console.log('\n=== STEP 2: Add New Block ===');
  const addButton = page.getByRole('button', { name: /block hinzufügen/i });
  await addButton.click();
  await page.waitForTimeout(1000);
  
  const blocksAfterAdd = await page.locator('[data-block-id]').all();
  console.log('Blocks after add:', blocksAfterAdd.length);
  console.log('   Expected: 2, Got:', blocksAfterAdd.length, '→', blocksAfterAdd.length === 2 ? 'PASS' : 'FAIL');
  
  console.log('\n=== STEP 3: Check Grip Handle ===');
  await blocks[0].hover();
  await page.waitForTimeout(500);
  
  const gripHandles = await page.locator('[data-grip-handle]').all();
  console.log('Grip handles found:', gripHandles.length, '→', gripHandles.length > 0 ? 'PASS' : 'FAIL');
  
  console.log('\n=== STEP 4: Test Drag Start ===');
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('DRAG') || text.includes('DROP') || text.includes('ZONE')) {
      console.log('   Console:', text);
    }
  });
  
  if (gripHandles.length > 0) {
    const grip = gripHandles[0];
    const gripBox = await grip.boundingBox();
    
    if (gripBox) {
      console.log('   Starting drag...');
      await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(500);
      
      await page.mouse.move(gripBox.x + 200, gripBox.y, { steps: 10 });
      await page.waitForTimeout(1000);
      
      console.log('\n=== STEP 5: Drop on Right Side ===');
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: '../.debug/screenshots/r7-validation.png',
        fullPage: true 
      });
      console.log('Screenshot saved: .debug/screenshots/r7-validation.png');
    }
  }
  
  console.log('\n=== Validation Complete ===');
  console.log('Browser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
