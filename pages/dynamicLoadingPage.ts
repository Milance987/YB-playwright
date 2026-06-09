/** @format */

import { expect, Locator, Page } from '@playwright/test';

export class DynamicLoadingPage {
  readonly page: Page;
  readonly startButton: Locator;
  readonly loadingSpinner: Locator;
  readonly finishedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startButton = page.locator('button:has-text("Start")');
    this.loadingSpinner = page.locator('#loading');
    this.finishedMessage = page.locator('#finish');
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async clickStart(): Promise<void> {
    await this.startButton.click();
  }

  async expectLoadingVisible(): Promise<void> {
    await expect(this.loadingSpinner).toBeVisible();
  }

  async expectLoadingHidden(timeout: number = 10000): Promise<void> {
    await expect(this.loadingSpinner).toBeHidden({ timeout });
  }

  async expectFinishedMessage(expectedText: string): Promise<void> {
    await expect(this.finishedMessage).toContainText(expectedText);
  }

  async waitForLoadingCompletion(timeout: number = 10000): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout });
  }
}
