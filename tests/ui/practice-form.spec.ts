/** @format */

import { test, expect } from '@playwright/test';
import { PracticePage } from '../../pages/practicePage';
import { ValidationType } from '../../pages/types';
import { PracticeFlow } from '../../flows/practiceFlow';
import { practiceFormPositiveData, practiceFormNegativeData } from './testData/practiceFormData';

test.describe('Practice Form - Positive Cases', () => {
  let practicePage: PracticePage;
  let practiceFlow: PracticeFlow;

  test.beforeEach(async ({ page }) => {
    practicePage = new PracticePage(page);
    practiceFlow = new PracticeFlow(practicePage);
  });

  for (const data of practiceFormPositiveData) {
    test(`[POSITIVE] ${data.name}`, async () => {
      const { name, ...formData } = data;

      await practiceFlow.completeAndSubmitForm(formData);
    });
  }
});

test.describe('Practice Form - Negative Cases', () => {
  let practicePage: PracticePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PracticePage(page);
  });

  for (const data of practiceFormNegativeData) {
    test(`[NEGATIVE] ${data.name}`, async () => {
      const { name, validationType, ...formData } = data;

      await practicePage.goto();
      await practicePage.fillForm(formData);
      await practicePage.submit();

      switch (validationType) {
        case ValidationType.FirstNameWhitespace: {
          const value = await practicePage.firstNameInput.inputValue();
          expect(value.trim()).toBe('');
          break;
        }

        case ValidationType.LastNameWhitespace: {
          const value = await practicePage.lastNameInput.inputValue();
          expect(value.trim()).toBe('');
          break;
        }

        case ValidationType.MobileLeadingZero: {
          const value = await practicePage.mobileNumberInput.inputValue();
          expect(value).toMatch(/^0/);
          break;
        }

        default:
          await practicePage.expectFormRejection();
      }
    });
  }
});
