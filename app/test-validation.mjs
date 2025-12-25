import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    console.log('[CONSOLE]', text);
    logs.push(text);
  });
  
  page.on('pageerror', err => {
    console.log('[ERROR]', err.message);
  });
  
  console.log('Step 1: Navigate to Editor');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: '.debug/screenshots/step1-editor-loads.png',
    fullPage: true 
  });
  console.log('Screenshot saved: step1-editor-loads.png');
  
  const welcomeCount = await page.locator('text=Willkommen bei MasterDoc').count();
  console.log('Welcome text found:', welcomeCount > 0);
  
  console.log('
Step 2: Add blocks');
  for (let i = 0; i < 2; i++) {
    await page.click('button:has-text("Block hinzufügen")');
    await page.waitForTimeout(500);
  }
  await page.screenshot({ 
    path: '.debug/screenshots/step2-three-blocks.png',
    fullPage: true 
  });
  
  console.log('
Step 3: Test drag zones');
  const firstBlock = await page.locator('[data-block-id]').first();
  await firstBlock.hover();
  await page.waitForTimeout(1000);
  
  const gripHandle = await page.locator('.drag-handle').first();
  const gripBox = await gripHandle.boundingBox();
  
  if (gripBox) {
    console.log('Starting drag...');
    await page.mouse.move(gripBox.x + gripBox.width/2, gripBox.y + gripBox.height/2);
    await page.mouse.down();
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: '.debug/screenshots/step3-drag-zones.png',
      fullPage: true 
    });
    
    console.log('
Step 4: Drop to right');
    const secondBlock = await page.locator('[data-block-id]').nth(1);
    const secondBox = await secondBlock.boundingBox();
    
    if (secondBox) {
      await page.mouse.move(
        secondBox.x + secondBox.width - 50,
        secondBox.y + secondBox.height/2,
        { steps: 10 }
      );
      await page.waitForTimeout(500);
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: '.debug/screenshots/step4-side-by-side.png',
        fullPage: true 
      });
    }
  }
  
  console.log('
Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  console.log('
Collected console logs:');
  logs.forEach(log => console.log(' ', log));
  
  await browser.close();
})();
