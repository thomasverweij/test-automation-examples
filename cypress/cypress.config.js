import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import dotenv from 'dotenv';
import speakeasy from 'speakeasy';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from cypress directory
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8888',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/results/screenshots',
    videosFolder: 'cypress/results/videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    
    async setupNodeEvents(on, config) {
      // Add cucumber preprocessor plugin
      await addCucumberPreprocessorPlugin(on, config);
      
      // Add esbuild bundler
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Add custom task to generate TOTP codes (runs in Node.js)
      on('task', {
        generateTOTP(secret) {
          return speakeasy.totp({
            secret: secret,
            encoding: 'base32'
          });
        }
      });

      // Make sure to return the config object as it might have been modified
      return config;
    },
    
    env: {
      TWO_FA_SECRET: process.env.TWO_FA_SECRET,
      TEST_USER1_USERNAME: process.env.TEST_USER1_USERNAME,
      TEST_USER1_PASSWORD: process.env.TEST_USER1_PASSWORD,
      TEST_USER2_USERNAME: process.env.TEST_USER2_USERNAME,
      TEST_USER2_PASSWORD: process.env.TEST_USER2_PASSWORD,
      TEST_ENV: process.env.TEST_ENV || 'dev',
    }
  },
});
