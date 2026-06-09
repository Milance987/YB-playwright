/** @format */

import { expect, test } from '@playwright/test';
import { buildApiHeaders, JSON_CONTENT_TYPE } from './api-headers';
import { ProductPatchPayload, getProductUrl, isProductRecord } from './products-helper';

test.describe('Case 4 - Race Condition on Shared Data', () => {
  test('validates concurrent modifications on the same product', async ({ request }) => {
    const productId = 1;
    const productUrl = getProductUrl(productId);

    const userAPayload: ProductPatchPayload = {
      title: 'Concurrent Update by User A',
      price: 777,
    };

    const userBPayload: ProductPatchPayload = {
      title: 'Concurrent Update by User B',
      stock: 55,
    };

    const [userAResponse, userBResponse] = await Promise.all([
      request.patch(productUrl, {
        headers: buildApiHeaders({ 'X-Actor': 'user_a' }),
        data: userAPayload,
      }),
      request.patch(productUrl, {
        headers: buildApiHeaders({ 'X-Actor': 'user_b' }),
        data: userBPayload,
      }),
    ]);

    expect(userAResponse.status()).toBe(200);
    expect(userBResponse.status()).toBe(200);
    expect(userAResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);
    expect(userBResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);

    const userABody = (await userAResponse.json()) as unknown;
    const userBBody = (await userBResponse.json()) as unknown;

    expect(isProductRecord(userABody)).toBeTruthy();
    expect(isProductRecord(userBBody)).toBeTruthy();

    if (!isProductRecord(userABody) || !isProductRecord(userBBody)) {
      throw new Error('Expected both responses to be JSON objects.');
    }

    expect(userABody.id).toBe(productId);
    expect(userBBody.id).toBe(productId);
    expect(userABody.title).toBe(userAPayload.title);
    expect(userABody.price).toBe(userAPayload.price);
    expect(userBBody.title).toBe(userBPayload.title);
    expect(userBBody.stock).toBe(userBPayload.stock);

    const postRaceReadResponse = await request.get(productUrl, {
      headers: buildApiHeaders(),
    });

    expect(postRaceReadResponse.status()).toBe(200);
    expect(postRaceReadResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);
  });

  test('handles concurrent valid and invalid product update requests independently', async ({
    request,
  }) => {
    const validProductId = 1;
    const invalidProductId = 999999;

    const validProductUrl = getProductUrl(validProductId);
    const invalidProductUrl = getProductUrl(invalidProductId);

    const validPayload: ProductPatchPayload = {
      title: 'Concurrent Valid Update',
      stock: 44,
    };

    const invalidPayload: ProductPatchPayload = {
      title: 'Concurrent Invalid Update',
      price: 888,
    };

    const [validResponse, invalidResponse] = await Promise.all([
      request.patch(validProductUrl, {
        headers: buildApiHeaders({ 'X-Actor': 'valid_actor' }),
        data: validPayload,
      }),
      request.patch(invalidProductUrl, {
        headers: buildApiHeaders({ 'X-Actor': 'invalid_actor' }),
        data: invalidPayload,
      }),
    ]);

    expect(validResponse.status()).toBe(200);
    expect(validResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);

    // Negative expectation: invalid resource update must fail cleanly.
    expect(invalidResponse.status()).toBe(404);
    expect(invalidResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);

    const validBody = (await validResponse.json()) as unknown;
    expect(isProductRecord(validBody)).toBeTruthy();

    if (!isProductRecord(validBody)) {
      throw new Error('Expected valid actor response to be a JSON object.');
    }

    expect(validBody.id).toBe(validProductId);
    expect(validBody.title).toBe(validPayload.title);
    expect(validBody.stock).toBe(validPayload.stock);

    const postRaceReadResponse = await request.get(validProductUrl, {
      headers: buildApiHeaders(),
    });

    expect(postRaceReadResponse.status()).toBe(200);
    expect(postRaceReadResponse.headers()['content-type']).toContain(JSON_CONTENT_TYPE);
  });
});
