import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let testData;

Given('the user is on the search page', () => {
  cy.visit('/search.html');
});

Then('the page heading should contain {string}', (text) => {
  cy.get('h1').should('contain.text', text);
});

Then('the search box should be visible', () => {
  cy.get('#searchBox').should('be.visible');
});

When('the user searches for products using test data', () => {
  // Load test data from fixture
  cy.fixture('dev/data.json').then((data) => {
    testData = data;
    cy.get('#searchBox').type(testData.searchTerm);
    cy.wait(500); // Wait for filtering to happen
  });
});

Then('the expected products from test data should be displayed', () => {
  testData.expectedProducts.forEach((productName) => {
    cy.get('.product-card').contains(productName).should('be.visible');
    cy.get('.product-card').contains(productName).parent().parent()
      .find('.product-name').should('contain.text', productName);
  });
});

Then('the results count should show the correct number of products', () => {
  cy.get('#resultsCount').should('be.visible');
  cy.get('#resultsCount').should('contain.text', `Found ${testData.expectedProducts.length} product`);
});

When('the user searches for {string}', (searchTerm) => {
  cy.get('#searchBox').clear().type(searchTerm);
  cy.wait(500);
});

Then('the no results message should be displayed', () => {
  cy.get('.no-results').should('be.visible');
});

Then('the no results message should contain {string}', (text) => {
  cy.get('.no-results').should('contain.text', text);
});

Then('there should be {int} product cards displayed', (count) => {
  cy.get('.product-card').should('have.length', count);
});

Then('the results count should contain {string}', (text) => {
  cy.get('#resultsCount').should('contain.text', text);
});
