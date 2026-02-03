import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common steps used across multiple features
When('the user clicks the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
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

Given(/the combobox should have attribute "(.*?)" with value "(.*?)"/, (attr, value) => {
  cy.get('select[role="combobox"]').should('have.attr', attr, value);
});

When('the user selects {string} from the combobox', (option) => {
  cy.get('select[role="combobox"]').select(option);
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
