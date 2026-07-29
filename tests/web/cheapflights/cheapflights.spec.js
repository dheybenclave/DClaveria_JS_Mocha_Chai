import { expect } from 'chai';
import HomePage from '../../../src/pages/web/cheapflights/home.page.js';
import LoginPage from '../../../src/pages/web/cheapflights/login.page.js';
import FlightSearchPage from '../../../src/pages/web/cheapflights/search.page.js';
import { DataManager } from '../../../src/utils/data.manager.js';
import logger from '../../../src/utils/logger.js';


describe('@smoke @e2e_1 Cheapflights DClaveria Web UI Automation', () => {
  let homePage;
  let loginPage;
  let searchPage;

  before(() => {
    homePage = new HomePage();
    loginPage = new LoginPage();
    searchPage = new FlightSearchPage();
    logger.info('Test suite initialized');
  });

  beforeEach(async () => {
    logger.info('Navigating to home page');
    await homePage.open();
  });

  afterEach(async () => {
    logger.info('Test completed');
  });

  describe('Logo and Login Button Validation', () => {
    it('@tc_1 should validate logo is displayed on home page', async () => {
      logger.info('TC_1: Validating logo is displayed');
      const isLogoDisplayed = await homePage.isLogoDisplayed();
      expect(isLogoDisplayed).to.be.true;

      await homePage.clickCarButton();
      await homePage.getTextElement('Car hire. ');

      await homePage.clickStayButton();
      await homePage.getTextElement('Where do you want to stay?');
    });
  });

  describe('Flight Search - Positive Tests', () => {
    it('@tc_6 should search for flights with valid parameters', async () => {
      logger.info('TC_6: Searching flights with valid parameters');

      const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

      // Navigate to flights search page first
      await homePage.clickFlightsButton();
      await searchPage.waitForPageLoad();
      await homePage.isOnHomePage();

      await searchPage.searchFlights(
        flightData.from,
        flightData.to,
        flightData.departure_date,
        flightData.return_date,
        flightData.adults
      );

      const hasResults = await searchPage.hasSearchResults();
      expect(hasResults).to.be.true;
    });

    // it('@tc_7 should display search results with valid flight options', async () => {
    //   logger.info('TC_7: Validating search results display');
    //   const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

    //   await searchPage.searchFlights(
    //     flightData.from,
    //     flightData.to,
    //     flightData.departure_date,
    //     flightData.return_date
    //   );

    //   const results = await searchPage.getSearchResults();
    //   expect(results).to.have.length.greaterThan(0);
    //   logger.info('TC_7: Search results validation passed');
    // });

    // it('@tc_8 should validate flight search results contain required information', async () => {
    //   logger.info('TC_8: Validating search result fields');
    //   const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

    //   await searchPage.searchFlights(
    //     flightData.from,
    //     flightData.to,
    //     flightData.departure_date,
    //     flightData.return_date
    //   );

    //   const results = await searchPage.getSearchResults();

    //   results.forEach(result => {
    //     expect(result.price).to.not.be.null;
    //     expect(result.airline).to.not.be.null;
    //     expect(result.duration).to.not.be.null;
    //   });
    //   logger.info('TC_8: Result fields validation passed');
    // });

    // it('@tc_9 should validate search results are sorted by price', async () => {
    //   logger.info('TC_9: Validating price sorting');
    //   const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

    //   await searchPage.searchFlights(
    //     flightData.from,
    //     flightData.to,
    //     flightData.departure_date,
    //     flightData.return_date
    //   );

    //   const results = await searchPage.getSearchResults();

    //   if (results.length > 1) {
    //     for (let i = 0; i < results.length - 1; i++) {
    //       const price1 = parseFloat(results[i].price.replace(/[^0-9.]/g, ''));
    //       const price2 = parseFloat(results[i + 1].price.replace(/[^0-9.]/g, ''));
    //       expect(price1).to.be.lessThanOrEqual(price2);
    //     }
    //   }
    //   logger.info('TC_9: Price sorting validation passed');
    // });
  });
});
