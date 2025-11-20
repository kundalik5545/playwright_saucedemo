import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import fs from 'fs';
import path from 'path';

// Load data
const loginData = JSON.parse(fs.readFileSync(path.resolve('data', 'loginData.json'), 'utf-8'));
const inventoryData = JSON.parse(fs.readFileSync(path.resolve('data', 'inventoryData.json'), 'utf-8'));

const ENV = process.env.ENV || 'qa';
const user = loginData[ENV].validUser;

test.describe('SauceDemo Shopping Flow', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        console.log(`Starting test in ${ENV} environment`);
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await test.step('Navigate to Login Page', async () => {
            await loginPage.navigate();
        });

        await test.step('Login with valid credentials', async () => {
            await loginPage.login(user.username, user.password);
        });

        await test.step('Verify Inventory Page Loaded', async () => {
            await inventoryPage.verifyInventoryPageLoaded();
        });
    });

    test('should display 6 products with correct details', async () => {
        await test.step('Verify all 6 products are displayed with correct details', async () => {
            const count = await inventoryPage.getInventoryItemCount();
            expect(count).toBe(6);
            console.log(`Found ${count} products`);

            for (let i = 0; i < count; i++) {
                const item = await inventoryPage.getInventoryItemDetails(i);
                const expectedItem = inventoryData.products[i];

                console.log(`Verifying product: ${item.title}`);
                expect(item.title).toBe(expectedItem.title);
                expect(item.description).toBe(expectedItem.description);
                expect(item.price).toBe(expectedItem.price);
                expect(item.isImageVisible).toBeTruthy();
                await expect(item.addToCartButton).toBeVisible();
            }
        });
    });

    test('should add first product to cart and verify', async () => {
        await test.step('Add first product to cart', async () => {
            console.log('Adding first product to cart');
            await inventoryPage.addItemToCart(0);
        });

        await test.step('Navigate to Cart Page', async () => {
            console.log('Navigating to cart');
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
        });

        await test.step('Verify product in cart', async () => {
            const cartItem = await cartPage.getCartItemDetails(0);
            const expectedItem = inventoryData.products[0];

            console.log(`Verifying cart item: ${cartItem.title}`);
            expect(cartItem.title).toBe(expectedItem.title);
            expect(cartItem.description).toBe(expectedItem.description);
            expect(cartItem.price).toBe(expectedItem.price);
        });
    });

    test('negative scenario: cart should be empty if no items added', async ({ page }) => {
        await test.step('Navigate to Cart Page without adding items', async () => {
            console.log('Navigating to cart without adding items');
            await inventoryPage.navigateToCart();
            await cartPage.verifyCartPageLoaded();
        });

        await test.step('Verify cart is empty', async () => {
            const count = await page.locator('.cart_item').count();
            console.log(`Cart item count: ${count}`);
            expect(count).toBe(0);
        });
    });

    test.afterEach(async ({ page }) => {
        console.log('Test finished, cleaning up...');
        // Browser context closes automatically, but we can add specific cleanup if needed
        // For example, logging out (optional)
    });
});
