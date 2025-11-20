import { defineConfig, devices } from '@playwright/test';

// Read environment from ENV variable, default to 'qa'
const ENV = process.env.ENV || 'qa';

// Load config based on environment
// Dynamic imports in ES modules return a promise, but playwright.config.js needs to export the config.
// We can use a workaround or just import all and select.
// Or better, since we are in Node, we can use createRequire to keep it simple for dynamic loading if we want,
// BUT standard ES way is dynamic import(). However, playwright config file expects an exported object.
// Let's use a helper function or just map them if we want to be strict ESM, 
// OR we can use the standard 'process.env' approach and just import the specific one if we knew it statically.
// Since it's dynamic, let's use a switch or object map for simplicity and safety in ESM without top-level await issues in all environments.

import qaConfig from './config/env.qa.js';
import devConfig from './config/env.dev.js';
import prodConfig from './config/env.prod.js';

const configMap = {
    qa: qaConfig,
    dev: devConfig,
    prod: prodConfig
};

const envConfig = configMap[ENV];

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
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: envConfig.baseUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
});
