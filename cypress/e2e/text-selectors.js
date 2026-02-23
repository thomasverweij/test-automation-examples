import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common steps used across multiple features
When('the user clicks the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});


Then('the h1 heading should contain text {string}', (text) => {
  cy.get('h1').should('contain.text', text);
});

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
