import type { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';

export type DynamoCursorKey = Record<string, NativeAttributeValue>;

export type PageInput = { cursor?: string; limit?: number };

export type PageResult<T> = { cursor?: string; items: T[] };

export const encodeCursor = (key: DynamoCursorKey | undefined): string | undefined => {
  if (!key || Object.keys(key).length === 0) {
    return undefined;
  }

  return Buffer.from(JSON.stringify(key), 'utf8').toString('base64url');
};

export const decodeCursor = (cursor: string | undefined): DynamoCursorKey | undefined => {
  if (!cursor) {
    return undefined;
  }

  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return JSON.parse(decoded) as DynamoCursorKey;
};

export const normalizeLimit = (limit: number | undefined, fallback = 20, max = 100): number => {
  if (!Number.isInteger(limit) || typeof limit !== 'number') {
    return fallback;
  }

  return Math.min(Math.max(limit, 1), max);
};
