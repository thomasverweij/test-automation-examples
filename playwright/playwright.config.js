import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Global setup to perform login once */
  globalSetup: './global-setup.js',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:8888',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'logged-in',
      testMatch: '**/logged-in.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
    },
    {
      name: 'with-test-data-dev',
      testMatch: '**/with-test-data.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        testDataPath: path.resolve(import.meta.dirname, './test-data/dev.json'),
      },
    },
    {
      name: 'wiith-test-data-test',
      testMatch: '**/with-test-data.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        testDataPath: path.resolve(import.meta.dirname, './test-data/test.json'),
      },
    },
    {
      name: '2fa-login',
      testMatch: '**/2fa-login.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
      },
    }
  ]
});

