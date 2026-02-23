import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common step
When('the user clicks the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

Given('the user is on the dynamic elements page', () => {
  cy.visit('/dynamic-elements.html');
});

Then('the delayed element should be visible', () => {
  cy.get('#delayed-element').should('be.visible');
});

Then('the delayed element should contain text {string}', (text) => {
  cy.get('#delayed-element').should('have.text', text);
});

// Combined step - works for both Given and Then
Given(/the state button should have text "(.*)"/, (text) => {
  cy.get('#state-button').should('have.text', text);
});

Given('the state content should not be visible', () => {
  cy.get('#state-content').should('not.be.visible');
});

When('the user clicks the state button', () => {
  cy.get('#state-button').click();
});

Then('the state content should be visible', () => {
  cy.get('#state-content').should('be.visible');
});

Then('the state content should contain text {string}', (text) => {
  cy.get('#state-content').should('have.text', text);
});

Given('the dynamic button should be disabled', () => {
  cy.get('#dynamic-button').should('be.disabled');
});

Given('the dynamic button should have text {string}', (text) => {
  cy.get('#dynamic-button').should('have.text', text);
});

// Combined step - works for both Given and Then
Given(/the button content should( not)? be visible/, (not) => {
  if (not) {
    cy.get('#dynamic-button-content').should('not.be.visible');
  } else {
    cy.get('#dynamic-button-content').should('be.visible');
  }
});

When('the user types {string} in the dynamic input field', (text) => {
  cy.get('#dynamic-input').type(text);
});

Then('the dynamic button should be enabled', () => {
  cy.get('#dynamic-button').should('be.enabled');
});

Then('the button content should contain text {string}', (text) => {
  cy.get('#dynamic-button-content').should('have.text', text);
});

When('the user clears the dynamic input field', () => {
  cy.get('#dynamic-input').clear();
});

// Combined step for dynamic list - works for both Given and Then
Given(/the dynamic list should have (\d+) items?/, (count) => {
  cy.get('#dynamic-list li').should('have.length', parseInt(count));
});

Given('the first list item should have text {string}', (text) => {
  cy.get('#dynamic-list li').first().should('have.text', text);
});

Then('the second list item should have text {string}', (text) => {
  cy.get('#dynamic-list li').eq(1).should('have.text', text);
});

Then('the third list item should have text {string}', (text) => {
  cy.get('#dynamic-list li').eq(2).should('have.text', text);
});

// Combined step - works for both Given and Then
Given(/the modal overlay should( not)? be visible/, (not) => {
  if (not) {
    cy.get('#modal-overlay').should('not.be.visible');
  } else {
    cy.get('#modal-overlay').should('be.visible');
  }
});

Then('the modal card should be visible', () => {
  cy.get('.modal-card').should('be.visible');
});

Then('the modal should have title {string}', (title) => {
  cy.get('.modal-card h3').should('have.text', title);
});

Then('the modal should have text {string}', (text) => {
  cy.get('.modal-card p').should('have.text', text);
});

When('the user clicks the modal close button', () => {
  cy.get('.modal-card').contains('button', 'Close').click();
});

When('the user fills both flaky inputs and submits the form', () => {
  cy.intercept('POST', '/api/flaky-input').as('flakyInput');
  cy.get('#flaky-input-1').type('foo').blur();
  cy.wait('@flakyInput');
  cy.get('#flaky-input-2').type('bar').blur();
  cy.wait('@flakyInput');
  cy.get('#flaky-submit').click();
});

Then('the flaky message should be correct', () => {
  cy.get('#flaky-message').should('have.text', 'Submitted: Input 1 = "foo", Input 2 = "bar"');
});
