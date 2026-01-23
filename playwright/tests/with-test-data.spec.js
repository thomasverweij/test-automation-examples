import { test, expect } from '../fixtures/testData.js';

test.describe('Product Search', () => {
  test('should search for product and verify it is displayed', async ({ page, testData }) => {
    // Navigate to the search page
    await page.goto('/search.html');
    
    // Verify the search page is loaded
    await expect(page.locator('h1')).toContainText('Product Search');
    
    // Get the search box
    const searchBox = page.locator('#searchBox');
    await expect(searchBox).toBeVisible();
    
    // Enter the search term from test data
    await searchBox.fill(testData.searchTerm);
    
    // Wait for results to be filtered (the filtering happens instantly via JavaScript)
    await page.waitForTimeout(500);
    
    // Verify that expected products are displayed
    for (const productName of testData.expectedProducts) {
      const productCard = page.locator('.product-card').filter({ hasText: productName });
      await expect(productCard).toBeVisible();
      
      // Verify the product name is displayed correctly
      const productNameElement = productCard.locator('.product-name');
      await expect(productNameElement).toContainText(productName);
    }
    
    // Verify the results count is shown
    const resultsCount = page.locator('#resultsCount');
    await expect(resultsCount).toBeVisible();
    await expect(resultsCount).toContainText(`Found ${testData.expectedProducts.length} product`);
  });

  test('should show no results for non-existent product', async ({ page, testData }) => {
    // Navigate to the search page
    await page.goto('/search.html');
    
    // Search for a product that doesn't exist
    const searchBox = page.locator('#searchBox');
    await searchBox.fill('NonExistentProductXYZ123');
    
    // Wait for results to be filtered
    await page.waitForTimeout(500);
    
    // Verify no results message is displayed
    const noResults = page.locator('.no-results');
    await expect(noResults).toBeVisible();
    await expect(noResults).toContainText('No products found');
  });

  test('should display all products when search is empty', async ({ page }) => {
    // Navigate to the search page
    await page.goto('/search.html');
    
    // Verify all 12 products are displayed initially
    const productCards = page.locator('.product-card');
    await expect(productCards).toHaveCount(12);
    
    // Verify results count shows all products
    const resultsCount = page.locator('#resultsCount');
    await expect(resultsCount).toContainText('Found 12 products');
  });
});
