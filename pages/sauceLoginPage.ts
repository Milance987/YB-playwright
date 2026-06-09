/** @format */

import { expect, Locator, Page } from '@playwright/test';

export class SauceLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly appLogo: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.appLogo = page.locator('.app_logo');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.appLogo).toHaveText('Swag Labs');
  }

  async expectLockedOut(baseUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(baseUrl);
    await expect(this.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  }
}
