export class HomePage {
  constructor(page) {
    this.page = page;
    this.authUserLabel = page.locator('#authUserLabel');
    this.authStatusLabel = page.locator('#authStatusLabel');
    this.logoutButton = page.locator('#logoutBtn');
    this.loginButton = page.locator('#loginBtn');
  }

  async goto() {
    await this.page.goto('/');
  }

  async isLoggedIn() {
    return await this.logoutButton.isVisible();
  }

  async getUserName() {
    return await this.authUserLabel.textContent();
  }

  async getAuthStatus() {
    return await this.authStatusLabel.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
