import BasePage from './base.page.js';
import { logger } from '../utils/logger.js';
import { expect } from 'chai';

/**
 * Page object for the Cheapflights login page.
 * Provides locators and actions for email/password login flows.
 */
export default class LoginPage extends BasePage {
  /**
   * Email input field.
   * @type {WebdriverIO.Element}
   */
  get emailInput() {
    return $('[data-testid="email-input"], input[name="email"], input[type="email"]');
  }

  /**
   * Password input field.
   * @type {WebdriverIO.Element}
   */
  get passwordInput() {
    return $('[data-testid="password-input"], input[name="password"], input[type="password"]');
  }

  /**
   * Login submit button.
   * @type {WebdriverIO.Element}
   */
  get loginButton() {
    return $('[data-testid="login-button"], button[type="submit"], .login-btn');
  }

  /**
   * Error message container displayed after a failed login attempt.
   * @type {WebdriverIO.Element}
   */
  get errorMessage() {
    return $('[data-testid="error-message"], .error-message, .alert-danger');
  }

  /**
   * Forgot password link.
   * @type {WebdriverIO.Element}
   */
  get forgotPasswordLink() {
    return $('[data-testid="forgot-password"], a[href*="forgot"], .forgot-password');
  }

  /**
   * Performs a login with the provided credentials.
   * @param {string} email - User email address.
   * @param {string} password - User password.
   */
  async login(email, password) {
    logger.info(`Logging in with email: ${email}`);
    await this.emailInput.setValue(email);
    expect(await this.emailInput.getValue(), 'Email should be entered').to.equal(email);
    await this.passwordInput.setValue(password);
    expect(await this.passwordInput.getValue(), 'Password should be entered').to.equal(password);
    await this.loginButton.click();
  }

  /**
   * Retrieves the text of the displayed error message.
   * @returns {Promise<string>} Error message text.
   */
  async getErrorMessage() {
    logger.info('Getting error message');
    expect(await this.errorMessage.isDisplayed(), 'Error message should be displayed').to.be.true;
    const text = await this.errorMessage.getText();
    expect(text, 'Error message text should not be empty').to.not.be.empty;
    return text;
  }

  /**
   * Checks whether the login was successful by verifying the URL no longer contains 'login'.
   * @returns {Promise<boolean>} True if login appears successful.
   */
  async isLoginSuccessful() {
    logger.info('Checking if login was successful');
    const url = await browser.getUrl();
    const success = !url.includes('login');
    expect(success, `Expected successful login, but still on login page: ${url}`).to.be.true;
    return success;
  }
}
