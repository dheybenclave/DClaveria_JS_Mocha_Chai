import HomePage from '../../pageobjects/home.page.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';


describe('@smoke @e2e_1 Cheapflights DClaveria Web UI Automation', () => {
  let homePage;

  before(() => {
    homePage = new HomePage();
    logger.info('Test suite initialized');
  });

  beforeEach(async () => {
    logger.info('Navigating to home page');
    await homePage.open();
    await homePage.isOnHomePage();
  });

  afterEach(async () => {
    logger.info('Test completed');
  });

  describe('Validate and Verify Elements Home Page', () => {
    it('@tc_1 @web_tc_1 Should Check Logo and Login Elements are Displayed on Home Page', async () => {
      logger.info('TC_1: logo and login elements on home page');

      await homePage.waitForPageLoad();

      await homePage.waitForElementVisible(homePage.logoImage, 5000);

      await homePage.clickCarButton();
      await homePage.verifyContainsText('Car hire.');


      await homePage.clickStayButton();
      await homePage.verifyContainsText('Where do you want to stay?');

      await homePage.clickElement(homePage.signButton);

      await homePage.waitForElementVisible(homePage.loginDialog, 5000);

    });
  });

  describe('Validate and Verify Flight Seeach Functionalities', () => {
    it('@tc_2 @web_tc_2 Search Valid FLight Details', async () => {
      logger.info('TC_2: Searching flights with valid parameters');

      const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

      // Navigate to flights search page first
      await homePage.clickFlightsButton();
      await homePage.waitForPageLoad();

      await homePage.searchFlights(
        flightData.from,
        flightData.to,
        flightData.departure_date,
        flightData.return_date,
        flightData.adults
      );

      const hasResults = await homePage.hasSearchResults(
        flightData.from,
        flightData.to,
        flightData.departure_date,
        flightData.return_date,
      );
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


  });
});
