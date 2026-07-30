import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility class for loading and querying JSON test data files.
 */
export class DataManager {
  /**
   * Loads a JSON test data file from the specified folder.
   * @param {string} filename - JSON filename to load.
   * @param {string} [folder='web'] - Data folder name: 'web' or 'api'.
   * @returns {Object|Array} Parsed JSON content.
   * @throws {Error} If the file does not exist.
   */
  static getJsonData(filename, folder = 'web') {
    const filePath = path.join(PATHS[`TEST_DATA_${folder.toUpperCase()}`], filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  /**
   * Loads a JSON test data file from the web data folder.
   * @param {string} filename - JSON filename to load.
   * @returns {Object|Array} Parsed JSON content.
   */
  static getWebData(filename) {
    return this.getJsonData(filename, 'web');
  }

  /**
   * Loads a JSON test data file from the API data folder.
   * @param {string} filename - JSON filename to load.
   * @returns {Object|Array} Parsed JSON content.
   */
  static getApiData(filename) {
    return this.getJsonData(filename, 'api');
  }

  /**
   * Retrieves a single item from a web JSON file by its `id` property.
   * @param {string} filename - JSON filename to load.
   * @param {number|string} id - ID value to match.
   * @returns {Object|undefined} Matching item or undefined.
   */
  static getWebDataById(filename, id) {
    const data = this.getWebData(filename);
    return data.find(item => item.id === id);
  }

  /**
   * Retrieves a single item from an API JSON file by its `id` property.
   * @param {string} filename - JSON filename to load.
   * @param {number|string} id - ID value to match.
   * @returns {Object|undefined} Matching item or undefined.
   */
  static getApiDataById(filename, id) {
    const data = this.getApiData(filename);
    return data.find(item => item.id === id);
  }
}
