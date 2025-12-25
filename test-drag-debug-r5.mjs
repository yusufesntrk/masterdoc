import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== ROUND 5 VALIDATION ===\n');
  
  // Step 1: Navigate
  console.log('Step 1: Navigating to editor...');
  await page.goto('http://localhost:5174/editor/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Check console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Check if page loaded (not white screen)
  const bodyText = await page.textContent('body');
  const hasContent = bodyText && bodyText.length > 100;
  
  console.log('✓ Page loaded:', hasContent ? 'YES' : 'NO (white screen)');
  
  // Take screenshot
  await page.screenshot({ path: '/Users/yusufesentuerk/masterdoc/masterdoc/.debug/screenshots/r5-loads.png', fullPage: true });
  console.log('✓ Screenshot saved: r5-loads.png');
  
  // Check for Slate error
  const slateError = await page.locator('text=/Slate error|Cannot find/i').count();
  console.log('✓ Slate error present:', slateError > 0 ? 'YES (FAIL)' : 'NO (PASS)');
  
  // Wait a bit for any async errors
  await page.waitForTimeout(2000);
  
  // Step 2: Try to add block
  console.log('\nStep 2: Testing block insertion...');
  const addBlockBtn = page.locator('text=Block hinzufügen');
  const btnVisible = await addBlockBtn.isVisible();
  console.log('✓ "Block hinzufügen" button visible:', btnVisible ? 'YES' : 'NO');
  
  if (btnVisible) {
    await addBlockBtn.click();
    await page.waitForTimeout(500);
    
    // Check if new block appeared
    const blocks = await page.locator('[draggable="true"]').count();
    console.log('✓ Blocks after click:', blocks);
    
    await page.screenshot({ path: '/Users/yusufesentuerk/masterdoc/masterdoc/.debug/screenshots/r5-blocks.png' });
    console.log('✓ Screenshot saved: r5-blocks.png');
  }
  
  // Step 3: Test drag (if blocks exist)
  const grips = await page.locator('[draggable="true"]').count();
  console.log('\nStep 3: Testing drag functionality...');
  console.log('✓ Draggable grips found:', grips);
  
  if (grips > 0) {
    // Setup console listener for drag logs
    const dragLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('DRAG START') || text.includes('DROP')) {
        dragLogs.push(text);
      }
    });
    
    // Try to drag
    const firstGrip = page.locator('[draggable="true"]').first();
    const box = await firstGrip.boundingBox();
    
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + 100, { steps: 5 });
      await page.waitForTimeout(500);
      await page.mouse.up();
      
      console.log('✓ Drag performed');
      await page.waitForTimeout(1000);
      
      console.log('✓ Drag console logs:', dragLogs.length > 0 ? dragLogs.join(', ') : 'NONE');
    }
  }
  
  // Final console errors check
  console.log('\n=== CONSOLE ERRORS ===');
  if (errors.length > 0) {
    errors.forEach(err => console.log('❌', err));
  } else {
    console.log('✓ No console errors');
  }
  
  await browser.close();
})();
