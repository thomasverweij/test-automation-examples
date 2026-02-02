export class HomePage {
  // Locators
  get authUserLabel() {
    return cy.get('#authUserLabel');
  }

  get authStatusLabel() {
    return cy.get('#authStatusLabel');
  }

  get logoutButton() {
    return cy.get('#logoutBtn');
  }

  get loginButton() {
    return cy.get('#loginBtn');
  }

  // Actions
  visit() {
    cy.visit('/');
  }

  isLoggedIn() {
    return this.logoutButton.should('be.visible');
  }

  getUserName() {
    return this.authUserLabel.invoke('text');
  }

  getAuthStatus() {
    return this.authStatusLabel.invoke('text');
  }

  logout() {
    this.logoutButton.click();
  }
}
