/** @format */

import { expect, test } from '@playwright/test';
import { DynamicLoadingPage } from '../../pages/dynamicLoadingPage';

const internetBaseUrl = process.env.BASE_URL_INTERNET;

test.describe('Case 5 - DOM State Driven Dynamic Loading', () => {
  test('validates UI updates on dynamic_loading/1 using only DOM state', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);

    await dynamicLoadingPage.goto(`${internetBaseUrl}/dynamic_loading/1`);

    await expect(dynamicLoadingPage.finishedMessage).toBeHidden();
    await dynamicLoadingPage.clickStart();

    await dynamicLoadingPage.expectLoadingVisible();
    await dynamicLoadingPage.expectLoadingHidden();
    await expect(dynamicLoadingPage.finishedMessage).toBeVisible();
    await dynamicLoadingPage.expectFinishedMessage('Hello World!');
  });

  test('validates UI updates on dynamic_loading/2 using only DOM state', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);

    await dynamicLoadingPage.goto(`${internetBaseUrl}/dynamic_loading/2`);

    await expect(dynamicLoadingPage.finishedMessage).toBeHidden();
    await dynamicLoadingPage.clickStart();

    await dynamicLoadingPage.expectLoadingVisible();
    await dynamicLoadingPage.expectLoadingHidden();
    await expect(dynamicLoadingPage.finishedMessage).toBeVisible();
    await dynamicLoadingPage.expectFinishedMessage('Hello World!');
  });
});
