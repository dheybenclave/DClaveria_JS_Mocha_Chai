import { expect } from 'chai';
import logger from '../utils/logger.js';
import BasePage from './base.page.js';

/**
 * Page object for the Cheapflights flight search page.
 * Provides locators and actions for searching flights and reading results.
 */
export default class FlightSearchPage extends BasePage {

  get fromCityInput() {
    return $('[data-testid="from-input"], input[placeholder*="From"], input[name="from"]');
  }

  get toCityInput() {
    return $('[data-testid="to-input"], input[placeholder*="To"], input[name="to"]');
  }

  get departureDateInput() {
    return $('[data-testid="departure-date"], input[placeholder*="Departure"], input[name="departure"]');
  }

  get returnDateInput() {
    return $('[data-testid="return-date"], input[placeholder*="Return"], input[name="return"]');
  }

  get searchButton() {
    return $('[data-testid="search-button"], button[type="submit"], .search-button');
  }

  get searchResultsContainer() {
    return $('[data-testid="results-container"], .results, .search-results');
  }

  get firstSearchResult() {
    return $('[data-testid="flight-result"]:first-child, .flight-result:first-child');
  }

  get loader() {
    return $('.loading, .spinner, [data-testid="loading"]');
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
    await this.waitForElementClickable(this.fromCityInput, 30000);
    await this.fromCityInput.setValue(from);
    expect(await this.fromCityInput.getValue(), `From city should be set: ${from}`).to.equal(from);
    await this.waitForElementClickable(this.toCityInput, 30000);
    await this.toCityInput.setValue(to);
    expect(await this.toCityInput.getValue(), `To city should be set: ${to}`).to.equal(to);
    await this.waitForElementClickable(this.departureDateInput, 30000);
    await this.departureDateInput.setValue(departureDate);
    expect(await this.departureDateInput.getValue(), `Departure date should be set: ${departureDate}`).to.equal(departureDate);
    await this.waitForElementClickable(this.returnDateInput, 30000);
    await this.returnDateInput.setValue(returnDate);
    expect(await this.returnDateInput.getValue(), `Return date should be set: ${returnDate}`).to.equal(returnDate);

    for (let i = 1; i < adults; i++) {
      const adultSelector = $('[data-testid="adult-plus"], .adult-selector .plus');
      if (await adultSelector.isDisplayed()) {
        logger.info(`Increasing adult count: ${i + 1}`);
        await adultSelector.click();
      }
    }

    logger.info('Clicking search button');
    await this.waitForElementClickable(this.searchButton, 30000);
    await this.searchButton.click();
    await this.waitForSearchResults();
    await this.searchResultsContainer.waitForDisplayed({ timeout: 30000 });
  }

  /**
   * Waits until search results are visible and no longer loading.
   * @param {number} [timeout=60000] - Maximum wait time in milliseconds.
   */
  async waitForSearchResults(timeout = 60000) {
    logger.info(`Waiting for search results (timeout: ${timeout}ms)`);
    await browser.waitUntil(
      async () => {
        const isVisible = await this.searchResultsContainer.isDisplayed();
        const isNotLoading = !(await this.loader.isDisplayed());
        return isVisible && isNotLoading;
      },
      {
        timeout,
        timeoutMsg: 'Search results did not load within expected time'
      }
    );
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

  /**
   * Checks whether search results are currently displayed.
   * @returns {Promise<boolean>} True if results are visible and count is greater than zero.
   */
  async hasSearchResults() {
    logger.info('Checking if search results exist');
    const isVisible = await this.searchResultsContainer.isDisplayed();
    const count = await $$('[data-testid="flight-result"], .flight-result').length;
    const hasResults = isVisible && count > 0;
    expect(hasResults, 'Should have search results').to.be.true;
    return hasResults;
  }
}
