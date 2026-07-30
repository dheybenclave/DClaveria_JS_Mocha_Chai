import { expect } from 'chai';
import BasePage from '../pageobjects/base.page.js';
import { logger } from '../utils/logger.js';

/**
 * Reusable global navbar/header component.
 * Provides shared actions for authentication, navigation, and user menu interactions.
 */
export default class NavbarComponent extends BasePage {
    /**
     * Site logo in the navbar.
     * @type {WebdriverIO.Element}
     */
    get logo() {
        return $('div.mc6t-logo');
    }

    /**
     * Primary navigation container.
     * @type {WebdriverIO.Element}
     */
    get navContainer() {
        return $('nav[aria-label="Primary"], header nav');
    }

    /**
     * Sign in / user menu trigger.
     * @type {WebdriverIO.Element}
     */
    get userMenuButton() {
        return $('[data-testid="user-menu"], [aria-label="Sign in"]');
    }

    /**
     * Navigation link by accessible name.
     * @param {string} name - Link text or aria-label.
     * @returns {WebdriverIO.Element}
     */
    getNavLink(name) {
        return $(`a[href*="${name.toLowerCase()}"], a[aria-label*="${name}"]`);
    }

    /**
     * Opens the user menu / login dialog.
     */
    async openUserMenu() {
        logger.info('Opening user menu');
        await this.clickElement(this.userMenuButton);
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
