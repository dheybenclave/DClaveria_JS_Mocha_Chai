import { expect } from 'chai';
import HomePage from '../../pageobjects/home.page.js';
import NavbarComponent from '../../components/navbar.component.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';


describe('Validate and Verify Search Flight Results ', () => {


  let homePage, commonComponent;

  beforeEach(async () => {
    homePage = new HomePage();
    commonComponent = new NavbarComponent();

    logger.info('Navigating to home page');

  });

  it('@tc_3 @web_tc_3 @positive Search Flight Results Checking', async () => {

    logger.info('TC_3: [Positive Testing] Validating search results display');

    const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[1];

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

  it('@tc_3_1 @web_tc_3_1 @negative Should handle search results with invalid parameters, conditions and display error messages', async () => {
    logger.info('TC_3_1: [Negative Testing] searching flights results with invalid parameters and conditions');

    const flightData = DataManager.getWebData('flight_test_data.json').restricted_flights[0];
    const flightData2 = DataManager.getWebData('flight_test_data.json').nofound_flights[0];

    await homePage.open();
    await homePage.isOnHomePage();

    await homePage.waitForPageLoad();

    await commonComponent.isLogoDisplayed();

    await homePage.clickFlightsButton();
    await homePage.waitForPageLoad();

    logger.info('Asserting error messages with Restricted Flights Search');

    await homePage.searchFlights(
      flightData.from,
      flightData.to,
      flightData.departure_date,
      flightData.return_date,
    );

    let listOfRequiredFieldErrorMsg = [
      "Restricted destination",
      "For regulatory reasons, we are unable to display results for this search",
      "Read more"
    ];

    for (const errMsg of listOfRequiredFieldErrorMsg) {
      await homePage.verifyContainsText(errMsg);
    }

    await homePage.clickElementByText("Back to search");

    await homePage.waitForLoadingToFinish();

    await homePage.waitForPageLoad();

    logger.info('Asserting error messages with No Found Flights Search');

    await homePage.searchFlights(
      flightData2.from,
      flightData2.to,
      flightData2.departure_date,
      flightData2.return_date,
      flightData2.trip_type
    );

    let listNoFoundErrorMsg = [
      "No flights found",
      "There are no flights available on your chosen dates. Try changing the dates of your search."
    ];

    await homePage.waitForLoadingToFinish();

    await homePage.waitForPageLoad();

    await homePage.waitForIntSecond(10);

    for (const errMsg of listNoFoundErrorMsg) {
      await homePage.verifyContainsText(errMsg);
    }

  });
});


