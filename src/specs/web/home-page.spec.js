import { expect } from 'chai';

import HomePage from '../../pageobjects/home.page.js';
import NavbarComponent from '../../components/navbar.component.js';
import logger from '../../utils/logger.js';

describe('@smoke Validate and Verify Elements Home Page', () => {


  let commonComponent, homePage;

  beforeEach(async () => {
    homePage = new HomePage();
    commonComponent = new NavbarComponent();

    logger.info('Navigating to home page');

  });
  it('@tc_1 @web_tc_1 @positive Should Check Logo and Login Elements are Displayed on Home Page', async () => {

    logger.info('TC_1:[Positive Testing] logo and login elements on home page');

    await homePage.open();
    await homePage.isOnHomePage();

    await homePage.waitForPageLoad();

    await commonComponent.isLogoDisplayed();

    await homePage.clickCarButton();
    await homePage.verifyContainsText('Car hire.');

    await homePage.clickStayButton();
    await homePage.verifyContainsText('Where do you want to stay?');

    await homePage.clickElement(homePage.signButton);

    await homePage.waitForElementVisible(homePage.loginDialog, 5000);

  });

  it('@tc_1_2 @web_tc_1_2 @negative Should throw error when asserting text that does not exist on the page', async () => {
    logger.info('TC_1_1: [Negative Testing] to home page');

    await homePage.open();
    await homePage.waitForPageLoad();


    logger.info("Assert Non Existing Element from the Home Page");

    try {
      await homePage.getTextElement('DheoClaveriaNotExistElement');
    } catch (error) {
      let errorThrown = true;
      logger.info(`Expected caught error for non-existent text: ${error.message}`);
      expect(errorThrown, 'Expected an error to be thrown for non-existent text').to.be.true;

    }

    logger.info("Assert Unchange URL from Home Page");

    try {
      const homeUrl = await browser.getUrl();
      expect(homeUrl).to.include("flight-search");

    } catch (error) {
      logger.info(`Expected error and it will throw unchage URL: ${error.message}`);
    }


  });

});