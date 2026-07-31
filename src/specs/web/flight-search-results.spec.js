import { expect } from 'chai';
import HomePage from '../../pageobjects/home.page.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';


describe('Validate and Verify Search Flight Results ', () => {
  it('@tc_3 @web_tc_3  Search Flight Results Checking', async () => {

    logger.info('TC_3: Validating search results display');

    const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[1];

    let homePage = new HomePage();

    logger.info('Navigating to home page');

    await homePage.open();
    await homePage.isOnHomePage();

    // Navigate to flights search page first
    await homePage.clickFlightsButton();
    await homePage.waitForPageLoad();

    await homePage.searchFlights(
      flightData.from,
      flightData.to,
      flightData.departure_date,
      flightData.return_date,
      flightData.trip_type
    );

    const hasResults = await homePage.hasSearchResults(
      flightData.from,
      flightData.to,
      flightData.departure_date,
      flightData.return_date,
    );
    expect(hasResults).to.be.true;

    const results = await homePage.getSearchResults();
    expect(results).to.have.length.greaterThan(0);
  });
});


