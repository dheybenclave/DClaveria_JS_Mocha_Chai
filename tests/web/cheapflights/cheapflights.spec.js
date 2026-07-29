import HomePage from '../../../src/pages/web/cheapflights/home.page.js';
import LoginPage from '../../../src/pages/web/cheapflights/login.page.js';
import FlightSearchPage from '../../../src/pages/web/cheapflights/search.page.js';
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
    await homePage.isOnHomePage();
  });

  afterEach(async () => {
    logger.info('Test completed');
  });

  describe('Validate and Verify Elements Home Page', () => {
    it('@tc_1 Should Validate and Verify the Logo and Login Elements are Displayed on Home Page', async () => {
      logger.info('TC_1: Validating and Verifying logo and login elements on home page');

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

  // describe('Flight Search - Positive Tests', () => {
  //   it('@tc_6 should search for flights with valid parameters', async () => {
  //     logger.info('TC_6: Searching flights with valid parameters');

  //     const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

  //     // Navigate to flights search page first
  //     await homePage.clickFlightsButton();
  //     await searchPage.waitForPageLoad();
  //     await homePage.isOnHomePage();

  //     await searchPage.searchFlights(
  //       flightData.from,
  //       flightData.to,
  //       flightData.departure_date,
  //       flightData.return_date,
  //       flightData.adults
  //     );

  //     const hasResults = await searchPage.hasSearchResults();
  //     expect(hasResults).to.be.true;
  //   });

  //   // it('@tc_7 should display search results with valid flight options', async () => {
  //   //   logger.info('TC_7: Validating search results display');
  //   //   const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

  //   //   await searchPage.searchFlights(
  //   //     flightData.from,
  //   //     flightData.to,
  //   //     flightData.departure_date,
  //   //     flightData.return_date
  //   //   );

  //   //   const results = await searchPage.getSearchResults();
  //   //   expect(results).to.have.length.greaterThan(0);
  //   //   logger.info('TC_7: Search results validation passed');
  //   // });


  // });
});
