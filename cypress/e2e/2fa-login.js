import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage } from '../pages/LoginPage';
import { TwoFAPage } from '../pages/TwoFAPage';
import { HomePage } from '../pages/HomePage';

const loginPage = new LoginPage();
const twoFAPage = new TwoFAPage();
const homePage = new HomePage();

// Background steps
Given('the user is on the login page', () => {
  loginPage.visit();
});

// Login steps
When('the user logs in with user1 credentials', () => {
  const username = Cypress.env('TEST_USER1_USERNAME');
  const password = Cypress.env('TEST_USER1_PASSWORD');
  loginPage.login(username, password);
});

When('the user logs in with user2 credentials', () => {
  const username = Cypress.env('TEST_USER2_USERNAME');
  const password = Cypress.env('TEST_USER2_PASSWORD');
  loginPage.login(username, password);
});

// 2FA page steps
Then('the user should be redirected to the 2FA page', () => {
  cy.url().should('include', '/2fa');
});

Then('the 2FA code input should be visible', () => {
  twoFAPage.codeInput.should('be.visible');
});

When('the user enters a valid 2FA code', () => {
  const secret = Cypress.env('TWO_FA_SECRET');
  cy.task('generateTOTP', secret).then((twoFACode) => {
    twoFAPage.enterCode(twoFACode);
  });
});

When('the user submits the 2FA form', () => {
  twoFAPage.submitCode();
});

When('the user enters {string} in the 2FA code field', (code) => {
  twoFAPage.codeInput.clear();
  twoFAPage.codeInput.type(code);
});

When('the user enters an invalid 2FA code {string}', (code) => {
  twoFAPage.verifyCode(code);
});

Then('the 2FA code input should contain {string}', (expectedValue) => {
  twoFAPage.codeInput.should('have.value', expectedValue);
});

Then('the 2FA code input should have pattern attribute {string}', (pattern) => {
  twoFAPage.codeInput.should('have.attr', 'pattern', pattern);
});

Then('the 2FA code input should only contain numeric characters', () => {
  twoFAPage.codeInput.invoke('val').should('match', /^\d*$/);
});

Then('the 2FA code input length should be at most {int} characters', (maxLength) => {
  twoFAPage.codeInput.invoke('val').then((value) => {
    expect(value.length).to.be.at.most(maxLength);
  });
});

Then('an error message should be displayed containing {string}', (errorText) => {
  twoFAPage.errorMessage.should('be.visible');
  twoFAPage.errorMessage.should('contain.text', errorText);
});

Then('the 2FA code input should be empty and focused', () => {
  twoFAPage.codeInput.should('have.value', '');
  twoFAPage.codeInput.should('be.focused');
});

When('the user clicks the back to login link', () => {
  twoFAPage.goBackToLogin();
});

Then('the user should be on the login page', () => {
  cy.url().should('match', /\/login/);
  loginPage.usernameInput.should('be.visible');
});

Then('the info box should be visible with text {string}', (text) => {
  twoFAPage.infoBox.should('be.visible');
  twoFAPage.infoBox.should('contain.text', text);
});

When('the user navigates directly to the 2FA page', () => {
  cy.visit('/2fa');
});

Then('the user should be redirected to the login page', () => {
  cy.url().should('match', /\/login/);
  loginPage.usernameInput.should('be.visible');
});

// Home page steps
Then('the user should be redirected to the home page', () => {
  cy.url().should('equal', Cypress.config().baseUrl + '/');
});

Then('the user should be logged in as {string}', (userName) => {
  homePage.isLoggedIn();
  homePage.authUserLabel.should('contain.text', userName);
});

Then('the auth status should show {string}', (statusText) => {
  homePage.authStatusLabel.should('contain.text', statusText);
});

Then('the user info should be visible with name {string}', (userName) => {
  homePage.authUserLabel.should('be.visible');
  homePage.authUserLabel.should('contain.text', userName);
});

Then('the logout button should be visible', () => {
  homePage.logoutButton.should('be.visible');
});

Then('the login button should be hidden', () => {
  homePage.loginButton.should('have.class', 'hidden');
});
