import type { JSONSchema } from 'json-schema-to-ts';
import { type paginationQuerySchema, type SchemaType, timestampSchema } from './common.js';

export const userTodoParamsSchema = {
  type: 'object',
  required: ['userId', 'todoId'],
  additionalProperties: false,
  properties: {
    userId: { type: 'string', minLength: 1, pattern: '\\S' },
    todoId: { type: 'string', minLength: 1, pattern: '\\S' },
  },
} as const satisfies JSONSchema;

export type UserTodoParams = SchemaType<typeof userTodoParamsSchema>;

export const userTodosParamsSchema = {
  type: 'object',
  required: ['userId'],
  additionalProperties: false,
  properties: { userId: { type: 'string', minLength: 1, pattern: '\\S' } },
} as const satisfies JSONSchema;

export type UserTodosParams = SchemaType<typeof userTodosParamsSchema>;

export const createTodoBodySchema = {
  type: 'object',
  required: ['title'],
  additionalProperties: false,
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
  },
} as const satisfies JSONSchema;

export type CreateTodoBody = SchemaType<typeof createTodoBodySchema>;

export const updateTodoBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    status: { type: 'string', enum: ['open', 'completed'] },
  },
} as const satisfies JSONSchema;

export type UpdateTodoBody = SchemaType<typeof updateTodoBodySchema>;

export const todoResponseSchema = {
  type: 'object',
  required: ['id', 'userId', 'title', 'status', 'createdAt', 'updatedAt', 'version'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    status: { type: 'string', enum: ['open', 'completed'] },
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
    version: { type: 'integer', minimum: 1 },
  },
} as const satisfies JSONSchema;

export const todoListResponseSchema = {
  type: 'object',
  required: ['items'],
  additionalProperties: false,
  properties: { items: { type: 'array', items: todoResponseSchema }, cursor: { type: 'string' } },
} as const satisfies JSONSchema;

export type TodoListQuery = SchemaType<typeof paginationQuerySchema>;
