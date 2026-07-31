import { expect } from 'chai';
import NavbarComponent from '../../components/navbar.component.js';
import HomePage from '../../pageobjects/home.page.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';

describe('@smoke @booking_flight Validate and Verify Booking Flight Functionalities', () => {

  const homePage = new HomePage();
  const commonComponent = new NavbarComponent();

  beforeEach(async () => {
    // Destroys current browser state and spins up a brand new instance
    await browser.reloadSession();
    logger.info('Navigating to home page');

  });

  it('@tc_3 @positive Search Valid Flight Details', async () => {
    logger.info('TC_3: [Positive Testing] Searching flights with valid parameters');

    const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

    await homePage.open();
    await homePage.isOnHomePage();

    await homePage.waitForPageLoad();

    await commonComponent.isLogoDisplayed();

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
    await homePage.waitForSearchResults();

    const hasResults = await homePage.hasSearchResults(
      flightData.from,
      flightData.to,
      flightData.departure_date,
      flightData.return_date,
    );

    expect(hasResults).to.be.true;
  });


  it('@tc_4 @negative Should handle search with invalid flight parameters gracefully', async () => {
    logger.info('TC_4: [Negative Testing] searching flights with invalid parameters');

    const flightData = DataManager.getWebData('flight_test_data.json').invalid_flights[0];

    await homePage.open();
    await homePage.isOnHomePage();

    await homePage.waitForPageLoad();

    await commonComponent.isLogoDisplayed();

    await homePage.clickFlightsButton();
    await homePage.waitForPageLoad();

    logger.info('Asserting error is thrown when searching with invalid city');

    await homePage.selectLocationGroup(homePage.fromCityInput, flightData.from, true);

    await homePage.clickSearchButton();

    await homePage.waitForIntSecond(3);

    let listOfRequiredFieldErrorMsg = [
      "An error occurred while trying to perform your search",
      "Please enter a 'From' airport",
      "Please enter a 'To' airport",
      "Please enter a valid 'Depart' date",
      "Please enter a valid 'Return' date. If you wish to search for a one-way flight, please click the 'One-way' button above.",
    ]

    for (const errMsg of listOfRequiredFieldErrorMsg) {
      await homePage.verifyContainsText(errMsg);
    }

    await homePage.clickElementByText("Dismiss");

    await homePage.clickElementIfExist(homePage.closeDialogButton);

    logger.info('Asserting error is thrown when searching with Same City');

    await homePage.selectLocationGroup(homePage.fromCityInput, flightData.to);
    await homePage.selectLocationGroup(homePage.toCityInput, flightData.to);
    await homePage.clickSearchButton();

    await homePage.waitForIntSecond(3);

    let listOfUniqueFieldErrorMsg = [
      "An error occurred while trying to perform your search",
      "Please enter unique 'From' and 'To' airports",
    ]

    for (const errMsg of listOfUniqueFieldErrorMsg) {
      await homePage.verifyContainsText(errMsg);
    }

  });

});