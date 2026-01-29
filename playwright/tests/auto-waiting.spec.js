import { test, expect } from '@playwright/test';

test.describe('Auto-Waiting Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dynamic-elements.html');
  });

  test('should wait for dynamically appearing element', async ({ page }) => {
    // Click button that triggers delayed element
    await page.click('text=Trigger Element');
    
    // Playwright will auto-wait for the element to appear (1500ms delay)
    const delayedElement = page.locator('#delayed-element');
    await expect(delayedElement).toBeVisible();
    await expect(delayedElement).toHaveText('✓ I appeared after a delay!');
  });

  test('should wait for element state change', async ({ page }) => {
    const stateButton = page.locator('#state-button');
    const stateContent = page.locator('#state-content');
    
    // Initial state
    await expect(stateButton).toHaveText('Not Clicked');
    await expect(stateContent).not.toBeVisible();
    
    // Click and wait for state change
    await stateButton.click();
    await expect(stateButton).toHaveText('Clicked');
    await expect(stateContent).toBeVisible();
    await expect(stateContent).toHaveText('✓ State changed to clicked');
  });

  test('should wait for element to become enabled', async ({ page }) => {
    const input = page.locator('#dynamic-input');
    const button = page.locator('#dynamic-button');
    const buttonContent = page.locator('#dynamic-button-content');
    
    // Initial state - button is disabled
    await expect(button).toBeDisabled();
    await expect(button).toHaveText('Submit (Initially Disabled)');
    await expect(buttonContent).not.toBeVisible();
    
    // Type in input - button should become enabled
    await input.fill('test input');
    await expect(button).toBeEnabled();
    await expect(buttonContent).toBeVisible();
    await expect(buttonContent).toHaveText('✓ Button is now enabled');
    
    // Clear input - button should be disabled again
    await input.clear();
    await expect(button).toBeDisabled();
    await expect(buttonContent).not.toBeVisible();
  });

  test('should wait for dynamically added list items', async ({ page }) => {
    const list = page.locator('#dynamic-list');
    const addButton = page.getByRole('button', { name: 'Add Item' });
    
    // Initially has 1 item
    await expect(list.locator('li')).toHaveCount(1);
    await expect(list.locator('li').first()).toHaveText('Item 1');
    
    // Add second item
    await addButton.click();
    await expect(list.locator('li')).toHaveCount(2);
    await expect(list.locator('li').nth(1)).toHaveText('Item 2');
    
    // Add third item
    await addButton.click();
    await expect(list.locator('li')).toHaveCount(3);
    await expect(list.locator('li').nth(2)).toHaveText('Item 3');
  });

  test('should wait for modal to appear and close', async ({ page }) => {
    const modalOverlay = page.locator('#modal-overlay');
    const modalCard = page.locator('.modal-card');
    const openButton = page.getByRole('button', { name: 'Open Modal' });
    const closeButton = modalCard.getByRole('button', { name: 'Close' });
    
    // Modal initially hidden
    await expect(modalOverlay).not.toBeVisible();
    
    // Open modal
    await openButton.click();
    await expect(modalOverlay).toBeVisible();
    await expect(modalCard).toBeVisible();
    await expect(modalCard.locator('h3')).toHaveText('Modal Content');
    await expect(modalCard.locator('p')).toHaveText('This modal appears dynamically');
    
    // Close modal
    await closeButton.click();
    await expect(modalOverlay).not.toBeVisible();
  });

  test('should handle multiple auto-waiting scenarios in sequence', async ({ page }) => {
    // Test 1: Trigger delayed element
    await page.click('text=Trigger Element');
    await expect(page.locator('#delayed-element')).toBeVisible();
    
    // Test 2: Change state
    await page.click('#state-button');
    await expect(page.locator('#state-button')).toHaveText('Clicked');
    
    // Test 3: Enable button
    await page.fill('#dynamic-input', 'some text');
    await expect(page.locator('#dynamic-button')).toBeEnabled();
    
    // Test 4: Add list items
    await page.click('text=Add Item');
    await expect(page.locator('#dynamic-list li')).toHaveCount(2);
    
    // Test 5: Open and close modal
    await page.getByRole('button', { name: 'Open Modal' }).click();
    await expect(page.locator('#modal-overlay')).toBeVisible();
    await page.locator('.modal-card').getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('#modal-overlay')).not.toBeVisible();
  });
});
