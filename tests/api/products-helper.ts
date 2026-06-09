/** @format */

export const DUMMYJSON_BASE_URL = process.env.BASE_URL_DUMMYJSON || 'https://dummyjson.com';
export const PRODUCTS_PATH = '/products';

export type ProductPatchPayload = {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
};

export function getProductUrl(productId: number): string {
  return new URL(`${PRODUCTS_PATH}/${productId}`, DUMMYJSON_BASE_URL).toString();
}

export function isProductRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}
