import { expect } from 'chai';
import HomePage from '../../pageobjects/home.page.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';


describe('Validate and Verify Booking Flight Functionalities', () => {

  it('@tc_2 @web_tc_2 Search Valid Flight Details', async () => {
    logger.info('TC_2: Searching flights with valid parameters');

    const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

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
  });

});

