import type { Role } from '../../src/domain/role.js';
import type { Todo } from '../../src/domain/todo.js';
import type { User } from '../../src/domain/user.js';

export const sampleTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'todo-1',
  userId: 'user-1',
  title: 'Task',
  status: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  version: 1,
  ...overrides,
});

export const sampleUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  email: 'user@example.com',
  name: 'User',
  roleIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  version: 1,
  ...overrides,
});

export const sampleRole = (overrides: Partial<Role> = {}): Role => ({
  id: 'role-1',
  name: 'Admin',
  permissions: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  version: 1,
  ...overrides,
});
