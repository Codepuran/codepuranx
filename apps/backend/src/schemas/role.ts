import type { JSONSchema } from 'json-schema-to-ts';
import { type SchemaType, timestampSchema } from './common.js';

export const roleParamsSchema = {
  type: 'object',
  required: ['roleId'],
  additionalProperties: false,
  properties: { roleId: { type: 'string', minLength: 1, pattern: '\\S' } },
} as const satisfies JSONSchema;

export type RoleParams = SchemaType<typeof roleParamsSchema>;

export const createRoleBodySchema = {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200 },
  },
} as const satisfies JSONSchema;

export type CreateRoleBody = SchemaType<typeof createRoleBodySchema>;

export const updateRoleBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 200 },
  },
} as const satisfies JSONSchema;

export type UpdateRoleBody = SchemaType<typeof updateRoleBodySchema>;

export const roleResponseSchema = {
  type: 'object',
  required: ['id', 'name', 'createdAt', 'updatedAt', 'version'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
    version: { type: 'integer', minimum: 1 },
  },
} as const satisfies JSONSchema;
