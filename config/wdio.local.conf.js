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
};
