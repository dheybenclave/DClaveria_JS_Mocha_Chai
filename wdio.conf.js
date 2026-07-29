// wdio.conf.js
import { execSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { clearLogBuffer, getLogBuffer, getTestLogger } from './src/utils/logger.js';

const require = createRequire(import.meta.url);

// Fix for upstream wdio-mochawesome-reporter bug: nested describe blocks
// get pushed twice into the suite tree (see onSuiteEnd in their source —
// it tracks only one `currSuite` reference with no stack for nesting).
function dedupeSuites(suite) {
    if (!suite || !Array.isArray(suite.suites)) return;
    const seen = new Set();
    suite.suites = suite.suites.filter(child => {
        if (seen.has(child.uuid)) return false;
        seen.add(child.uuid);
        return true;
    });
    suite.suites.forEach(dedupeSuites);
}

const config = {
    runner: 'local',
    headless: false,

    specs: [
        './tests/web/**/*.spec.js',
        './tests/api/**/*.spec.js'
    ],
    exclude: [],
    suites: {
        regression: ['./tests/web/cheapflights/cheapflights.spec.js'],
        api: ['./tests/api/booking/booking.spec.js']
    },
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
        timeout: 60000
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
    reporters: [
        'spec',
        [
            'mochawesome',
            {
                outputDir: './reports',
                includeScreenshots: true,
                screenshotUseRelativePath: true,
                outputFileFormat: function (opts) {
                    return `results-${opts.cid}.json`;
                }
            }
        ]
    ],
    onPrepare: function (config, capabilities) {
        const reportDirectory = './reports';
        if (fs.existsSync(reportDirectory)) {
            console.log('Cleaning historical records from: ' + reportDirectory);
            fs.rmSync(reportDirectory, { recursive: true, force: true });
        }
        fs.mkdirSync(reportDirectory, { recursive: true });
    },
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        const testLogger = getTestLogger(test.title, test.fullTitle);
        const logs = getLogBuffer();
        if (logs.length > 0) {
            testLogger.info(`Application Logs for "${test.title}":`);
            logs.forEach(log => testLogger.info(log));
            process.emit('wdio-mochawesome-reporter:addContext', {
                title: 'Application Logs',
                value: logs.join('\n')
            });
        }
        clearLogBuffer();

        if (!passed) {
            await browser.takeScreenshot();
        }
    },
    onComplete: async function (exitCode, config, capabilities, results) {
        console.log('Generating Mochawesome reports...');

        try {
            const reportsDir = './reports';
            if (!fs.existsSync(reportsDir)) {
                console.log('Reports directory does not exist.');
                return;
            }

            // Read raw output directory files
            const files = fs.readdirSync(reportsDir);
            console.log('Raw files in directory:', files);

            // Filter for the dynamic json result objects
            const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'wdio-ma-merged.json');
            console.log('JSON data files found:', jsonFiles);

            if (jsonFiles.length > 0 || files.some(f => f.includes('mochawesome'))) {
                try {
                    const marge = require('mochawesome-report-generator');
                    const { merge } = require('mochawesome-merge');

                    console.log('Merging JSON test reports...');
                    // Merge all separate worker fragments into one main schema object
                    const jsonGlob = path.join(reportsDir, '*.json').split(path.sep).join('/');
                    const mergedJson = await merge({
                        files: [jsonGlob],
                    });

                    // Fix upstream duplicate-suite bug before generating the HTML
                    if (mergedJson.results) {
                        mergedJson.results.forEach(dedupeSuites);
                    }

                    const mergedJsonPath = path.join(reportsDir, 'wdio-ma-merged.json');
                    fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));

                    console.log('Compiling HTML report via marge...');
                    await marge.create(mergedJson, {
                        reportDir: reportsDir,
                        reportFilename: 'mochawesome',
                        reportTitle: 'DClaveria Web UI Automation',
                        inline: true,
                        charts: true
                    });

                    console.log('HTML report generated successfully.');
                } catch (error) {
                    console.error('Failed to parse or merge JSON files:', error.message);
                }
            } else {
                console.log('No raw JSON files found for report generation.');
            }

            // Auto open the compiled view in your machine's browser
            if (config.openMochawesomeReport) {
                try {
                    const updatedFiles = fs.readdirSync(reportsDir);
                    const htmlFile = updatedFiles.find(f => f.endsWith('.html'));
                    if (htmlFile) {
                        const reportPath = path.resolve(path.join(reportsDir, htmlFile));
                        console.log(`Opening report: ${reportPath}`);

                        const startCmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
                        execSync(`${startCmd} "${reportPath}"`, { stdio: 'ignore' });
                    } else {
                        console.log('No HTML report found to open.');
                    }
                } catch (openError) {
                    console.log(`Could not open browser: ${openError.message}`);
                }
            } else {
                console.log('Skipping auto-open (openMochawesomeReport not set).');
            }
        } catch (error) {
            console.error('Report generation failed:', error.message);
        }
    }
};

export { config };
