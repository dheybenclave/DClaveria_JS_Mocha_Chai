import { expect } from 'chai';
import logger from '../utils/logger.js';
import BasePage from './base.page.js';

/**
 * Page object for the Cheapflights home page.
 * Provides locators and actions for top-level navigation and page validation.
 */
export default class HomePage extends BasePage {
  /**
   * Site logo image/container.
   * @type {WebdriverIO.Element}
   */
  get logoImage() {
    return $('div.mc6t-logo');
  }

  /**
   * Login button/link in the header.
   * @type {WebdriverIO.Element}
   */
  get loginButton() {
    return $('a[href*="login"]');
  }

  /**
   * Global search button.
   * @type {WebdriverIO.Element}
   */
  get searchButton() {
    return $('button[aria-label="Search"]');
  }
  /**
   * Car hire navigation button.
   * @type {WebdriverIO.Element}
   */
  get carButton() {
    return $('a[aria-label="Search for cars"]');
  }

  /**
   * Stays navigation button.
   * @type {WebdriverIO.Element}
   */
  get stayButton() {
    return $('a[aria-label="Search for stays"]');
  }

  /**
   * Flights navigation button.
   * @type {WebdriverIO.Element}
   */
  get flightsButton() {
    return $('a[aria-label="Search for flights"]');
  }

  /**
   * Sign in button in the header.
   * @type {WebdriverIO.Element}
   */
  get signButton() {
    return $('div[aria-label="Sign in"][role="button"]');
  }

  /**
   * Login dialog/modal container.
   * @type {WebdriverIO.Element}
   */
  get loginDialog() {
    return $('div[role="dialog"] div[class*="unified-login"]');
  }

  /**
   * Checks whether a given text is displayed on the page.
   * @param {string} textName - Text to verify.
   * @returns {Promise<boolean>} True if text is visible.
   */
  async isTextDisplayed(textName) {
    logger.info(`Checking if text is displayed: ${textName}`);
    const element = await this.getTextElement(textName.trim());
    await element.waitForDisplayed({ timeout: 10000 });
    return await element.isDisplayed();
  }
  /**
   * Clicks the car hire navigation button.
   */
  async clickCarButton() {
    logger.info('Clicking car button');
    await this.clickElement(this.carButton);
  }

  /**
   * Clicks the stays navigation button.
   */
  async clickStayButton() {
    logger.info('Clicking stay button');
    await this.clickElement(this.stayButton);
  }

  /**
   * Clicks the flights navigation button.
   */
  async clickFlightsButton() {
    logger.info('Clicking flights button');
    await this.clickElement(this.flightsButton);
  }

  /**
   * Clicks the global search button.
   */
  async clickSearchButton() {
    logger.info('Clicking search button');
    await this.clickElement(this.searchButton);
  }

  /**
   * Clicks the login button in the header.
   */
  async clickLoginButton() {
    logger.info('Clicking login button');
    await this.clickElement(this.loginButton);
  }

  /**
   * Verifies the logo is displayed and visible.
   * @returns {Promise<boolean>} True if logo is displayed.
   */
  async isLogoDisplayed() {
    logger.info('Checking if logo is displayed');
    await this.logoImage.waitForDisplayed({ timeout: 15000 });
    const displayed = await this.logo.isDisplayed();
    expect(displayed, 'Logo should be displayed').to.be.true;
    return displayed;
  }

  /**
   * Verifies the login button is displayed.
   * @returns {Promise<boolean>} True if login button is displayed.
   */
  async isLoginButtonDisplayed() {
    logger.info('Checking if login button is displayed');
    const displayed = await this.loginButton.isDisplayed();
    expect(displayed, 'Login button should be displayed').to.be.true;
    return displayed;
  }

  /**
   * Verifies the current URL belongs to the Cheapflights domain.
   * @returns {Promise<boolean>} True if on the home page.
   */
  async isOnHomePage() {
    logger.info('Verifying we are on home page');
    const url = await browser.getUrl();
    const isHome = url.includes('cheapflights.com.au');
    expect(isHome, `Expected to be on cheapflights.com.au, but got ${url}`).to.be.true;
    return isHome;
  }
}
