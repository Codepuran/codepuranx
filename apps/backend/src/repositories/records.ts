import type { Role } from '../domain/role.js';
import type { Todo } from '../domain/todo.js';
import type { User } from '../domain/user.js';

export type EntityType = 'ROLE' | 'TODO' | 'USER' | 'USER_EMAIL';

type BaseRecord = {
  pk: string;
  sk: string;
  entityType: EntityType;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type UserRecord = BaseRecord & {
  entityType: 'USER';
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  roleIds: string[];
};

export type UserEmailUniqueRecord = { pk: string; sk: string; entityType: 'USER_EMAIL'; email: string; userId: string };

export type RoleRecord = BaseRecord & { entityType: 'ROLE'; id: string; name: string };

export type TodoRecord = BaseRecord & {
  entityType: 'TODO';
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: Todo['status'];
};

export const isUserRecord = (item: unknown): item is UserRecord => {
  return typeof item === 'object' && item !== null && 'entityType' in item && item.entityType === 'USER';
};

export const isRoleRecord = (item: unknown): item is RoleRecord => {
  return typeof item === 'object' && item !== null && 'entityType' in item && item.entityType === 'ROLE';
};

export const isTodoRecord = (item: unknown): item is TodoRecord => {
  return typeof item === 'object' && item !== null && 'entityType' in item && item.entityType === 'TODO';
};

export const userFromRecord = (record: UserRecord): User => ({
  id: record.id,
  email: record.email,
  name: record.name,
  roleIds: record.roleIds,
  ...(record.passwordHash ? { passwordHash: record.passwordHash } : {}),
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  version: record.version,
});

export const roleFromRecord = (record: RoleRecord): Role => ({
  id: record.id,
  name: record.name,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  version: record.version,
});

export const todoFromRecord = (record: TodoRecord): Todo => ({
  id: record.id,
  userId: record.userId,
  title: record.title,
  ...(record.description ? { description: record.description } : {}),
  status: record.status,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  version: record.version,
});
