import BasePage from '../base.page.js';
import { logger } from '../../../utils/logger.js';
import { expect } from 'chai';

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

  async searchFlights(from, to, departureDate, returnDate, adults = 1) {
    logger.step(`Searching flights: ${from} -> ${to}, Departure: ${departureDate}, Return: ${returnDate}, Adults: ${adults}`);
    await this.fromCityInput.setValue(from);
    expect(await this.fromCityInput.getValue(), `From city should be set: ${from}`).to.equal(from);
    await this.toCityInput.setValue(to);
    expect(await this.toCityInput.getValue(), `To city should be set: ${to}`).to.equal(to);
    await this.departureDateInput.setValue(departureDate);
    expect(await this.departureDateInput.getValue(), `Departure date should be set: ${departureDate}`).to.equal(departureDate);
    await this.returnDateInput.setValue(returnDate);
    expect(await this.returnDateInput.getValue(), `Return date should be set: ${returnDate}`).to.equal(returnDate);
    
    for (let i = 1; i < adults; i++) {
      const adultSelector = $('[data-testid="adult-plus"], .adult-selector .plus');
      if (await adultSelector.isDisplayed()) {
        logger.step(`Increasing adult count: ${i + 1}`);
        await adultSelector.click();
      }
    }
    
    logger.step('Clicking search button');
    await this.searchButton.click();
    await this.waitForSearchResults();
    await this.searchResultsContainer.waitForDisplayed({ timeout: 30000 });
  }

  async waitForSearchResults(timeout = 60000) {
    logger.step(`Waiting for search results (timeout: ${timeout}ms)`);
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

  async getSearchResults() {
    logger.step('Fetching search results');
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

  async hasSearchResults() {
    logger.step('Checking if search results exist');
    const isVisible = await this.searchResultsContainer.isDisplayed();
    const count = await $$('[data-testid="flight-result"], .flight-result').length;
    const hasResults = isVisible && count > 0;
    expect(hasResults, 'Should have search results').to.be.true;
    return hasResults;
  }
}
