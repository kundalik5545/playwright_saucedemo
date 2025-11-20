import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.inventoryList = page.locator('.inventory_list');
        this.inventoryItems = page.locator('.inventory_item');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.pageTitle = page.locator('.title');
    }

    async verifyInventoryPageLoaded() {
        await expect(this.pageTitle).toHaveText('Products');
        await expect(this.inventoryList).toBeVisible();
    }

    async getInventoryItemCount() {
        return await this.inventoryItems.count();
    }

    async getInventoryItemDetails(index) {
        const item = this.inventoryItems.nth(index);
        const title = await item.locator('.inventory_item_name').innerText();
        const description = await item.locator('.inventory_item_desc').innerText();
        const price = await item.locator('.inventory_item_price').innerText();
        const image = item.locator('img.inventory_item_img');
        const addToCartButton = item.locator('button[id^="add-to-cart"]');

        return {
            title,
            description,
            price,
            isImageVisible: await image.isVisible(),
            addToCartButton
        };
    }

    async addItemToCart(index) {
        const item = this.inventoryItems.nth(index);
        const addToCartBtn = item.locator('button[id^="add-to-cart"]');
        await addToCartBtn.click();
    }

    async navigateToCart() {
        await this.cartIcon.click();
    }
}
