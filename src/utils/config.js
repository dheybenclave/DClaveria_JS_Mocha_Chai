import path from 'path';
import { fileURLToPath } from 'url';
import { config as wdioConfig } from '../../wdio.conf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customConfig = wdioConfig.config || wdioConfig;

export const CONFIG = {
  BASE_URL: customConfig.baseUrl || 'https://www.cheapflights.com.au',
  API_BASE_URL: customConfig.apiBaseUrl || 'https://restful-booker.herokuapp.com',

  BROWSER: customConfig.browser || 'chrome',
  HEADLESS: Boolean(customConfig.headless),
  TIMEOUT: Number(customConfig.timeout || 30000),

  SCREENSHOT_DIR: path.resolve(__dirname, '../../logs/screenshots'),
  VIDEO_DIR: path.resolve(__dirname, '../../logs/videos'),

  API_USERNAME: customConfig.apiUsername || 'admin',
  API_PASSWORD: customConfig.apiPassword || 'password123',

  FLIGHT_SEARCH: {
    FROM_CITY: 'Sydney',
    TO_CITY: 'Melbourne',
    DEPARTURE_DATE: '2025-09-01',
    RETURN_DATE: '2025-09-10',
    ADULTS: 1,
    CHILDREN: 0,
    INFANTS: 0
  },

  OPEN_MOCHAWESOME_REPORT: Boolean(customConfig.openMochawesomeReport)
};

export const PATHS = {
  TEST_DATA_WEB: path.resolve(__dirname, '../../test-data/web'),
  TEST_DATA_API: path.resolve(__dirname, '../../test-data/api'),
  MOCHA_REPORT: path.resolve(__dirname, '../../mochawesome-report'),
  LOGS: path.resolve(__dirname, '../../logs')
};

