const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  console.log('Navigating to /admin/login...');
  await page.goto('http://localhost:3000/admin/login');
  await page.waitForTimeout(2000);
  
  console.log('\nNavigating to /admin...');
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
