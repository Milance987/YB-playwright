/** @format */

export const API_BASE_URL = process.env.BASE_URL_API || 'https://jsonplaceholder.typicode.com';
export const POSTS_PATH = '/posts';

export type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export function getPostsUrl(): string {
  return new URL(POSTS_PATH, API_BASE_URL).toString();
}

export function isPostDto(value: unknown): value is PostDto {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const post = value as Record<string, unknown>;
  return (
    typeof post.userId === 'number' &&
    typeof post.id === 'number' &&
    typeof post.title === 'string' &&
    typeof post.body === 'string'
  );
}
