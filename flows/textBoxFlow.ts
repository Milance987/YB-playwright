/** @format */

import { TextBoxData, TextBoxPage } from '../pages/textBoxPage';

export class TextBoxFlow {
  readonly textBoxPage: TextBoxPage;

  constructor(textBoxPage: TextBoxPage) {
    this.textBoxPage = textBoxPage;
  }

  async completeAndSubmitForm(data: TextBoxData): Promise<void> {
    await this.textBoxPage.goto();
    await this.textBoxPage.fillForm(data);
    await this.textBoxPage.submit();
    await this.textBoxPage.expectSubmittedValues(data);
  }
}
