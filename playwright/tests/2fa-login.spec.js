import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { TwoFAPage } from '../pages/TwoFAPage.js';
import { HomePage } from '../pages/HomePage.js';
import speakeasy from 'speakeasy';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get credentials from environment variables
const TWO_FA_SECRET = process.env.TWO_FA_SECRET;
const TEST_USER1_USERNAME = process.env.TEST_USER1_USERNAME;
const TEST_USER1_PASSWORD = process.env.TEST_USER1_PASSWORD;
const TEST_USER2_USERNAME = process.env.TEST_USER2_USERNAME;
const TEST_USER2_PASSWORD = process.env.TEST_USER2_PASSWORD;

test.describe('2FA Login Flow', () => {
  let loginPage;
  let twoFAPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    twoFAPage = new TwoFAPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
  });

  test('should successfully complete 2FA login flow', async ({ page }) => {
    // Step 1: Login with user1 credentials
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);

    // Step 2: Verify redirect to 2FA page
    await expect(page).toHaveURL(/\/2fa/);
    await expect(twoFAPage.codeInput).toBeVisible();

    // Step 3: Generate the TOTP code using the same secret as the server
    const twoFACode = speakeasy.totp({
      secret: TWO_FA_SECRET,
      encoding: 'base32'
    });

    // Step 4: Enter the valid 2FA code
    await twoFAPage.verifyCode(twoFACode);
    
    // Step 5: Verify successful login and redirect to home page
    await expect(page).toHaveURL('/');
    expect(await homePage.isLoggedIn()).toBe(true);
    await expect(homePage.authUserLabel).toContainText('User One');
    await expect(homePage.authStatusLabel).toContainText('You are logged in');
  });

  test('should validate 2FA code format', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Test: Code must be 6 digits - form has client-side validation
    await twoFAPage.enterCode('123');
    
    // Input should show the entered value
    const inputValue = await twoFAPage.codeInput.inputValue();
    expect(inputValue).toBe('123');
    
    // Verify the input has the required pattern attribute
    await expect(twoFAPage.codeInput).toHaveAttribute('pattern', '[0-9]{6}');
  });

  test('should only accept numeric input', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Test: Should only allow numbers
    await twoFAPage.codeInput.fill('abc123');
    
    // Input should only contain digits
    const inputValue = await twoFAPage.codeInput.inputValue();
    expect(inputValue).toMatch(/^\d*$/);
  });

  test('should limit code input to 6 digits', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Test: Should limit to 6 characters
    await twoFAPage.codeInput.fill('1234567890');
    
    const inputValue = await twoFAPage.codeInput.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(6);
  });

  test('should show error for invalid 2FA code', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Try with invalid code
    await twoFAPage.verifyCode('999999');
    
    // Should show error message
    await expect(twoFAPage.errorMessage).toBeVisible();
    await expect(twoFAPage.errorMessage).toContainText('Invalid authentication code');
    
    // Code input should be cleared and focused
    const inputValue = await twoFAPage.codeInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('should allow navigation back to login page', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Click back to login
    await twoFAPage.goBackToLogin();
    
    // Should be back on login page
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('should display info box with instructions', async ({ page }) => {
    // Login to reach 2FA page
    await loginPage.login(TEST_USER1_USERNAME, TEST_USER1_PASSWORD);
    await expect(page).toHaveURL(/\/2fa/);

    // Info box should be visible with testing instructions
    await expect(twoFAPage.infoBox).toBeVisible();
    await expect(twoFAPage.infoBox).toContainText('For Testing');
  });

  test('should not access 2FA page without pending login', async ({ page }) => {
    // Try to access 2FA page directly without logging in first
    await page.goto('/2fa');
    
    // Server should redirect to login page when no pending session exists
    await expect(page).toHaveURL(/\/login/);
    
    // Should be on login page
    await expect(loginPage.usernameInput).toBeVisible();
  });
});

test.describe('2FA Login Flow - User without 2FA', () => {
  let loginPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
  });

  test('should login directly without 2FA for user2', async ({ page }) => {
    // Login with user2 (no 2FA)
    await loginPage.login(TEST_USER2_USERNAME, TEST_USER2_PASSWORD);

    // Should redirect directly to home page
    await expect(page).toHaveURL('/');
    
    // Should be logged in
    expect(await homePage.isLoggedIn()).toBe(true);
    await expect(homePage.authUserLabel).toContainText('User Two');
  });
});
