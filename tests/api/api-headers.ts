/** @format */

export type ApiHeaders = Record<string, string>;

export const JSON_CONTENT_TYPE = 'application/json';

export function buildApiHeaders(overrides: ApiHeaders = {}): ApiHeaders {
  const headers: ApiHeaders = {
    Accept: JSON_CONTENT_TYPE,
    'Content-Type': JSON_CONTENT_TYPE,
  };

  const token = process.env.API_TOKEN;
  if (token && token !== 'replace_me') {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    ...headers,
    ...overrides,
  };
}
