/** @format */

import { expect, Locator, Page } from '@playwright/test';

export type TextBoxData = {
  fullName: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
};

export class TextBoxPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly currentAddressInput: Locator;
  readonly permanentAddressInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.getByPlaceholder('Full Name');
    this.emailInput = page.getByPlaceholder('name@example.com');
    this.currentAddressInput = page.getByPlaceholder('Current Address');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
  }

  async goto(): Promise<void> {
    await this.page.goto('/text-box');
  }

  async fillForm(data: TextBoxData): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.currentAddressInput.fill(data.currentAddress);
    await this.permanentAddressInput.fill(data.permanentAddress);
  }

  async submit(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async expectSubmittedValues(data: TextBoxData): Promise<void> {
    await expect(this.page.locator('#name')).toHaveText(`Name:${data.fullName}`);
    await expect(this.page.locator('#email')).toHaveText(`Email:${data.email}`);
    await expect(this.page.locator('p#currentAddress')).toHaveText(
      `Current Address :${data.currentAddress}`
    );
    await expect(this.page.locator('p#permanentAddress')).toHaveText(
      `Permananet Address :${data.permanentAddress}`
    );
  }
}
