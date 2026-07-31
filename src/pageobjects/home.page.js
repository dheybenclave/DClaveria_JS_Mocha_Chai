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
    return $('//div[@aria-label="Trip type"]/ancestor::div[contains(@class,"J_T2-field-group")]')
  }

  get searchButton() {
    return $('button[aria-label="Search"]');
  }

  get searchResultSection() {
    return $('div[id="flight-results-list-wrapper"]');
  }

  get searchResultsContainer() {
    return $$('div[class="Fxw9-result-item-container"]')
  }

  get compareInputCheckButton() {
    return $("//input[contains(@id,'en_AU_FFDCMP2')]/parent::span")
  }

  get closeDialogButton() {
    return $(`//div[@role="dialog"]//span[contains(@class,'BLL2-close')]`)
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

    this.waitForElementVisible(this.logo);
    return isHome;
  }

  /**
   * 
   * @param {Promise<WebdriverIO.Element>} element 
   * @param {string} value 
   */
  async selectLocationGroup(element, value, isNegativeTest = false) {
    logger.info(`Select Location Group : ${value}`);

    let el = await this.getElement(element);
    let parent = await el.parentElement();

    await this.clickElement(el);
    await this.clickElementIfExist(el);

    await this.waitForIntSecond(2);

    let removeButton = await parent.$('.//div[@class="c_neb-item-close"]');

    while (await removeButton.isDisplayed()) {

      logger.info(`Removing Current Value in  ${this.getSelectorName(removeButton)}`);
      await browser.keys([Key.Backspace]);
      await browser.pause(500);

      removeButton = await parent.$('.//div[@class="c_neb-item-close"]');
    }

    if (!isNegativeTest) {
      await this.enterText(element, value);
    }
    else {
      await el.setValue(value);
      await this.waitForLoadingToFinish();
      await this.waitForIntSecond(2);
      await this.verifyContainsText("No matching locations found");
    }
    await this.waitForPageLoad();

    if (!isNegativeTest) {
      el = await this.getElement(element);
      let actualText = await this.getElementTextValue(parent.$('.//div[@class="c_neb-item-value"]'), value);
      expect(actualText, `Expected text to include "${value}"`).to.include(value);
    }

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
  async searchFlights(from, to, departureDate, returnDate, trip_type = null) {
    logger.info(`Searching flights: ${from} -> ${to}, Departure: ${departureDate}, Return: ${returnDate}, Trip Type: ${JSON.stringify(trip_type)}`);

    await this.selectLocationGroup(this.fromCityInput, from);

    await this.selectLocationGroup(this.toCityInput, to);

    await this.selectDateFromDialog(this.departureDateButton, departureDate);

    await this.selectDateFromDialog(this.returnDateButton, returnDate);

    if (trip_type !== null) {
      await this.selectTripType(trip_type);
    }
    await this.waitForIntSecond(2);
    await this.clickElementIfExist(this.compareInputCheckButton);

    await this.clickElement(this.searchButton);

  }

  /**
   * Waits until search results are visible and no longer loading.
   * @param {number} [timeout=60000] - Maximum wait time in milliseconds.
   */
  async waitForSearchResults(timeout = 60000) {
    logger.info(`Waiting for search results (timeout: ${timeout}ms)`);

    const homeUrl = await browser.getUrl();
    const urlChanged = await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();
        return currentUrl !== homeUrl && currentUrl.includes('/flight-search');
      },
      {
        timeout: Math.min(timeout, 30000),
        timeoutMsg: 'URL did not change after search submission'
      }
    ).catch(() => false);

    if (!urlChanged) {
      logger.info('URL did not change, checking for results section as fallback');
      await this.searchResultSection.waitForDisplayed({ timeout: Math.min(timeout, 30000) });
    }

    await this.waitForPageLoad();

  }

  /**
   * Checks whether search results are currently displayed.
   * @param {string} [from] - Departure city with airport code, e.g. "Boracay, Philippines (MPH)"
   * @param {string} [to] - Destination city with airport code, e.g. "Kalibo, Philippines (KLO)"
   * @param {string} [departureDate] - Departure date string, e.g. "2026-10-04"
   * @param {string} [returnDate] - Return date string, e.g. "2026-12-10"
   * @returns {Promise<boolean>} True if results are visible and count is greater than zero.
   */
  async hasSearchResults(from, to, departureDate, returnDate) {
    logger.info('Checking if search results exist');

    await this.waitForPageLoad();

    let getCurrURL = await browser.getUrl();
    logger.info(getCurrURL);


    let fromCode = from.match(/\(([A-Z]{3})\)/)?.[1];
    let toCode = to.match(/\(([A-Z]{3})\)/)?.[1];

    const urlParameters = [`${fromCode}-${toCode}`, departureDate, returnDate, 'flight-search'];

    urlParameters.forEach(param => {
      expect(getCurrURL, `Assertion Failed: Flight search URL does not contain "${param}" | Actual : ${getCurrURL}`).to.include(param);
    });

    await this.waitForElementVisible(this.searchResultSection);

    await this.waitForElementVisible(this.searchResultsContainer);

    const hasResults = await this.searchResultsContainer.length > 0;
    expect(hasResults, 'Should have search results').to.be.true;

    return hasResults;
  }
  /**
   * Retrieves structured data from the current search results.
   * @returns {Promise<Array<{price: string|null, airline: string|null, duration: string|null}>>} Array of result objects.
   */
  async getSearchResults() {

    logger.info('Fetching search results');
    await this.waitForSearchResults();

    const results = await $$('[class*="nrc6-inner"], [data-testid="flight-result"], .flight-result');
    expect(results.length, 'Should have search results').to.be.greaterThan(0);
    const resultsData = [];

    for (const result of results) {
      const price = await result.$('div[class="nrc6-price-section"]').getText();
      const airline = await result.$('div[class="nrc6-content-section"] div[class="J0g6-operator-text"]').getText();

      resultsData.push({
        price: price ? price.trim() : null,
        airline: airline ? airline.trim() : null,
      });
    }

    logger.info(`Found ${results.length} search results`);
    return resultsData;
  }
  /**
   * Selects trip type configuration including cabin class and passenger counts.
   * @param {Object} trip_type - Trip type configuration object.
   * @param {string} [trip_type.cabin_class] - Cabin class to select.
   * @param {number} [trip_type.adults=1] - Number of adult passengers.
   * @param {number} [trip_type.children=0] - Number of child passengers.
   * @param {number} [trip_type.infants_on_lap=0] - Number of infants on lap.
   */
  async selectTripType(trip_type) {
    logger.info(`Selecting trip type configuration: ${JSON.stringify(trip_type)}`);

    if (trip_type && typeof trip_type === 'object') {
      const { adults = 1, children = 0, infants_on_lap = 0, cabin_class } = trip_type;

      if (cabin_class) {
        const cabinOption = await this.getTextElement(cabin_class, "//div[contains(text(),'Cabin class')]//parent::*");
        await this.waitForElementVisible(cabinOption, 10000);
        await this.clickElement(cabinOption);
      }

      await this.selectPassengerCount('Adults', Math.max(adults, 1));
      await this.selectPassengerCount('Children', children);
      await this.selectPassengerCount('Infants on lap', infants_on_lap);
    }

    logger.info('Trip type selection completed');

    await browser.keys([Key.Escape]);
    await browser.pause(1000);

    await this.waitForIntSecond(2);
  }

  /**
   * Adjusts passenger count using increment/decrement controls.
   * @param {string} passengerType - Passenger type label text (e.g. "Adult", "Child", "Infant").
   * @param {number} count - Target passenger count.
   */
  async selectPassengerCount(passengerType, count) {
    logger.info(`Setting ${passengerType} count to ${count}`);

    const passengerLabel = await this.getTextElement(passengerType);
    const parent = await passengerLabel.parentElement();

    const incrementBtn = await parent.$('button[aria-label="Increment"]');
    const decrementBtn = await parent.$('button[aria-label="Decrement"]');

    if (!incrementBtn || !decrementBtn) {
      logger.info(`Passenger controls not found for ${passengerType}`);

      return;
    }

    let current = 1;

    while (current > count && await decrementBtn.isClickable()) {
      await decrementBtn.click();
      current--;
    }

    while (current < count && await incrementBtn.isClickable()) {
      await incrementBtn.click();
      current++;
    }
  }


}