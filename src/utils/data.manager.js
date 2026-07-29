import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DataManager {
  static getJsonData(filename, folder = 'web') {
    const filePath = path.join(PATHS[`TEST_DATA_${folder.toUpperCase()}`], filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  static getWebData(filename) {
    return this.getJsonData(filename, 'web');
  }

  static getApiData(filename) {
    return this.getJsonData(filename, 'api');
  }

  static getWebDataById(filename, id) {
    const data = this.getWebData(filename);
    return data.find(item => item.id === id);
  }

  static getApiDataById(filename, id) {
    const data = this.getApiData(filename);
    return data.find(item => item.id === id);
  }
}

