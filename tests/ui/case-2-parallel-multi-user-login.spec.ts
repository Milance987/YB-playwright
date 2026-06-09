/** @format */

import { test, BrowserContext } from '@playwright/test';
import { SauceLoginPage } from '../../pages/sauceLoginPage';

const sauceDemoUrl = process.env.BASE_URL_SAUCE;
const commonPassword = process.env.SAUCE_PASSWORD;
const standardUser = process.env.SAUCE_STANDARD_USER;
const problemUser = process.env.SAUCE_PROBLEM_USER;

async function loginInIsolatedContext(
  context: BrowserContext,
  baseUrl: string,
  username: string,
  password: string
) {
  const page = await context.newPage();
  const sauceLoginPage = new SauceLoginPage(page);

  await sauceLoginPage.goto(baseUrl);
  await sauceLoginPage.login(username, password);

  return sauceLoginPage;
}

test.describe('Case 2 - Parallel Multi-User Login', () => {
  test('validates two successful logins in isolated contexts', async ({ browser }) => {
    if (!sauceDemoUrl || !commonPassword || !standardUser || !problemUser) {
      throw new Error(
        'Missing env vars: BASE_URL_SAUCE, SAUCE_PASSWORD, SAUCE_STANDARD_USER and/or SAUCE_PROBLEM_USER'
      );
    }

    const standardUserContext = await browser.newContext();
    const problemUserContext = await browser.newContext();

    try {
      const [standardUserLoginPage, problemUserLoginPage] = await Promise.all([
        loginInIsolatedContext(standardUserContext, sauceDemoUrl, standardUser, commonPassword),
        loginInIsolatedContext(problemUserContext, sauceDemoUrl, problemUser, commonPassword),
      ]);

      await standardUserLoginPage.expectSuccessfulLogin();
      await problemUserLoginPage.expectSuccessfulLogin();
    } finally {
      await Promise.all([standardUserContext.close(), problemUserContext.close()]);
    }
  });
});
