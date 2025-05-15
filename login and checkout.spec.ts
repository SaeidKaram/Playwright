import { test, expect } from '@playwright/test';

// Constants
const BASE_URL = 'https://www.demoblaze.com/';
const USERNAME = 'Saeid';
const PASSWORD = '1234';

// E2E Test
test('User login, add item to cart and checkout', async ({ page }) => {
  // Step 1: Go to the homepage
  await page.goto(BASE_URL);

  // Step 2: Click login
  await page.click('#login2');
  await expect(page.locator('#logInModal')).toBeVisible();

  // Step 3: Fill login form and submit
  await page.fill('#loginusername', USERNAME);
  await page.fill('#loginpassword', PASSWORD);
  await page.click('button:has-text("Log in")');

  // Step 4: Wait for login to reflect
  await page.waitForSelector('#nameofuser', { timeout: 10000 });
  await expect(page.locator('#nameofuser')).toHaveText(`Welcome ${USERNAME}`);

  // Step 5: Click on a product (e.g., Samsung galaxy s6)
  await page.click('a:has-text("Samsung galaxy s6")');

  // Step 6: Click "Add to cart" and handle alert
  const dialogPromise = page.waitForEvent('dialog');
  await page.click('a:has-text("Add to cart")');
  const dialog = await dialogPromise;
  await dialog.accept();

  // Step 7: Go to cart
  await page.click('#cartur');
  await expect(page.locator('tr.success', { hasText: 'Samsung galaxy s6' }).first()).toBeVisible({ timeout: 10000 });

  // Step 8: Place order
  await page.click('button:has-text("Place Order")');
  await expect(page.locator('#orderModal')).toBeVisible({ timeout: 10000 });

  // Step 9: Fill out order form
  await page.fill('#name', 'Saeid Karam');
  await page.fill('#country', 'Egypt');
  await page.fill('#city', 'Cairo');
  await page.fill('#card', '4111111111111111');
  await page.fill('#month', '01');
  await page.fill('#year', '2026');

  // Step 10: Submit purchase
  await page.click('button:has-text("Purchase")');

  // Step 11: Verify confirmation
  await expect(page.locator('.sweet-alert')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.sweet-alert h2')).toHaveText('Thank you for your purchase!');

  // Step 12: Close modal
  await page.click('button:has-text("OK")');
}, { timeout: 60000 });
