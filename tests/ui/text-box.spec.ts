/** @format */

import { test } from '@playwright/test';
import { TextBoxFlow } from '../../flows/textBoxFlow';
import { TextBoxPage } from '../../pages/textBoxPage';

test.describe('Task 4 - DemoQA Text Box', () => {
  test('fills form, submits, and validates displayed values', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const textBoxFlow = new TextBoxFlow(textBoxPage);

    const formData = {
      fullName: 'Petar Petrovic',
      email: 'petar.petrovic@example.com',
      currentAddress: 'Bulevar Oslobodjenja 10, Novi Sad',
      permanentAddress: 'Knez Mihailova 5, Beograd',
    };

    await textBoxFlow.completeAndSubmitForm(formData);
    await textBoxPage.expectSubmittedValues(formData);
  });
});
