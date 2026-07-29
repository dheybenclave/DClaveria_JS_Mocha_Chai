import { CONFIG } from '../../utils/config.js';
import { logger } from '../../utils/logger.js';
import { expect } from 'chai';

export default class BasePage {
  getBaseDomain() {
    return CONFIG.BASE_URL.replace(/^https?:\/\//, '').split('/')[0];
  }

  async open(path = '') {
    const url = path ? `${CONFIG.BASE_URL}${path}` : CONFIG.BASE_URL;
    logger.step(`Navigating to: ${url}`);
    await browser.url(url);
    await this.waitForPageLoad();
    expect(await browser.getUrl(), `Expected URL to contain ${CONFIG.BASE_URL}`).to.include(this.getBaseDomain());
  }

  async waitForPageLoad() {
    logger.step('Waiting for page load');
    await browser.waitUntil(
      async () => {
        const state = await browser.getUrl();
        return state.includes(this.getBaseDomain());
      },
      {
        timeout: CONFIG.TIMEOUT,
        timeoutMsg: `Page did not load within ${CONFIG.TIMEOUT}ms`
      }
    );
    expect(await browser.getUrl(), 'Page should be loaded').to.include(this.getBaseDomain());
  }

  async takeScreenshot(name) {
    logger.step(`Taking screenshot: ${name}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    await browser.saveScreenshot(filename);
    return filename;
  }

  async scrollToElement(locator) {
    logger.step('Scrolling to element');
    await locator.scrollIntoView();
  }

  async waitForElementVisible(locator, timeout = CONFIG.TIMEOUT) {
    logger.step(`Waiting for element to be visible (timeout: ${timeout}ms)`);
    await locator.waitForDisplayed({ timeout });
  }

  async waitForElementClickable(locator, timeout = CONFIG.TIMEOUT) {
    logger.step(`Waiting for element to be clickable (timeout: ${timeout}ms)`);
    await locator.waitForDisplayed({ timeout });
    await locator.waitForEnabled({ timeout });
  }
}
