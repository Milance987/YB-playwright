/** @format */

import { PracticeFormData, PracticePage } from '../pages/practicePage';

export class PracticeFlow {
  readonly practicePage: PracticePage;

  constructor(practicePage: PracticePage) {
    this.practicePage = practicePage;
  }

  async completeAndSubmitForm(data: PracticeFormData): Promise<void> {
    await this.practicePage.goto();
    await this.practicePage.fillForm(data);
    await this.practicePage.submit();
    await this.practicePage.expectSuccessMessage();
  }
}
