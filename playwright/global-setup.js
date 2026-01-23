// @ts-check
import { chromium } from 'playwright';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: 'http://localhost:8888'
  });
  const page = await context.newPage();
  
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in login credentials (using user2 which doesn't require 2FA)
  await page.fill('#username', 'user2');
  await page.fill('#password', 'password2');
  
  // Submit login form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete
  await page.waitForURL('/');
  
  // Save storage state
  await context.storageState({ path: '.auth/user.json' });
  
  await browser.close();
}

export default globalSetup;
