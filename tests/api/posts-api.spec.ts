/** @format */

import { expect, test } from '@playwright/test';
import { buildApiHeaders, JSON_CONTENT_TYPE } from './api-headers';
import { getPostsUrl, isPostDto } from './posts-helper';

test.describe('API tests', () => {
  test('GET /posts returns 200 and valid payload shape', async ({ request }) => {
    const response = await request.get(getPostsUrl(), {
      headers: buildApiHeaders(),
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(JSON_CONTENT_TYPE);

    const body = (await response.json()) as unknown;
    expect(Array.isArray(body)).toBe(true);

    if (!Array.isArray(body)) {
      throw new Error('Expected response body to be an array.');
    }

    expect(body.length).toBeGreaterThan(0);

    const firstItem = body[0];
    expect(firstItem).toHaveProperty('id');
    expect(isPostDto(firstItem)).toBeTruthy();
  });
});
