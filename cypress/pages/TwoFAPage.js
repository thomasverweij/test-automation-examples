export class TwoFAPage {
  // Locators
  get codeInput() {
    return cy.get('#code');
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

  get infoBox() {
    return cy.get('.info-box');
  }

  get backLink() {
    return cy.get('a.back-link');
  }

  // Actions
  isOnTwoFAPage() {
    cy.url().should('include', '/2fa');
  }

  enterCode(code) {
    this.codeInput.type(code);
  }

  submitCode() {
    this.submitButton.click();
  }

  verifyCode(code) {
    this.enterCode(code);
    this.submitCode();
  }

  getErrorMessage() {
    return this.errorMessage.invoke('text');
  }

  isErrorVisible() {
    return this.errorMessage.should('be.visible');
  }

  goBackToLogin() {
    this.backLink.click();
  }

  clearCode() {
    this.codeInput.clear();
  }
}
