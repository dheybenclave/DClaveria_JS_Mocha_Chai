import BasePage from '../base.page.js';
import { logger } from '../../../utils/logger.js';
import { expect } from 'chai';

export default class LoginPage extends BasePage {
  get emailInput() {
    return $('[data-testid="email-input"], input[name="email"], input[type="email"]');
  }

  get passwordInput() {
    return $('[data-testid="password-input"], input[name="password"], input[type="password"]');
  }

  get loginButton() {
    return $('[data-testid="login-button"], button[type="submit"], .login-btn');
  }

  get errorMessage() {
    return $('[data-testid="error-message"], .error-message, .alert-danger');
  }

  get forgotPasswordLink() {
    return $('[data-testid="forgot-password"], a[href*="forgot"], .forgot-password');
  }

  async login(email, password) {
    logger.info(`Logging in with email: ${email}`);
    await this.emailInput.setValue(email);
    expect(await this.emailInput.getValue(), 'Email should be entered').to.equal(email);
    await this.passwordInput.setValue(password);
    expect(await this.passwordInput.getValue(), 'Password should be entered').to.equal(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    logger.info('Getting error message');
    expect(await this.errorMessage.isDisplayed(), 'Error message should be displayed').to.be.true;
    const text = await this.errorMessage.getText();
    expect(text, 'Error message text should not be empty').to.not.be.empty;
    return text;
  }

  async isLoginSuccessful() {
    logger.info('Checking if login was successful');
    const url = await browser.getUrl();
    const success = !url.includes('login');
    expect(success, `Expected successful login, but still on login page: ${url}`).to.be.true;
    return success;
  }
}
