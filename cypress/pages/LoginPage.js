export class LoginPage {
  // Locators
  get usernameInput() {
    return cy.get('#username');
  }

  get passwordInput() {
    return cy.get('#password');
  }

  get submitButton() {
    return cy.get('button[type="submit"]');
  }

  get errorMessage() {
    return cy.get('#errorMessage');
  }

  get loading() {
    return cy.get('#loading');
  }

  // Actions
  visit() {
    cy.visit('/login');
  }

  login(username, password) {
    this.usernameInput.type(username);
    this.passwordInput.type(password);
    this.submitButton.click();
  }

  getErrorMessage() {
    return this.errorMessage.invoke('text');
  }

  isErrorVisible() {
    return this.errorMessage.should('be.visible');
  }
}
