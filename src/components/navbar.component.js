import { expect } from 'chai';
import BasePage from '../pageobjects/base.page.js';
import { logger } from '../utils/logger.js';

/**
 * Reusable global navbar/header component.
 * Provides shared actions for authentication, navigation, and user menu interactions.
 */
export default class NavbarComponent extends BasePage {
    get logo() {
        return $('div.mc6t-logo');
    }

    get headerSection() {
        return $('div[class*=HeaderV2]');
    }
    get loading() {
        return $(`//*[contains(text(),'Loading')]`);
    }

    /**
     * Verifies the logo is displayed.
     * @returns {Promise<boolean>}
     */
    async isLogoDisplayed() {
        logger.info('Verifying logo is displayed');
        await this.logo.waitForDisplayed({ timeout: 15000 });
        const displayed = await this.logo.isDisplayed();
        expect(displayed, 'Logo should be displayed').to.be.true;
        return displayed;
    }
}
