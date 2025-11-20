import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class CartPage extends BasePage {
    constructor(page) {
        super(page);
        this.cartItems = page.locator('.cart_item');
        this.pageTitle = page.locator('.title');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async verifyCartPageLoaded() {
        await expect(this.pageTitle).toHaveText('Your Cart');
    }

    async getCartItemDetails(index) {
        const item = this.cartItems.nth(index);
        const title = await item.locator('.inventory_item_name').innerText();
        const description = await item.locator('.inventory_item_desc').innerText();
        const price = await item.locator('.inventory_item_price').innerText();

        return {
            title,
            description,
            price
        };
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}
