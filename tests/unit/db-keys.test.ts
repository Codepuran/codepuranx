import { roleKey, todoKey, userEmailUniqueKey, userKey, userTodoSortKeyPrefix } from '../../src/db/keys.js';

describe('DynamoDB keys', () => {
  it('builds primary keys for v1 entities', () => {
    expect(userKey('u1')).toEqual({ pk: 'USER#u1', sk: 'PROFILE' });
    expect(roleKey('admin')).toEqual({ pk: 'ROLE#admin', sk: 'PROFILE' });
    expect(todoKey('u1', 't1')).toEqual({ pk: 'USER#u1', sk: 'TODO#t1' });
    expect(userTodoSortKeyPrefix()).toBe('TODO#');
  });

  it('normalizes user email uniqueness keys', () => {
    expect(userEmailUniqueKey('  Person@Example.COM ')).toEqual({ pk: 'USER_EMAIL#person@example.com', sk: 'UNIQUE' });
  });
});
