import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Extend the base test with a testData fixture
 * The fixture loads JSON data from a file path specified in the project config
 */
export const test = base.extend({
  testData: async ({ }, use, testInfo) => {
    // Get the test data path from the project config
    const testDataPath = testInfo.project.use?.testDataPath;
    
    if (!testDataPath) {
      throw new Error('testDataPath is not defined in the project configuration');
    }

    // Resolve the path relative to the project root
    const fullPath = path.resolve(testDataPath);
    
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Make the data available to the test
    await use(data);
  },
});

export { expect } from '@playwright/test';
