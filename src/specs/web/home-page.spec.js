import HomePage from '../../pageobjects/home.page.js';
import logger from '../../utils/logger.js';



describe('Validate and Verify Elements Home Page', () => {
  it('@tc_1 @web_tc_1 Should Check Logo and Login Elements are Displayed on Home Page', async () => {

    logger.info('TC_1: logo and login elements on home page');

    let homePage = new HomePage();
    logger.info('Navigating to home page');

    await homePage.open();
    await homePage.isOnHomePage();

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

