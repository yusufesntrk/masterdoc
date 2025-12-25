import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const msgType = msg.type();
    const text = msg.text();
    console.log(`[BROWSER ${msgType}] ${text}`);
  });
  
  await page.goto('http://localhost:5174/editor/new');
  console.log('Navigated to editor');
  
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '../.debug/screenshots/drag-1-initial.png', fullPage: true });
  console.log('Screenshot 1: Initial state');
  
  console.log('Adding first text block...');
  
  const addButton = page.locator('button:has-text("Block hinzufügen"), button:has-text("Add Block"), [data-testid="add-block"]').first();
  
  if (await addButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await addButton.click();
    await page.waitForTimeout(500);
    
    const textOption = page.locator('button:has-text("Text"), [data-block-type="text"]').first();
    if (await textOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await textOption.click();
      await page.waitForTimeout(500);
    }
  }
  
  console.log('Adding second text block...');
  if (await addButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await addButton.click();
    await page.waitForTimeout(500);
    
    const textOption = page.locator('button:has-text("Text"), [data-block-type="text"]').first();
    if (await textOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await textOption.click();
      await page.waitForTimeout(500);
    }
  }
  
  await page.screenshot({ path: '../.debug/screenshots/drag-2-blocks-added.png', fullPage: true });
  console.log('Screenshot 2: Blocks added');
  
  await page.waitForTimeout(2000);
  
  const dragHandles = page.locator('[draggable="true"]');
  const handleCount = await dragHandles.count();
  console.log(`Found ${handleCount} draggable handles`);
  
  if (handleCount >= 2) {
    const firstHandle = dragHandles.nth(0);
    const secondHandle = dragHandles.nth(1);
    
    await firstHandle.hover();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: '../.debug/screenshots/drag-3-hover-first.png', fullPage: true });
    console.log('Screenshot 3: Hovering first block');
    
    const firstBox = await firstHandle.boundingBox();
    const secondBox = await secondHandle.boundingBox();
    
    if (firstBox && secondBox) {
      console.log('Starting drag operation...');
      
      await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(300);
      
      await page.screenshot({ path: '../.debug/screenshots/drag-4-drag-start.png', fullPage: true });
      console.log('Screenshot 4: Drag started');
      
      await page.mouse.move(
        secondBox.x + secondBox.width - 10, 
        secondBox.y + secondBox.height / 2,
        { steps: 10 }
      );
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: '../.debug/screenshots/drag-5-hovering-right-zone.png', fullPage: true });
      console.log('Screenshot 5: Hovering right drop zone');
      
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: '../.debug/screenshots/drag-6-after-drop.png', fullPage: true });
      console.log('Screenshot 6: After drop');
    }
  }
  
  console.log('Waiting 5 seconds...');
  await page.waitForTimeout(5000);
  
  await browser.close();
  console.log('Test completed');
})();
