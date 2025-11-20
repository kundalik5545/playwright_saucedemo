import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import fs from 'fs';
import path from 'path';

// Read JSON data using fs since direct JSON import can be experimental or require flags depending on Node version
const loginData = JSON.parse(fs.readFileSync(path.resolve('data', 'loginData.json'), 'utf-8'));

// Get environment from process.env or default to 'qa'
const ENV = process.env.ENV || 'qa';
const data = loginData[ENV];

test.describe('SauceDemo Login Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await loginPage.login(data.validUser.username, data.validUser.password);
        await expect(page).toHaveURL(/inventory.html/);
    });

    test('should show error for locked out user (QA only)', async ({ page }) => {
        if (ENV === 'qa') {
            await loginPage.login(data.lockedOutUser.username, data.lockedOutUser.password);
            await loginPage.verifyErrorMessage('Sorry, this user has been locked out.');
        } else {
            test.skip('Locked out user test only for QA environment');
        }
    });
});
