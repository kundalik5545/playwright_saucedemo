import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
        this.errorMessage = page.locator('[data-test="error"]');
        this.pageTitle = page.locator('.title');
    }

    async verifyCheckoutStepOneLoaded() {
        await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    }

    async verifyCheckoutStepTwoLoaded() {
        await expect(this.pageTitle).toHaveText('Checkout: Overview');
    }

    async enterCheckoutInfo(firstName, lastName, postalCode) {
        if (firstName) await this.firstNameInput.fill(firstName);
        if (lastName) await this.lastNameInput.fill(lastName);
        if (postalCode) await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async verifyOrderComplete() {
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
        await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    }

    async verifyErrorMessage(message) {
        await expect(this.errorMessage).toContainText(message);
    }
}
