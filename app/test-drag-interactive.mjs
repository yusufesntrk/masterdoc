/**
 * Interactive Drag & Drop Test
 * Opens browser for manual testing of side-by-side block placement
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting interactive drag test...\n');

  const browser = await chromium.launch({
    headless: false,  // Show browser for manual testing
    slowMo: 100       // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('🚀') || text.includes('📍') || text.includes('💧') || text.includes('🛑') || text.includes('📦')) {
      console.log(`[CONSOLE] ${text}`);
    }
  });

  console.log('📱 Navigating to editor...');
  await page.goto('http://localhost:5174/editor/new');
  await page.waitForTimeout(1000);

  // Add 2 more blocks
  console.log('➕ Adding blocks...');
  const addBlockBtn = page.locator('button:has-text("Block hinzufügen")');
  await addBlockBtn.click();
  await page.waitForTimeout(500);
  await addBlockBtn.click();
  await page.waitForTimeout(500);

  // Count blocks
  const blockCount = await page.locator('[data-block-id]').count();
  console.log(`📦 Total blocks: ${blockCount}`);

  // Check for grip handles
  const gripCount = await page.locator('[data-grip-handle]').count();
  console.log(`🎯 Grip handles: ${gripCount}`);

  console.log('\n' + '='.repeat(50));
  console.log('🖱️  MANUAL TEST INSTRUCTIONS:');
  console.log('='.repeat(50));
  console.log('1. Hover over any block to see the grip handle (⋮⋮)');
  console.log('2. Drag the grip handle to LEFT or RIGHT of another block');
  console.log('3. A BLUE DROP ZONE should appear (64px wide)');
  console.log('4. Drop the block to create SIDE-BY-SIDE layout');
  console.log('5. Try adding more blocks next to each other (up to 4)');
  console.log('='.repeat(50));
  console.log('\n📋 Watch the console for drag events:');
  console.log('   🚀 DRAG START! - when drag begins');
  console.log('   📍 LEFT/RIGHT ZONE ENTER - when over drop zone');
  console.log('   💧 DROP LEFT/RIGHT - when dropped');
  console.log('\n⏳ Browser will stay open for 2 minutes for testing...');
  console.log('   Press Ctrl+C to close earlier.\n');

  // Keep browser open for manual testing
  await page.waitForTimeout(120000); // 2 minutes

  await browser.close();
  console.log('✅ Test complete!');
})();
