import { expect } from 'chai';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Base page object containing common UI actions and verification methods.
 * All page objects should extend this class.
 */
export default class BasePage {
  /**
   * Returns a displayable name for an element or selector string.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @returns {string} Displayable selector name.
   */
  getSelectorName(elementOrSelector) {
    if (typeof elementOrSelector === 'string') {
      return elementOrSelector;
    }
    if (elementOrSelector && elementOrSelector.selector) {
      return elementOrSelector.selector;
    }
    return '[WebdriverIO Element Object]';
  }

  /**
   * Resolves a selector string to a WebdriverIO element, or returns the element as-is.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @returns {Promise<WebdriverIO.Element>} Resolved WebdriverIO element.
   */
  async getElement(elementOrSelector) {
    if (typeof elementOrSelector === 'string') {
      return await $(elementOrSelector);
    }
    return elementOrSelector;
  }

  /**
   * Finds an element by its visible text using XPath.
   * @param {string} textName - Text to search for in the DOM.
   * @param {string} [parentSelector=""] - Optional parent selector to scope the search.
   * @returns {Promise<WebdriverIO.Element>} Found element.
   */
  async getTextElement(textName, parentSelector = "") {
    logger.info(`Finding text element: ${textName}`);

    const xpath = `${parentSelector}//*[contains(normalize-space(.), '${textName}') and not(self::script)]`;
    const el = await $(xpath);
    logger.debug(`element: ${el}`);
    expect(await el.isExisting(), `Text element with text "${textName}" should exist in DOM : Element: ${this.getSelectorName(el)}`).to.be.true;
    logger.info(`Found text element for text: ${textName}`);
    return el;
  }

  /**
   * Navigates to a path relative to the configured base URL.
   * @param {string} [path=""] - Relative URL path to navigate to.
   */
  async open(path = '') {
    const url = path ? `${CONFIG.BASE_URL}${path}` : CONFIG.BASE_URL;
    logger.info(`Navigating to: ${url}`);
    await browser.url(url);
    expect(await browser.getUrl(), `Expected URL to contain ${CONFIG.BASE_URL}`).to.include(CONFIG.BASE_URL);
  }

  /**
   * Captures a browser screenshot with a timestamped filename.
   * @param {string} name - Base name for the screenshot file.
   * @returns {Promise<string>} Generated screenshot filename.
   */
  async takeScreenshot(name) {
    logger.info(`Taking screenshot: ${name}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    await browser.saveScreenshot(filename);
    return filename;
  }

  /**
   * Scrolls the page until the specified element is visible in the viewport.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   */
  async scrollToElement(elementOrSelector) {
    logger.info('Scrolling to element');
    const el = await this.getElement(elementOrSelector);

    await el.waitForDisplayed({ timeout: CONFIG.TIMEOUT });
    expect(await el.isDisplayed(), `Element should be displayed before scrolling : Element: ${this.getSelectorName(el)}`).to.be.true;

    const { x, y } = await el.getLocation();
    await el.scroll(x, y);

    expect(await el.isDisplayedInViewport(), `Element should be in viewport after scrolling : Element: ${this.getSelectorName(el)}`).to.be.true;
  }

  /**
   * Waits until the current page URL belongs to the configured base URL and the document is fully loaded.
   */
  async waitForPageLoad() {
    logger.info('Waiting for page load lifecycle to complete');

    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();
        const isCorrectDomain = currentUrl.includes(CONFIG.BASE_URL);
        const isDOMReady = await browser.execute(() => document.readyState === 'complete');
        return isCorrectDomain && isDOMReady;
      },
      {
        timeout: CONFIG.TIMEOUT,
        timeoutMsg: `Page failed to stabilize at ${CONFIG.BASE_URL} within ${CONFIG.TIMEOUT}ms`
      }
    );
  }

  /**
   * Waits for an element to become clickable (visible and enabled).
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @param {number} [timeout=CONFIG.TIMEOUT] - Maximum wait time in milliseconds.
   */
  async waitForElementClickable(elementOrSelector, timeout = CONFIG.TIMEOUT) {
    logger.info(`Waiting for element to be clickable (timeout: ${timeout}ms) `);
    const el = await this.getElement(elementOrSelector);

    await this.waitForElementVisible(el, timeout);
    await el.waitForEnabled({ timeout });

    expect(await el.isClickable(), `Element should be clickable : Element: ${this.getSelectorName(el)}`).to.be.true;
  }

  /**
   * Waits for an element to be visible in the viewport.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @param {number} [timeout=CONFIG.TIMEOUT] - Maximum wait time in milliseconds.
   */
  async waitForElementVisible(elementOrSelector, timeout = CONFIG.TIMEOUT) {
    const el = await this.getElement(elementOrSelector);

    logger.info(`Waiting for element to be visible (timeout: ${timeout}ms) | Element: ${this.getSelectorName(el)}`);

    await el.waitForDisplayed({ timeout });
    expect(await el.isExisting(), `Element should exist in DOM }`).to.be.true;
    expect(await el.isDisplayed(), `Element should be visible on viewport }`).to.be.true;
  }

  /**
   * Clicks an element identified by its visible text.
   * @param {string} textToClick - Visible text of the element to click.
   * @param {string} [parentSelector=""] - Optional parent selector to scope the search.
   * @returns {Promise<WebdriverIO.Element>} The clicked element.
   */
  async clickElementByText(textToClick, parentSelector = "") {
    logger.info(`Clicking element with text: ${textToClick}`);
    const el = await this.getTextElement(textToClick, parentSelector);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);
    await el.click();

    return el;
  }

  /**
   * Clicks an element after waiting for it to be clickable.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @returns {Promise<WebdriverIO.Element>} The clicked element.
   */
  async clickElement(elementOrSelector) {
    const el = await this.getElement(elementOrSelector);

    logger.info(`Clicking element: ${this.getSelectorName(el)}`);
    await this.waitForElementClickable(el, CONFIG.TIMEOUT);
    await el.click();

    return el;
  }

  /**
   * Enters text into an element identified by its visible text.
   * @param {string|WebdriverIO.Element} elementOrSelector - Element reference or CSS/XPath selector.
   * @param {string} value - Text value to enter.
   * @returns {Promise<WebdriverIO.Element>} The target element.
   */
  async enterText(elementOrSelector, value) {
    logger.info(`Entering text into element`);
    const el = await this.getTextElement(elementOrSelector);

    logger.info(`Entering text: ${value} into element: ${this.getSelectorName(el)}`);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);
    await el.setValue(value);

    return el;
  }

  /**
   * Verifies that an element contains the expected text.
   * @param {string} expectedText - Expected text to be contained in the element.
   * @returns {Promise<WebdriverIO.Element>} The verified element.
   */
  async verifyContainsText(expectedText) {
    logger.info(`Verifying element contains text: ${expectedText}`);
    const el = await this.getTextElement(expectedText);
    await this.waitForElementVisible(el, CONFIG.TIMEOUT);

    const actualText = await el.getText();
    expect(actualText, `Expected text to include "${expectedText}" : Element: ${this.getSelectorName(el)}`).to.include(expectedText);
    logger.info(`Element text verified to contain: ${expectedText}`);

    return el;
  }

  /**
   * Verifies that an element's text exactly matches the expected text.
   * @param {string} expectedText - Expected exact text of the element.
   * @param {string} [message=""] - Optional custom assertion message.
   * @returns {Promise<WebdriverIO.Element>} The verified element.
   */
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
