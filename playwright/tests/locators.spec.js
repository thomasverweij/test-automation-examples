import { test, expect } from '@playwright/test';

test.describe('Locator Examples - CSS Selectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-selectors.html');
  });

  test('should find element by ID selector', async ({ page }) => {
    const button = page.locator('#css-id-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click Me (ID)');
    
    const content = page.locator('#css-id-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by class selector', async ({ page }) => {
    const button = page.locator('.css-class-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click Me (Class)');
    
    const content = page.locator('#css-class-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by data-testid attribute', async ({ page }) => {
    const button = page.locator('[data-testid="css-attr-button"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click Me (Attr)');
    
    const content = page.locator('#css-attr-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element using descendant selector', async ({ page }) => {
    const nestedSpan = page.locator('.css-parent > #css-nested-span');
    await expect(nestedSpan).toBeVisible();
    await expect(nestedSpan).toHaveText('Parent > Child');
    
    const showButton = page.locator('button', { hasText: 'Show Element' });
    const content = page.locator('#css-descendant-content');
    await expect(content).not.toHaveClass(/show/);
    
    await showButton.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should verify page title and header', async ({ page }) => {
    await expect(page).toHaveTitle('CSS Selectors Examples');
    
    const header = page.locator('h1');
    await expect(header).toContainText('CSS Selectors Examples');
  });
});

test.describe('Locator Examples - Role-Based Selectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/role-selectors.html');
  });

  test('should find element by button role', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Click Me (Button Role)' });
    await expect(button).toBeVisible();
    
    const content = page.locator('#role-button-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by link role', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Click Link' });
    await expect(link).toBeVisible();
    
    const content = page.locator('#role-link-content');
    await expect(content).not.toHaveClass(/show/);
    
    await link.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by textbox role', async ({ page }) => {
    const textbox = page.getByRole('textbox');
    await expect(textbox).toBeVisible();
    await expect(textbox).toHaveAttribute('placeholder', 'Enter text...');
    
    const content = page.locator('#role-textbox-content');
    await expect(content).not.toHaveClass(/show/);
    
    await textbox.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by checkbox role and interact', async ({ page }) => {
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
    
    const content = page.locator('#role-checkbox-content');
    await expect(content).not.toHaveClass(/show/);
    
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element by combobox role', async ({ page }) => {
    const combobox = page.getByRole('combobox');
    await expect(combobox).toBeVisible();
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    
    const content = page.locator('#role-combobox-content');
    await expect(content).not.toHaveClass(/show/);
    
    await combobox.selectOption('Option 1');
    await expect(content).toHaveClass(/show/);
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');
  });

  test('should verify accessibility heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Role-Based Selectors Examples/ });
    await expect(heading).toBeVisible();
  });

  test('should find back to dashboard link by role', async ({ page }) => {
    const backLink = page.getByRole('link', { name: '← Back to Dashboard' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });
});

test.describe('Locator Examples - Text-Based Selectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-selectors.html');
  });

  test('should find button by exact text match', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Exact Text Button', exact: true });
    await expect(button).toBeVisible();
    
    const content = page.locator('#text-exact-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find button by partial text match', async ({ page }) => {
    const button = page.getByRole('button', { name: /Partial Text/ });
    await expect(button).toBeVisible();
    await expect(button).toHaveText('This Button Has Partial Text');
    
    const content = page.locator('#text-partial-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find input by label text', async ({ page }) => {
    const input = page.getByLabel('Username Field');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('id', 'text-input');
    
    const content = page.locator('#text-label-content');
    await expect(content).not.toHaveClass(/show/);
    
    await input.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find heading by text', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Find This Heading', level: 3 });
    await expect(heading).toBeVisible();
    
    const searchButton = page.getByRole('button', { name: 'Search for Heading' });
    const content = page.locator('#text-heading-content');
    
    await expect(content).not.toHaveClass(/show/);
    await searchButton.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find multiple buttons using text content', async ({ page }) => {
    const exactButton = page.getByText('Exact Text Button', { exact: true });
    const partialButton = page.getByRole('button', { name: /Partial Text/ });
    
    await expect(exactButton).toBeVisible();
    await expect(partialButton).toBeVisible();
  });

  test('should verify page structure with text selectors', async ({ page }) => {
    await expect(page).toHaveTitle('Text-Based Selectors Examples');
    
    const pageHeading = page.getByRole('heading', { name: /Text-Based Selectors Examples/, level: 1 });
    await expect(pageHeading).toBeVisible();
    
    const sectionHeading = page.getByRole('heading', { name: 'Text Matching Selector Techniques' });
    await expect(sectionHeading).toBeVisible();
  });
});

test.describe('Locator Examples - XPath Selectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xpath-selectors.html');
  });

  test('should find element using XPath by text', async ({ page }) => {
    const button = page.locator('xpath=//button[text()="Find By Text"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('xpath-button');
    
    const content = page.locator('#xpath-text-content');
    await expect(content).not.toHaveClass(/show/);
    
    await button.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element using XPath by attribute', async ({ page }) => {
    const input = page.locator('xpath=//input[@data-xpath-attr="test-value"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'XPath Attr Input');
    
    const verifyButton = page.getByRole('button', { name: 'Verify Input' });
    const content = page.locator('#xpath-attr-content');
    
    await expect(content).not.toHaveClass(/show/);
    await verifyButton.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element using XPath by position', async ({ page }) => {
    // Find the third button in the element-card using XPath position
    const thirdButton = page.locator('xpath=(//div[@class="element-card"][3]//button)[3]');
    await expect(thirdButton).toBeVisible();
    await expect(thirdButton).toHaveAttribute('id', 'button-position-3');
    await expect(thirdButton).toHaveText('Button 3');
    
    const showButton = page.getByRole('button', { name: 'Show Position 3' });
    const content = page.locator('#xpath-position-content');
    
    await expect(content).not.toHaveClass(/show/);
    await showButton.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should find element using complex XPath', async ({ page }) => {
    const level1Span = page.locator('xpath=//div[@class="complex-xpath-container"]/span[@data-level="1"]');
    const level2Span = page.locator('xpath=//div[@class="complex-xpath-container"]/span[@data-level="2"]');
    
    await expect(level1Span).toBeVisible();
    await expect(level1Span).toHaveText('Level 1');
    await expect(level2Span).toBeVisible();
    await expect(level2Span).toHaveText('Level 2');
    
    const complexButton = page.getByRole('button', { name: 'Find Complex' });
    const content = page.locator('#xpath-complex-content');
    
    await expect(content).not.toHaveClass(/show/);
    await complexButton.click();
    await expect(content).toHaveClass(/show/);
  });

  test('should combine XPath with Playwright locators', async ({ page }) => {
    // Using XPath for complex navigation
    const elementsGrid = page.locator('xpath=//div[@class="elements-grid"]');
    await expect(elementsGrid).toBeVisible();
    
    // Count all element cards using XPath
    const elementCards = page.locator('xpath=//div[@class="element-card"]');
    await expect(elementCards).toHaveCount(4);
  });

  test('should find elements using XPath contains function', async ({ page }) => {
    const buttonWithPartialClass = page.locator('xpath=//button[contains(@class, "xpath-button")]');
    await expect(buttonWithPartialClass).toBeVisible();
    
    const inputWithPartialPlaceholder = page.locator('xpath=//input[contains(@placeholder, "XPath")]');
    await expect(inputWithPartialPlaceholder).toBeVisible();
  });

  test('should verify page structure using XPath', async ({ page }) => {
    await expect(page).toHaveTitle('XPath Selectors Examples');
    
    const header = page.locator('xpath=//h1[contains(text(), "XPath Selectors Examples")]');
    await expect(header).toBeVisible();
    
    const backLink = page.locator('xpath=//a[@class="primary-link" and contains(text(), "Back to Dashboard")]');
    await expect(backLink).toBeVisible();
  });
});

test.describe('Locator Examples - Cross-Page Navigation', () => {
  test('should navigate between locator example pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Navigate to CSS selectors
    await page.getByRole('link', { name: 'View CSS Examples →' }).click();
    await expect(page).toHaveURL('/css-selectors.html');
    await expect(page.locator('h1')).toContainText('CSS Selectors Examples');
    
    // Go back and navigate to Role selectors
    await page.getByRole('link', { name: '← Back to Dashboard' }).click();
    await expect(page).toHaveURL('/');
    
    await page.getByRole('link', { name: 'View Role Examples →' }).click();
    await expect(page).toHaveURL('/role-selectors.html');
    await expect(page.locator('h1')).toContainText('Role-Based Selectors Examples');
    
    // Go back and navigate to Text selectors
    await page.getByRole('link', { name: '← Back to Dashboard' }).click();
    await page.getByRole('link', { name: 'View Text Examples →' }).click();
    await expect(page).toHaveURL('/text-selectors.html');
    await expect(page.locator('h1')).toContainText('Text-Based Selectors Examples');
    
    // Go back and navigate to XPath selectors
    await page.getByRole('link', { name: '← Back to Dashboard' }).click();
    await page.getByRole('link', { name: 'View XPath Examples →' }).click();
    await expect(page).toHaveURL('/xpath-selectors.html');
    await expect(page.locator('h1')).toContainText('XPath Selectors Examples');
  });
});
