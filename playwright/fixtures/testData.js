import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Extend the base test with a testData fixture
 * The fixture loads JSON data from a file path specified in the project config
 */
export const test = base.extend({
  testDataDir: ['dev', { option: true }],
  
  testData: async ({ testDataDir }, use) => {
    const dataPath = path.join('./data', testDataDir, 'data.json');
    const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    await use(testData);
  },
});
