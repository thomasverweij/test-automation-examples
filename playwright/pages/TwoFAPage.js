export class TwoFAPage {
  constructor(page) {
    this.page = page;
    this.codeInput = page.locator('#code');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('#errorMessage');
    this.loading = page.locator('#loading');
    this.infoBox = page.locator('.info-box');
    this.backLink = page.locator('a.back-link');
  }

  async isOnTwoFAPage() {
    return await this.page.url().includes('/2fa');
  }

  async enterCode(code) {
    await this.codeInput.fill(code);
  }

  async submitCode() {
    await this.submitButton.click();
  }

  async verifyCode(code) {
    await this.enterCode(code);
    await this.submitCode();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }

  async goBackToLogin() {
    await this.backLink.click();
  }
}
