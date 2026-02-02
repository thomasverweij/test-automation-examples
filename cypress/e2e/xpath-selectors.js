import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common steps used across multiple features
When('the user clicks the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

// CSS Selectors
Given('the user is on the CSS selectors page', () => {
  cy.visit('/css-selectors.html');
});

When('the user clicks the button with ID {string}', (id) => {
  cy.get(`#${id}`).click();
});

Then('the button should have text {string}', (text) => {
  cy.contains('button', text).should('be.visible');
});

Then('the content with ID {string} should have class {string}', (id, className) => {
  cy.get(`#${id}`).should('have.class', className);
});

When('the user clicks the button with class {string}', (className) => {
  cy.get(`.${className}`).click();
});

When('the user clicks the button with data-testid {string}', (testId) => {
  cy.get(`[data-testid="${testId}"]`).click();
});

Then('the nested span should be visible', () => {
  cy.get('.css-parent > #css-nested-span').should('be.visible');
});

Then('the nested span should have text {string}', (text) => {
  cy.get('.css-parent > #css-nested-span').should('have.text', text);
});

Then('the page title should be {string}', (title) => {
  cy.title().should('eq', title);
});

Then('the h1 header should contain text {string}', (text) => {
  cy.get('h1').should('contain.text', text);
});

// Role-based Selectors
Given('the user is on the role selectors page', () => {
  cy.visit('/role-selectors.html');
});

When('the user clicks the button with role {string} and name {string}', (role, name) => {
  cy.contains('button', name).click();
});

When('the user clicks the link with role {string} and name {string}', (role, name) => {
  cy.contains('a', name).click();
});

When('the user clicks the textbox with placeholder {string}', (placeholder) => {
  cy.get(`input[placeholder="${placeholder}"]`).click();
});

Given('the checkbox should not be checked', () => {
  cy.get('input[type="checkbox"]').should('not.be.checked');
});

When('the user checks the checkbox', () => {
  cy.get('input[type="checkbox"]').check();
});

Then('the checkbox should be checked', () => {
  cy.get('input[type="checkbox"]').should('be.checked');
});

Given('the combobox should have attribute {string} with value {string}', (attr, value) => {
  cy.get('select[role="combobox"]').should('have.attr', attr, value);
});

When('the user selects {string} from the combobox', (option) => {
  cy.get('select[role="combobox"]').select(option);
});

Then('the combobox should have attribute {string} with value {string}', (attr, value) => {
  cy.get('select[role="combobox"]').should('have.attr', attr, value);
});

Then('the heading should contain text {string}', (text) => {
  cy.get('h1').should('contain.text', text);
});

Then('the back link should be visible', () => {
  cy.contains('a', '← Back to Dashboard').should('be.visible');
});

Then('the back link should have href {string}', (href) => {
  cy.contains('a', '← Back to Dashboard').should('have.attr', 'href', href);
});

// Text-based Selectors
Given('the user is on the text selectors page', () => {
  cy.visit('/text-selectors.html');
});

When('the user clicks the button with exact text {string}', (text) => {
  cy.contains('button', new RegExp(`^${text}$`)).click();
});

When('the user clicks the button containing text {string}', (text) => {
  cy.contains('button', text).click();
});

Then('the button should have full text {string}', (text) => {
  cy.contains('button', text).should('have.text', text);
});

When('the user clicks the input with label {string}', (labelText) => {
  cy.contains('label', labelText).parent().find('input').click();
});

Then('the input should have ID {string}', (id) => {
  cy.get(`#${id}`).should('exist');
});

Then('the h3 heading {string} should be visible', (text) => {
  cy.get('h3').contains(text).should('be.visible');
});

Then('the button with exact text {string} should be visible', (text) => {
  cy.contains('button', new RegExp(`^${text}$`)).should('be.visible');
});

Then('the button containing text {string} should be visible', (text) => {
  cy.contains('button', text).should('be.visible');
});

Then('the section heading {string} should be visible', (text) => {
  cy.get('h2').contains(text).should('be.visible');
});

// XPath Selectors
Given('the user is on the XPath selectors page', () => {
  cy.visit('/xpath-selectors.html');
});

When('the user clicks the button found by XPath {string}', (xpath) => {
  cy.xpath(xpath).click();
});

Then('the button should have class {string}', (className) => {
  cy.get(`.${className}`).should('exist');
});

Then('the input found by XPath {string} should be visible', (xpath) => {
  cy.xpath(xpath).should('be.visible');
});

Then('the input should have placeholder {string}', (placeholder) => {
  cy.get(`input[placeholder="${placeholder}"]`).should('exist');
});

Then('the button found by XPath {string} should be visible', (xpath) => {
  cy.xpath(xpath).should('be.visible');
});

Then('the button should have ID {string}', (id) => {
  cy.get(`#${id}`).should('exist');
});

Then('the span found by XPath {string} should have text {string}', (xpath, text) => {
  cy.xpath(xpath).should('have.text', text);
});

Then('the elements grid found by XPath {string} should be visible', (xpath) => {
  cy.xpath(xpath).should('be.visible');
});

Then('there should be {int} element cards found by XPath {string}', (count, xpath) => {
  cy.xpath(xpath).should('have.length', count);
});

Then('the header found by XPath {string} should be visible', (xpath) => {
  cy.xpath(xpath).should('be.visible');
});

Then('the back link found by XPath {string} should be visible', (xpath) => {
  cy.xpath(xpath).should('be.visible');
});

// Navigation
Given('the user is on the home page', () => {
  cy.visit('/');
});

When('the user clicks the link {string}', (linkText) => {
  cy.contains('a', linkText).click();
});

Then('the user should be on page {string}', (path) => {
  cy.url().should('include', path);
});

When('the user navigates to {string}', (path) => {
  cy.visit(path);
});
