import { expect } from 'chai';
import { CONFIG } from '../../utils/config.js';
import logger from '../../utils/logger.js';

export default class BasePage {


  getSelectorName(elementOrSelector) {
    if (typeof elementOrSelector === 'string') {
      return elementOrSelector;
    }
    if (elementOrSelector && elementOrSelector.selector) {
      return elementOrSelector.selector;
    }
    return '[WebdriverIO Element Object]';
  }
  async getElement(elementOrSelector) {
    if (typeof elementOrSelector === 'string') {
      return await $(elementOrSelector);
    }
    return elementOrSelector;
  }

  // Global Generic elements
  async getTextElement(textName, parentSelector = "") {
    logger.info(`Finding text element: ${textName}`);

    const xpath = `${parentSelector}//*[contains(normalize-space(.), '${textName}') and not(self::script)]`;
    const el = await $(xpath);
    logger.debug(`element: ${el}`);
    expect(await el.isExisting(), `Text element with text "${textName}" should exist in DOM : Element: ${this.getSelectorName(el)}`).to.be.true;
    logger.info(`Found text element for text: ${textName}`);
    return el;
  }

  // Command Methods

  async open(path = '') {
    const url = path ? `${CONFIG.BASE_URL}${path}` : CONFIG.BASE_URL;
    logger.info(`Navigating to: ${url}`);
    await browser.url(url);
    expect(await browser.getUrl(), `Expected URL to contain ${CONFIG.BASE_URL}`).to.include(CONFIG.BASE_URL);
  }

  async takeScreenshot(name) {
    logger.info(`Taking screenshot: ${name}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    await browser.saveScreenshot(filename);
    return filename;
  }

  async scrollToElement(elementOrSelector) {
    logger.info('Scrolling to element');
    const el = await this.getElement(elementOrSelector);

    await el.waitForDisplayed({ timeout: CONFIG.TIMEOUT });
    expect(await el.isDisplayed(), `Element should be displayed before scrolling : Element: ${this.getSelectorName(el)}`).to.be.true;

    const { x, y } = await el.getLocation();
    await el.scroll(x, y);

    expect(await el.isDisplayedInViewport(), `Element should be in viewport after scrolling : Element: ${this.getSelectorName(el)}`).to.be.true;
  }

  async waitForPageLoad() {
    logger.info('Waiting for page load');
    await browser.waitUntil(
      async () => {
        const state = await browser.getUrl();
        return state.includes(CONFIG.BASE_URL);
      },
      {
        timeout: CONFIG.TIMEOUT,
        timeoutMsg: `Page did not load within ${CONFIG.TIMEOUT}ms`
      }
    );
    expect(await browser.getUrl(), `Page should be loaded `).to.include(CONFIG.BASE_URL);
  }

  async waitForElementClickable(elementOrSelector, timeout = CONFIG.TIMEOUT) {
    logger.info(`Waiting for element to be clickable (timeout: ${timeout}ms) `);
    const el = await this.getElement(elementOrSelector);

    await this.waitForElementVisible(el, timeout);
    await el.waitForEnabled({ timeout });

    expect(await el.isClickable(), `Element should be clickable : Element: ${this.getSelectorName(el)}`).to.be.true;
  }

  async waitForElementVisible(elementOrSelector, timeout = CONFIG.TIMEOUT) {

    const el = await this.getElement(elementOrSelector);

    logger.info(`Waiting for element to be visible (timeout: ${timeout}ms) | Element: ${this.getSelectorName(el)}`);

    await el.waitForDisplayed({ timeout });
    expect(await el.isExisting(), `Element should exist in DOM }`).to.be.true;
    expect(await el.isDisplayed(), `Element should be visible on viewport }`).to.be.true;
  }

  async clickElementByText(textToClick, parentSelector = "") {
    logger.info(`Clicking element with text: ${textToClick}`);
    const el = await this.getTextElement(textToClick, parentSelector);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);
    await el.click();

    return el;
  }

  async clickElement(elementOrSelector) {
    const el = await this.getElement(elementOrSelector);

    logger.info(`Clicking element: ${this.getSelectorName(el)}`);
    await this.waitForElementClickable(el, CONFIG.TIMEOUT);
    await el.click();

    return el;
  }


  async enterText(elementOrSelector, value) {
    logger.info(`Entering text into element`);
    const el = await this.getTextElement(elementOrSelector);

    logger.info(`Entering text: ${value} into element: ${this.getSelectorName(el)}`);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);
    await el.setValue(value);

    return el;
  }

  // Verification Methods

  async verifyContainsText(expectedText) {
    logger.info(`Verifying element contains text: ${expectedText}`);
    const el = await this.getTextElement(expectedText);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);

    const actualText = await el.getText();
    expect(actualText, `Expected text to include "${expectedText}" : Element: ${this.getSelectorName(el)}`).to.include(expectedText);
    logger.info(`Element text verified to contain: ${expectedText}`);

    return el;
  }

  async verifyEqualsText(expectedText, message = "") {
    logger.info(`Verifying element equals text: ${expectedText}`);
    const el = await this.getTextElement(expectedText);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);

    const actualText = await el.getText();
    if (message) {
      expect(actualText, message).to.equal(expectedText);
    } else {
      expect(actualText, `Expected text to exactly match "${expectedText}" : Element: ${this.getSelectorName(el)}`).to.equal(expectedText);
    }
    return el;
  }
}
