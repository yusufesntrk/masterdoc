import { chromium } from 'playwright';

async function validate() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => console.log('[ERROR]', err.message));
  
  console.log('Step 1: Navigate');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '.debug/screenshots/step1.png', fullPage: true });
  
  const hasWelcome = await page.locator('text=Willkommen').count() > 0;
  console.log('Welcome text:', hasWelcome);
  
  console.log('\nStep 2: Add blocks');
  await page.click('button:has-text("Block hinzufügen")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Block hinzufügen")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '.debug/screenshots/step2.png', fullPage: true });
  
  console.log('\nStep 3: Drag test');
  const firstBlock = await page.locator('[data-block-id]').first();
  await firstBlock.hover();
  await page.waitForTimeout(1000);
  
  const grip = await page.locator('.drag-handle').first();
  const box = await grip.boundingBox();
  
  if (box) {
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.down();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '.debug/screenshots/step3.png', fullPage: true });
    
    const secondBlock = await page.locator('[data-block-id]').nth(1);
    const secondBox = await secondBlock.boundingBox();
    
    if (secondBox) {
      await page.mouse.move(secondBox.x + secondBox.width - 50, secondBox.y + 50, { steps: 10 });
      await page.waitForTimeout(500);
      await page.mouse.up();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '.debug/screenshots/step4.png', fullPage: true });
    }
  }
  
  console.log('\nLogs:', logs);
  await page.waitForTimeout(3000);
  await browser.close();
}

validate();
