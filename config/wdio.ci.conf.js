import { config as wdioShared } from './wdio.shared.conf.js';

export const config = {
    ...wdioShared,
    runner: 'local',
    headless: true,
    maxInstances: 5,
    logLevel: 'error',
    logLevels: {
        webdriver: 'error',
        webdriverio: 'error',
        '@wdio/cli': 'error',
        '@wdio/runner': 'error',
        '@wdio/mocha-framework': 'error'
    },
    openMochawesomeReport: false
};
