/** @format */

import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../../pages/dynamicLoadingPage';

const internetBaseUrl = process.env.BASE_URL_INTERNET || 'https://the-internet.herokuapp.com';

test.describe('Case 3 - Network Instability and UI Resilience', () => {
  test('handles successful dynamic loading with normal network', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);

    await dynamicLoadingPage.goto(`${internetBaseUrl}/dynamic_loading/1`);
    await dynamicLoadingPage.clickStart();

    await dynamicLoadingPage.expectLoadingVisible();
    await dynamicLoadingPage.waitForLoadingCompletion();
    await dynamicLoadingPage.expectFinishedMessage('Hello World!');
  });

  test('handles UI during delayed network response', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);

    // Intercept and delay only AJAX/fetch requests by 3 seconds
    await page.route('**/*', async (route) => {
      const type = route.request().resourceType();

      if (type === 'xhr' || type === 'fetch') {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      await route.continue();
    });

    await dynamicLoadingPage.goto(`${internetBaseUrl}/dynamic_loading/2`);
    await dynamicLoadingPage.clickStart();

    await dynamicLoadingPage.expectLoadingVisible();
    await dynamicLoadingPage.waitForLoadingCompletion(15000);
    await dynamicLoadingPage.expectFinishedMessage('Hello World!');
  });

  test('gracefully handles failed network requests', async ({ page }) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);

    // Abort specific AJAX/XHR requests to simulate failure
    await page.route('**/dynamic_loading/**', async (route) => {
      if (route.request().resourceType() === 'xhr' || route.request().resourceType() === 'fetch') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    await dynamicLoadingPage.goto(`${internetBaseUrl}/dynamic_loading/1`);
    await dynamicLoadingPage.clickStart();

    // Loading should appear but not complete due to failed request
    await dynamicLoadingPage.expectLoadingVisible();

    // Wait a bit to ensure loading doesn't complete
    await page.waitForTimeout(3000);
    await dynamicLoadingPage.expectLoadingVisible();
    await expect(dynamicLoadingPage.finishedMessage).not.toBeVisible();
  });
});
