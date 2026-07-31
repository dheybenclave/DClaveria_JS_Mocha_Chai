import { config as wdioShared } from './wdio.shared.conf.js';

export const config = {
    ...wdioShared,
    runner: 'local',
    headless: false,
    logLevel: 'warn',
    logLevels: {
        webdriver: 'error',
        webdriverio: 'error',
        '@wdio/cli': 'warn',
        '@wdio/runner': 'warn',
        '@wdio/mocha-framework': 'warn'
    },
    openMochawesomeReport: true,

    // 1. Tell WebdriverIO not to attempt any automatic browser/driver installations
    browserDriverSetupType: 'none',

    // 2. Register chromedriver as a local service
    services: ['chromedriver'],

    capabilities: [{
        browserName: 'chrome',
        // 3. Force WebdriverIO to look at your locally installed Chrome browser
        browserVersion: 'stable',
        'goog:chromeOptions': {
            // Leave binary blank so it checks your local OS Program Files path naturally
            binary: '',
            args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
        }
    }],
};
