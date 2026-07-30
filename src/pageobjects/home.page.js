import { expect } from 'chai';
import { Key } from 'webdriverio';
import logger from '../utils/logger.js';
import { formatDate } from '../utils/utils.js';
import BasePage from './base.page.js';
/**
 * Page object for the Cheapflights home page.
 * Provides locators and actions for top-level navigation and page validation.
 */
export default class HomePage extends BasePage {

  get logoImage() {
    return $('div.mc6t-logo');
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

  get fromCityInput() {
    return $('//input[@data-test-origin]');
  }

  get toCityInput() {
    return $('//input[@data-test-destination]');
  }

  get departureDateButton() {
    return $('div[aria-label="Departure date"][role="button"]');
  }

  get returnDateButton() {
    return $('div[aria-label="Return date"][role="button"]');
  }

  getDatePicker(date) {
    return $(`//table//following::td/div[contains(@aria-label,"${date}")]`)
  }

  getHeaderMonth(date) {
    return $(`//caption[contains(@class,'w0lb-month-name') and text()='${date}']`)
  }

  get removeButton() {
    return $(`div[aria-label="Remove value"]`)
  }

  get nextMonthButton() {
    return $(`div[aria-label="Next month"]`)
  }

  get tripTypeButton() {
    return $('div[aria-label="Trip type"]')
  }

  get searchButton() {
    return $('[data-testid="search-button"], button[type="submit"], .search-button');
  }

  get searchResultsContainer() {
    return $('div[id="flight-results-list-wrapper"]');
  }

  get firstSearchResult() {
    return $('[data-testid="flight-result"]:first-child, .flight-result:first-child');
  }

  get loader() {
    return $('.loading, .spinner, [data-testid="loading"]');
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

  /**
   * 
   * @param {Promise<WebdriverIO.Element>} element 
   * @param {string} value 
   */
  async selectLocationGroup(element, value) {
    logger.info(`Select Location Group : ${value}`);

    let el = await this.getElement(element);
    let parent = await el.parentElement();

    await this.clickElement(el);
    await this.waitForIntSecond(2);

    let removeButton = await parent.$('.//div[@aria-label="Remove value"]');

    while (await removeButton.isDisplayed()) {
      logger.info(`Removing Current Value in  ${this.getSelectorName(removeButton)}`);
      await browser.keys([Key.Backspace]);
      await browser.pause(500);

      removeButton = await parent.$('.//div[@aria-label="Remove value"]');
    }

    await this.enterText(element, value);
    await this.waitForPageLoad();

    el = await this.getElement(element);
    let actualText = await this.getElementTextValue(parent.$('.//div[@class="c_neb-item-value"]'), value);
    expect(actualText, `Expected text to include "${value}"`).to.include(value);

  }

  /**
   * 
   * @param {Promise<WebdriverIO.Element>} element 
   * @param {string} date 
   */

  async selectDateFromDialog(element, date) {
    logger.info(`Select Date from Dialog : ${date}`);
    let el = await this.getElement(element);

    await this.waitForElementVisible(el);
    await this.clickElement(el);

    let counter = 0;
    const maxMonthsToScroll = 24;

    while (counter < maxMonthsToScroll) {

      let monthHeader = await this.getHeaderMonth(formatDate(date, "MMMM YYYY"));

      if (await monthHeader.isDisplayed()) {
        logger.info(`Successfully navigated to target month: ${formatDate(date, "MMMM YYYY")}`);
        break;
      }

      logger.info(`Target month not visible. Clicking next month button (Attempt ${counter + 1})`);
      await this.clickElement(this.nextMonthButton);
      await browser.pause(500);

      counter++;
    }

    await this.clickElement(this.getDatePicker(formatDate(date)));
  }

  /**
  * Enters flight search criteria and submits the search.
  * @param {string} from - Departure city.
  * @param {string} to - Destination city.
  * @param {string} departureDate - Departure date string.
  * @param {string} returnDate - Return date string.
  * @param {number} [adults=1] - Number of adult passengers.
  */
  async searchFlights(from, to, departureDate, returnDate, adults = 1) {
    logger.info(`Searching flights: ${from} -> ${to}, Departure: ${departureDate}, Return: ${returnDate}, Adults: ${adults}`);

    await this.selectLocationGroup(this.fromCityInput, from);

    await this.selectLocationGroup(this.toCityInput, to);

    await this.selectDateFromDialog(this.departureDateButton, departureDate);

    await this.selectDateFromDialog(this.returnDateButton, returnDate);

    logger.info('Clicking search button');
    await this.waitForElementClickable(this.searchButton, 30000);
    await this.searchButton.click();

    await this.waitForPageLoad();

    await this.waitForSearchResults();

  }

  /**
   * Waits until search results are visible and no longer loading.
   * @param {number} [timeout=60000] - Maximum wait time in milliseconds.
   */
  async waitForSearchResults(timeout = 60000) {
    logger.info(`Waiting for search results (timeout: ${timeout}ms)`);

    const homeUrl = await browser.getUrl();

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();
        return !currentUrl.includes('/?') || currentUrl !== homeUrl;
      },
      {
        timeout: Math.min(timeout, 30000),
        timeoutMsg: 'URL did not change after search submission'
      }
    );

    await this.waitForPageLoad();

  }

  /**
   * Checks whether search results are currently displayed.
   * @returns {Promise<boolean>} True if results are visible and count is greater than zero.
   */
  async hasSearchResults(from, to, departureDate, returnDate) {

    logger.info(`Assert All Search Flights: ${from} -> ${to}, Departure: ${departureDate}, Return: ${returnDate}`);

    await this.waitForPageLoad();

    let getCurrURL = await browser.getUrl();

    logger.info(getCurrURL);

    let fromCode = from.match(/\(([A-Z]{3})\)/)?.[1];
    let toCode = to.match(/\(([A-Z]{3})\)/)?.[1]

    const urlParameters = [`${fromCode}-${toCode}`, departureDate, returnDate, "flight-search"];

    urlParameters.forEach(param => {
      expect(getCurrURL, `Assertion Failed: Flight search URL does not contain "${param}" | Actual : ${getCurrURL}`).to.include(param);
    });

    await this.waitForElementVisible(this.searchResultsContainer);

    await this.waitForPageLoad();

    await this.verifyContainsText("Prices are expected to rise ");
    return hasResults;
  }
  /**
   * Retrieves structured data from the current search results.
   * @returns {Promise<Array<{price: string|null, airline: string|null, duration: string|null}>>} Array of result objects.
   */
  async getSearchResults() {
    logger.info('Fetching search results');
    await this.waitForSearchResults();
    const results = await $$('[data-testid="flight-result"], .flight-result');
    expect(results.length, 'Should have search results').to.be.greaterThan(0);
    const resultsData = [];

    for (const result of results) {
      const price = await result.$('.price, [data-testid="price"]').getText();
      const airline = await result.$('.airline, [data-testid="airline"]').getText();
      const duration = await result.$('.duration, [data-testid="duration"]').getText();

      resultsData.push({
        price: price ? price.trim() : null,
        airline: airline ? airline.trim() : null,
        duration: duration ? duration.trim() : null
      });
    }

    logger.pass(`Found ${results.length} search results`);
    return resultsData;
  }


}
