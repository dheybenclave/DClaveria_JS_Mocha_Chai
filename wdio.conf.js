export const config = {
    runner: 'local',
    specs: [
        './tests/web/**/*.spec.js',
        './tests/api/**/*.spec.js'
    ],
    exclude: [],
    suites: {
        regression: ['./tests/web/cheapflights/cheapflights.spec.js'],
        api: ['./tests/api/booking/booking.spec.js']
    },
    config: {
        baseUrl: 'https://www.cheapflights.com.au',
        apiBaseUrl: 'https://restful-booker.herokuapp.com',
        browser: 'chrome',
        headless: false,
        timeout: 30000,
        apiUsername: 'admin',
        apiPassword: 'password123',
        openMochawesomeReport: true
    },
    maxInstances: 5,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--start-maximized',
                '--disable-logging',
                '--silent',
                '--log-level=3'
            ],
            excludeSwitches: ['enable-logging']
        }
    }],
    logLevel: 'warn',
    logLevels: {
        webdriver: 'error',
        webdriverio: 'error',
        '@wdio/cli': 'warn',
        '@wdio/runner': 'warn',
        '@wdio/mocha-framework': 'warn'
    },
    framework: 'mocha',

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000 // Test case timeout limits (1 minute)
    },
    // Attach the terminal reporter alongside the HTML reporter
    reporters: [
        'spec',
        ['mochawesome', {
            outputDir: './reports',
            mochawesome_filename: 'test-report.json',
            includeScreenshots: true,          // Tells reporter to check for captured images
            screenshotUseRelativePath: true   // Helps local report find screenshots correctly
        }]
    ],

    /**
      * HOOK 1: AUTO-CLEANUP
      * Runs ONCE before any browser workers or test threads are launched.
      */
    onPrepare: function (config, capabilities) {
        const reportDirectory = './reports';

        if (fs.existsSync(reportDirectory)) {
            console.log(`🧹 Cleaning historical records from: ${reportDirectory}`);
            fs.rmSync(reportDirectory, { recursive: true, force: true });
        }
    },
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        // If the test case failed, take a screenshot immediately
        if (!passed) {
            await browser.takeScreenshot();
        }
    },
     /**
     * HOOK 2: AUTO-COMPILE & AUTO-OPEN
     * Runs ONCE after all worker threads shut down and tests completely finish.
     */
    onComplete: function (exitCode, config, capabilities, results) {
        console.log('📊 Building HTML Summary Reports...');
        
        try {
            // Compile the telemetry JSON into an interactive index.html page
            execSync('npx marge ./reports/test-report.json --reportDir ./reports --reportFilename index.html');
            
            console.log('🚀 Launching report dashboard inside browser...');
            // Automatically opens the HTML report natively across Mac, Windows, or Linux
            execSync('npx open-cli ./reports/index.html');
        } catch (error) {
            console.error('⚠️ Failed to compile or display report:', error.message);
        }
    }
}
