import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import fs from 'fs';
import path from 'path';

// Load test data from JSON files
const loginData = JSON.parse(fs.readFileSync(path.resolve('data', 'loginData.json'), 'utf-8'));
const checkoutData = JSON.parse(fs.readFileSync(path.resolve('data', 'checkoutData.json'), 'utf-8'));

// Get environment from process.env or default to 'qa'
const ENV = process.env.ENV || 'qa';
const user = loginData[ENV].validUser;

test.describe('SauceDemo E2E Shopping Flow', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        console.log(`Starting E2E test in ${ENV} environment`);

        // Initialize page objects
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Navigate to the application
        await test.step('Navigate to Login Page', async () => {
            await loginPage.navigate();
        });

        // Login with valid credentials
        await test.step('Login with valid credentials', async () => {
            console.log(`Logging in as: ${user.username}`);
            await loginPage.login(user.username, user.password);
        });

        // Verify inventory page loaded
        await test.step('Verify Inventory Page Loaded', async () => {
            await inventoryPage.verifyInventoryPageLoaded();
        });
    });

    test('should complete full E2E shopping flow successfully', async () => {
        await test.step('Add first product to cart', async () => {
            console.log('Adding first product to cart');
            await inventoryPage.addItemToCart(0);
        });

        await test.step('Navigate to Cart Page', async () => {
            console.log('Navigating to cart page');
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
        });

        await test.step('Proceed to Checkout', async () => {
            console.log('Proceeding to checkout');
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutStepOneLoaded();
        });

        await test.step('Enter checkout information', async () => {
            console.log('Entering checkout information');
            await checkoutPage.enterCheckoutInfo(
                checkoutData.valid.firstName,
                checkoutData.valid.lastName,
                checkoutData.valid.postalCode
            );
            await checkoutPage.verifyCheckoutStepTwoLoaded();
        });

        await test.step('Finish checkout', async () => {
            console.log('Finishing checkout');
            await checkoutPage.finishCheckout();
        });

        await test.step('Verify order completion', async () => {
            console.log('Verifying order completion');
            await checkoutPage.verifyOrderComplete();
        });
    });

    test('negative scenario: should show error when first name is missing', async () => {
        await test.step('Add product and navigate to checkout', async () => {
            console.log('Adding product to cart');
            await inventoryPage.addItemToCart(0);
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutStepOneLoaded();
        });

        await test.step('Try to continue without first name', async () => {
            console.log('Attempting checkout without first name');
            await checkoutPage.enterCheckoutInfo(
                checkoutData.missingFirstName.firstName,
                checkoutData.missingFirstName.lastName,
                checkoutData.missingFirstName.postalCode
            );
        });

        await test.step('Verify error message', async () => {
            console.log('Verifying error message for missing first name');
            await checkoutPage.verifyErrorMessage(checkoutData.missingFirstName.error);
        });
    });

    test('negative scenario: should show error when last name is missing', async () => {
        await test.step('Add product and navigate to checkout', async () => {
            console.log('Adding product to cart');
            await inventoryPage.addItemToCart(0);
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutStepOneLoaded();
        });

        await test.step('Try to continue without last name', async () => {
            console.log('Attempting checkout without last name');
            await checkoutPage.enterCheckoutInfo(
                checkoutData.missingLastName.firstName,
                checkoutData.missingLastName.lastName,
                checkoutData.missingLastName.postalCode
            );
        });

        await test.step('Verify error message', async () => {
            console.log('Verifying error message for missing last name');
            await checkoutPage.verifyErrorMessage(checkoutData.missingLastName.error);
        });
    });

    test('negative scenario: should show error when postal code is missing', async () => {
        await test.step('Add product and navigate to checkout', async () => {
            console.log('Adding product to cart');
            await inventoryPage.addItemToCart(0);
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
            await cartPage.proceedToCheckout();
            await checkoutPage.verifyCheckoutStepOneLoaded();
        });

        await test.step('Try to continue without postal code', async () => {
            console.log('Attempting checkout without postal code');
            await checkoutPage.enterCheckoutInfo(
                checkoutData.missingPostalCode.firstName,
                checkoutData.missingPostalCode.lastName,
                checkoutData.missingPostalCode.postalCode
            );
        });

        await test.step('Verify error message', async () => {
            console.log('Verifying error message for missing postal code');
            await checkoutPage.verifyErrorMessage(checkoutData.missingPostalCode.error);
        });
    });

    test.afterEach(async ({ page }) => {
        console.log('E2E test finished, cleaning up...');
        // Browser context closes automatically after each test
    });
});
