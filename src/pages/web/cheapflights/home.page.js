import { expect } from 'chai';
import logger from '../../../utils/logger.js';
import BasePage from '../base.page.js';

export default class HomePage extends BasePage {

  get logoImage() {
    return $('div.mc6t-logo');
  }

  get loginButton() {
    return $('a[href*="login"]');
  }

  get searchButton() {
    return $('button[aria-label="Search"]');
  }
  get carButton() {
    return $('a[aria-label="Search for cars"]');
  }

  get stayButton() {
    return $('a[aria-label="Search for stays"]');
  }

  get flightsButton() {
    return $('a[aria-label="Search for flights"]');
  }

  get signButton() {
    return $('div[aria-label="Sign in"][role="button"]');
  }

  get loginDialog() {
    return $('div[role="dialog"] div[class*="unified-login"]');
  }


  async isTextDisplayed(textName) {
    logger.info(`Checking if text is displayed: ${textName}`);
    const element = await this.getTextElement(textName.trim());
    await element.waitForDisplayed({ timeout: 10000 });
    return await element.isDisplayed();
  }
  async clickCarButton() {
    logger.info('Clicking car button');
    await this.clickElement(this.carButton);
  }

  async clickStayButton() {
    logger.info('Clicking stay button');
    await this.clickElement(this.stayButton);
  }

  async clickFlightsButton() {
    logger.info('Clicking flights button');
    await this.clickElement(this.flightsButton);
  }

  async clickSearchButton() {
    logger.info('Clicking search button');
    await this.clickElement(this.searchButton);
  }

  async clickLoginButton() {
    logger.info('Clicking login button');
    await this.clickElement(this.loginButton);
  }

  async isLogoDisplayed() {
    logger.info('Checking if logo is displayed');
    await this.logoImage.waitForDisplayed({ timeout: 15000 });
    const displayed = await this.logo.isDisplayed();
    expect(displayed, 'Logo should be displayed').to.be.true;
    return displayed;
  }

  async isLoginButtonDisplayed() {
    logger.info('Checking if login button is displayed');
    const displayed = await this.loginButton.isDisplayed();
    expect(displayed, 'Login button should be displayed').to.be.true;
    return displayed;
  }

  async isOnHomePage() {
    logger.info('Verifying we are on home page');
    const url = await browser.getUrl();
    const isHome = url.includes('cheapflights.com.au');
    expect(isHome, `Expected to be on cheapflights.com.au, but got ${url}`).to.be.true;
    return isHome;
  }
}
