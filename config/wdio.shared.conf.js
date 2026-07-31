import dotenv from 'dotenv';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { clearLogBuffer, getLogBuffer, getTestLogger, logger } from '../src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

dotenv.config();

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

const baseConfig = {
    baseUrl: process.env.BASE_URL || 'https://www.cheapflights.com.au',
    apiBaseUrl: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
    browser: process.env.BROWSER || 'chrome',
    timeout: Number(process.env.TIMEOUT || 1000000),
    apiUsername: process.env.API_USERNAME,
    apiPassword: process.env.API_PASSWORD,
    openMochawesomeReport: process.env.OPEN_MOCHAWESOME_REPORT === 'true',
    headless: process.env.HEADLESS === 'true',
    specs: [
        path.resolve(__dirname, '../src/specs/web/**/*.spec.js'),
        path.resolve(__dirname, '../src/specs/api/**/*.spec.js')
    ],
    exclude: [],
    suites: {
        regression: [
            path.resolve(__dirname, '../src/specs/web/**/*.spec.js'),
            path.resolve(__dirname, '../src/specs/api/**/*.spec.js')
        ],
        web: [path.resolve(__dirname, '../src/specs/web/**/*.spec.js')],
        api: [path.resolve(__dirname, '../src/specs/api/**/*.spec.js')]
    },
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 1000000
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
    beforeSession: function (config, capabilities) {
        if (config.headless) {
            const caps = Array.isArray(capabilities) ? capabilities : [capabilities];
            caps.forEach((cap) => {
                if (cap['goog:chromeOptions']) {
                    const args = cap['goog:chromeOptions'].args || [];
                    args.push('--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=1920,1080');
                    cap['goog:chromeOptions'].args = args.filter(arg => arg !== '--start-maximized');
                }
            });
        }
    },
    reporters: [
        'spec',
        [
            'mochawesome',
            {
                outputDir: path.resolve(__dirname, '../reports'),
                includeScreenshots: true,
                screenshotUseRelativePath: true,
                outputFileFormat: function (opts) {
                    return `results-${opts.cid}.json`;
                }
            }
        ]
    ],
    onPrepare: function (config, capabilities) {
        const reportDirectory = path.resolve(__dirname, '../reports');
        if (fs.existsSync(reportDirectory)) {
            console.log('Cleaning historical records from: ' + reportDirectory);
            fs.rmSync(reportDirectory, { recursive: true, force: true });
        }
        fs.mkdirSync(reportDirectory, { recursive: true });
    },
    afterTest: async function (test, context, { error, result, duration }) {
        try {

            await browser.deleteAllCookies();
            await browser.execute(() => {
                window.sessionStorage.clear();
                window.localStorage.clear();
            });
            logger.info(`[Global Cleanup] Successfully cleared Cookies, LocalStorage, and SessionStorage.`);
        } catch (cleanupError) {
            logger.warn(`[Global Cleanup] Refusing optimization or state clear skipped: ${cleanupError.message}`);
        } finally {
            logger.info(`[Global Cleanup] Test lifecycle ended for: "${test.title}"`);
        }

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

        if (error) {
            logger.info(`[Global Cleanup] Test failed. Capturing failure screenshot for: "${test.title}"`);
            await browser.takeScreenshot();
        }
    },
    onComplete: async function (exitCode, config, capabilities, results) {
        console.log('Generating Mochawesome reports...');

        try {
            const reportsDir = path.resolve(__dirname, '../reports');
            if (!fs.existsSync(reportsDir)) {
                console.log('Reports directory does not exist.');
                return;
            }

            const files = fs.readdirSync(reportsDir);
            console.log('Raw files in directory:', files);

            const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'wdio-ma-merged.json');
            console.log('JSON data files found:', jsonFiles);

            if (jsonFiles.length > 0 || files.some(f => f.includes('mochawesome'))) {
                try {
                    const marge = require('mochawesome-report-generator');
                    const { merge } = require('mochawesome-merge');

                    console.log('Merging JSON test reports...');
                    const jsonGlob = path.join(reportsDir, '*.json').split(path.sep).join('/');
                    const mergedJson = await merge({
                        files: [jsonGlob],
                    });

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

            if (config.openMochawesomeReport) {
                try {
                    const updatedFiles = fs.readdirSync(reportsDir);
                    const htmlFile = updatedFiles.find(f => f.endsWith('.html'));
                    if (htmlFile) {
                        const reportPath = path.resolve(path.join(reportsDir, htmlFile));
                        console.log(`Opening report: ${reportPath}`);

                        const startCmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
                        require('child_process').execSync(`${startCmd} "${reportPath}"`, { stdio: 'ignore' });
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

export const config = baseConfig;
export { dedupeSuites };
