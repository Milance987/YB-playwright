/** @format */

import { expect, Locator, Page } from '@playwright/test';
import { ValidationType } from './types';

export { ValidationType };

export type PracticeFormData = {
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  dateOfBirth?: string;
  subjects?: string[];
  hobbies?: string[];
  picture?: string;
  currentAddress: string;
  state?: string;
  city?: string;
  validationType?: ValidationType;
};

export class PracticePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly genderOtherRadio: Locator;
  readonly mobileNumberInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsCombobox: Locator;
  readonly sportsCheckbox: Locator;
  readonly readingCheckbox: Locator;
  readonly musicCheckbox: Locator;
  readonly pictureInput: Locator;
  readonly currentAddressInput: Locator;
  readonly stateCombobox: Locator;
  readonly cityCombobox: Locator;
  readonly submitButton: Locator;
  readonly successModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[placeholder="First Name"]');
    this.lastNameInput = page.locator('input[placeholder="Last Name"]');
    this.emailInput = page.locator('input[placeholder="name@example.com"]');
    this.genderMaleRadio = page.locator('input[value="Male"]');
    this.genderFemaleRadio = page.locator('input[value="Female"]');
    this.genderOtherRadio = page.locator('input[value="Other"]');
    this.mobileNumberInput = page.locator('input[placeholder="Mobile Number"]');
    this.dateOfBirthInput = page.locator('#dateOfBirth');
    this.subjectsCombobox = page.locator('#subjectsInput');
    this.sportsCheckbox = page.locator('input[value="1"]');
    this.readingCheckbox = page.locator('input[value="2"]');
    this.musicCheckbox = page.locator('input[value="3"]');
    this.pictureInput = page.locator('input[type="file"]');
    this.currentAddressInput = page.locator('textarea[placeholder="Current Address"]');
    this.stateCombobox = page.locator('#state');
    this.cityCombobox = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.successModal = page.locator('.modal-body');
  }

  async goto(): Promise<void> {
    await this.page.goto('/automation-practice-form');
  }

  async fillForm(data: PracticeFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);

    // Select gender
    if (data.gender === 'Male') {
      await this.genderMaleRadio.click();
    } else if (data.gender === 'Female') {
      await this.genderFemaleRadio.click();
    } else if (data.gender === 'Other') {
      await this.genderOtherRadio.click();
    }

    // Fill mobile number
    await this.mobileNumberInput.fill(data.mobileNumber);

    // Fill current address
    await this.currentAddressInput.fill(data.currentAddress);

    // Select hobbies
    if (data.hobbies) {
      for (const hobby of data.hobbies) {
        if (hobby === 'Sports') {
          await this.sportsCheckbox.click();
        } else if (hobby === 'Reading') {
          await this.readingCheckbox.click();
        } else if (hobby === 'Music') {
          await this.musicCheckbox.click();
        }
      }
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.successModal).toBeVisible();
  }

  async expectFormRejection(): Promise<void> {
    const successVisible = await this.successModal.isVisible().catch(() => false);
    expect(successVisible).toBeFalsy();
  }

  async getFirstNameError(): Promise<string | null> {
    const error = this.page
      .locator('input[placeholder="First Name"]')
      .locator('.. >> .invalid-feedback');
    const isVisible = await error.isVisible().catch(() => false);
    return isVisible ? await error.textContent() : null;
  }
}
