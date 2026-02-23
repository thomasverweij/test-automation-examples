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
