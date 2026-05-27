import { decodeCursor, encodeCursor, normalizeLimit } from '../../src/db/pagination.js';

describe('DynamoDB pagination', () => {
  it('round trips cursor keys', () => {
    const key = { pk: 'USER#u1', sk: 'TODO#t1' };
    const cursor = encodeCursor(key);

    expect(cursor).toBeDefined();
    expect(decodeCursor(cursor)).toEqual(key);
  });

  it('normalizes page limits', () => {
    expect(normalizeLimit(undefined)).toBe(20);
    expect(normalizeLimit(0)).toBe(1);
    expect(normalizeLimit(500)).toBe(100);
    expect(normalizeLimit(25)).toBe(25);
  });
});
