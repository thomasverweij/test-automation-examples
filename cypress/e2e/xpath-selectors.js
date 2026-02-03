import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common steps used across multiple features
When('the user clicks the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});


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
