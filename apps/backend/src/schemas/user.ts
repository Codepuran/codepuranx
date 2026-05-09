import type { JSONSchema } from 'json-schema-to-ts';
import { type SchemaType, timestampSchema } from './common.js';

export const userParamsSchema = {
  type: 'object',
  required: ['userId'],
  additionalProperties: false,
  properties: { userId: { type: 'string', minLength: 1, pattern: '\\S' } },
} as const satisfies JSONSchema;

export type UserParams = SchemaType<typeof userParamsSchema>;

export const createUserBodySchema = {
  type: 'object',
  required: ['email', 'name'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 320 },
    name: { type: 'string', minLength: 1, maxLength: 200 },
    roleIds: { type: 'array', items: { type: 'string', minLength: 1 }, uniqueItems: true, default: [] },
  },
} as const satisfies JSONSchema;

export type CreateUserBody = SchemaType<typeof createUserBodySchema>;

export const updateUserBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200 },
    roleIds: { type: 'array', items: { type: 'string', minLength: 1 }, uniqueItems: true },
  },
} as const satisfies JSONSchema;

export type UpdateUserBody = SchemaType<typeof updateUserBodySchema>;

export const userResponseSchema = {
  type: 'object',
  required: ['id', 'email', 'name', 'roleIds', 'createdAt', 'updatedAt', 'version'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    name: { type: 'string' },
    roleIds: { type: 'array', items: { type: 'string' } },
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
    version: { type: 'integer', minimum: 1 },
  },
} as const satisfies JSONSchema;
