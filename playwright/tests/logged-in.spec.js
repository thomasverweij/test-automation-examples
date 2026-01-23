import { test, expect } from '@playwright/test';

test.describe('Logged in user tests', () => {
  test('should verify user is logged in on main page', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Verify the user is logged in by checking the user info
    const userNameElement = page.locator('#authUserLabel');
    await expect(userNameElement).toBeVisible();
    await expect(userNameElement).toContainText('User Two');
    
    // Verify the auth status label is visible
    const authStatusLabel = page.locator('#authStatusLabel');
    await expect(authStatusLabel).toBeVisible();
    await expect(authStatusLabel).toContainText('You are logged in');
    
    // Verify logout button is visible and login button is hidden
    const logoutBtn = page.locator('#logoutBtn');
    await expect(logoutBtn).toBeVisible();
    
    const loginBtn = page.locator('#loginBtn');
    await expect(loginBtn).toHaveClass(/hidden/);
  });

  test('should maintain session across page navigation', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Verify user is logged in
    await expect(page.locator('#authUserLabel')).toContainText('User Two');
    
    // Navigate to another page
    await page.goto('/css-selectors.html');
    
    // Navigate back to main page
    await page.goto('/');
    
    // Verify user is still logged in
    await expect(page.locator('#authUserLabel')).toContainText('User Two');
    await expect(page.locator('#logoutBtn')).toBeVisible();
  });
});
