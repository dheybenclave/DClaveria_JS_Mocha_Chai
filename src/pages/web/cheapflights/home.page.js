import BasePage from '../base.page.js';
import logger from '../../../utils/logger.js'; 
import { expect } from 'chai';

export default class HomePage extends BasePage {

  get logo() {
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


  async getTextElement(textName) {
    logger.info(`Finding text element: ${textName}`);
    const xpath = `//*[contains(normalize-space(.), '${textName}')]`;
    const element = await $(xpath);
    expect(await element.isExisting(), `Text element should exist: ${textName}`).to.be.true;
    return element;
  }

  async isTextDisplayed(textName) {
    logger.info(`Checking if text is displayed: ${textName}`);
    const element = await this.getTextElement(textName.trim());
    await element.waitForDisplayed({ timeout: 10000 });
    return await element.isDisplayed();
  }
  async clickCarButton() {
    logger.info('Clicking car button');
    await this.carButton.click();
  }

  async clickStayButton() {
    logger.info('Clicking stay button');
    await this.stayButton.click();
  }

  async clickFlightsButton() {
    logger.info('Clicking flights button');
    await this.flightsButton.click();
  }

  async clickSearchButton() {
    logger.info('Clicking search button');
    await this.searchButton.click();
  }

  async clickLoginButton() {
    logger.info('Clicking login button');
    await this.loginButton.click();
  }

  async isLogoDisplayed() {
    logger.info('Checking if logo is displayed');
    await this.logo.waitForDisplayed({ timeout: 15000 });
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
