import { roleFromRecord, todoFromRecord, userFromRecord } from '../../src/repositories/records.js';

describe('repository record mappers', () => {
  it('maps user records to domain users', () => {
    expect(
      userFromRecord({
        pk: 'USER#u1',
        sk: 'PROFILE',
        entityType: 'USER',
        id: 'u1',
        email: 'person@example.com',
        name: 'Person',
        roleIds: ['admin'],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        version: 1,
      })
    ).toEqual({
      id: 'u1',
      email: 'person@example.com',
      name: 'Person',
      roleIds: ['admin'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      version: 1,
    });
  });

  it('maps role records to domain roles', () => {
    expect(
      roleFromRecord({
        pk: 'ROLE#admin',
        sk: 'PROFILE',
        entityType: 'ROLE',
        id: 'admin',
        name: 'Admin',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        version: 1,
      })
    ).toEqual({
      id: 'admin',
      name: 'Admin',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      version: 1,
    });
  });

  it('maps todo records to domain todos', () => {
    expect(
      todoFromRecord({
        pk: 'USER#u1',
        sk: 'TODO#t1',
        entityType: 'TODO',
        id: 't1',
        userId: 'u1',
        title: 'Task',
        status: 'open',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        version: 1,
      })
    ).toEqual({
      id: 't1',
      userId: 'u1',
      title: 'Task',
      status: 'open',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      version: 1,
    });
  });
});
