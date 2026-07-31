import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/**
 * Central configuration object for the test framework.
 * Values are sourced from .env with fallback defaults.
 * @type {Object}
 * @property {string} BASE_URL - Base URL for web tests.
 * @property {string} API_BASE_URL - Base URL for API tests.
 * @property {string} BROWSER - Default browser name.
 * @property {number} TIMEOUT - Default timeout in milliseconds.
 * @property {string} SCREENSHOT_DIR - Directory for screenshots.
 * @property {string} VIDEO_DIR - Directory for videos.
 * @property {string} API_USERNAME - API username for auth.
 * @property {string} API_PASSWORD - API password for auth.
 * @property {Object} FLIGHT_SEARCH - Default flight search data.
 * @property {boolean} OPEN_MOCHAWESOME_REPORT - Whether to auto-open Mochawesome report.
 */
export const CONFIG = {
  BASE_URL: process.env.BASE_URL || 'https://www.cheapflights.com.au',
  API_BASE_URL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',

  BROWSER: process.env.BROWSER || 'chrome',
  TIMEOUT: Number(process.env.TIMEOUT || 60000),

  SCREENSHOT_DIR: path.resolve(__dirname, '../../logs/screenshots'),
  VIDEO_DIR: path.resolve(__dirname, '../../logs/videos'),

  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,
  OPEN_MOCHAWESOME_REPORT: process.env.OPEN_MOCHAWESOME_REPORT === 'true'
};

/**
 * Resolved filesystem paths for test artifacts and reports.
 * @type {Object}
 * @property {string} TEST_DATA_WEB - Path to web test data directory.
 * @property {string} TEST_DATA_API - Path to API test data directory.
 * @property {string} MOCHA_REPORT - Path to Mochawesome report directory.
 * @property {string} LOGS - Path to logs directory.
 */
export const PATHS = {
  TEST_DATA_WEB: path.resolve(__dirname, '../fixtures/web'),
  TEST_DATA_API: path.resolve(__dirname, '../fixtures/api'),
  MOCHA_REPORT: path.resolve(__dirname, '../../reports'),
  LOGS: path.resolve(__dirname, '../../logs')
};
