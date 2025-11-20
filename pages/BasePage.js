export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path = '/') {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }

    async wait(time) {
        await this.page.waitForTimeout(time);
    }
}

