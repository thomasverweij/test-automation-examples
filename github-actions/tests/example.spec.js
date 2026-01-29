const { test, expect } = require('@playwright/test');

test.describe('Playwright Documentation Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Click on search
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type in search box
    await page.getByPlaceholder('Search docs').fill('screenshot');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Verify results are shown
    const results = page.locator('.DocSearch-Hits');
    await expect(results).toBeVisible();
  });

  test('navigation menu', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Check that the main navigation exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Verify API link exists
    await expect(page.getByRole('link', { name: 'API', exact: true })).toBeVisible();
  });

  test('verify page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('https://playwright.dev/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in reasonable time (less than 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Verify page is interactive
    await expect(page.getByRole('link', { name: 'Get started' })).toBeEnabled();
  });
});
