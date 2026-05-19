import type { JSONSchema } from 'json-schema-to-ts';
import type { SchemaType } from './common.js';

export const loginBodySchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 320 },
    password: { type: 'string', minLength: 1, maxLength: 200 },
  },
} as const satisfies JSONSchema;

export type LoginBody = SchemaType<typeof loginBodySchema>;

export const loginResponseSchema = {
  type: 'object',
  required: ['accessToken', 'tokenType'],
  additionalProperties: false,
  properties: { accessToken: { type: 'string' }, tokenType: { type: 'string', const: 'Bearer' } },
} as const satisfies JSONSchema;

export type LoginResponse = SchemaType<typeof loginResponseSchema>;
