// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

import { LoginPage } from '../pages/LoginPage';
import { TwoFAPage } from '../pages/TwoFAPage';
import { HomePage } from '../pages/HomePage';

/**
 * Custom command to login with username and password
 * Uses cy.session to cache the login state
 * @example cy.login('testuser', 'password123')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    const loginPage = new LoginPage();
    cy.visit('/login');
    loginPage.login(username, password);
    // Wait for login to complete
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  }, {
    validate() {
      // Verify the session is still valid
      cy.visit('/');
      cy.get('#authUserLabel').should('be.visible');
    }
  });
});

/**
 * Custom command to complete 2FA login flow
 * Uses cy.session to cache the login state
 * @example cy.loginWith2FA('user1', 'pass1')
 */
Cypress.Commands.add('loginWith2FA', (username, password) => {
  cy.session([username, password, '2fa'], () => {
    const loginPage = new LoginPage();
    const twoFAPage = new TwoFAPage();
    
    cy.visit('/login');
    loginPage.login(username, password);
    
    cy.url().should('include', '/2fa');
    
    const secret = Cypress.env('TWO_FA_SECRET');
    cy.task('generateTOTP', secret).then((twoFACode) => {
      twoFAPage.verifyCode(twoFACode);
    });
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  }, {
    validate() {
      // Verify the session is still valid
      cy.visit('/');
      cy.get('#authUserLabel').should('be.visible');
    }
  });
});

/**
 * Custom command to verify user is logged in
 * @example cy.verifyLoggedIn('User One')
 */
Cypress.Commands.add('verifyLoggedIn', (userName) => {
  const homePage = new HomePage();
  homePage.authUserLabel.should('be.visible');
  homePage.authUserLabel.should('contain.text', userName);
  homePage.logoutButton.should('be.visible');
});

/**
 * Custom command to wait for element to be visible
 * @example cy.waitForVisible('#my-element')
 */
Cypress.Commands.add('waitForVisible', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Custom command to wait for element to disappear
 * @example cy.waitForNotVisible('#loading')
 */
Cypress.Commands.add('waitForNotVisible', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('not.be.visible');
});

/**
 * Custom command to check if element has class
 * @example cy.get('#element').shouldHaveClass('active')
 */
Cypress.Commands.add('shouldHaveClass', { prevSubject: true }, (subject, className) => {
  cy.wrap(subject).should('have.class', className);
});

/**
 * Custom command to check if element does not have class
 * @example cy.get('#element').shouldNotHaveClass('active')
 */
Cypress.Commands.add('shouldNotHaveClass', { prevSubject: true }, (subject, className) => {
  cy.wrap(subject).should('not.have.class', className);
});

/**
 * Custom command to get element by data-testid
 * @example cy.getByTestId('submit-button')
 */
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

/**
 * Custom command to load test data from fixture
 * @example cy.loadTestData('dev').then((data) => { ... })
 */
Cypress.Commands.add('loadTestData', (environment = 'dev') => {
  return cy.fixture(`${environment}/data.json`);
});
