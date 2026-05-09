import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type SchemaType<TSchema extends JSONSchema> = FromSchema<TSchema>;

export const idParamSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: { id: { type: 'string', minLength: 1, pattern: '\\S' } },
} as const satisfies JSONSchema;

export type IdParams = SchemaType<typeof idParamSchema>;

export const paginationQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    cursor: { type: 'string', minLength: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  },
} as const satisfies JSONSchema;

export type PaginationQuery = SchemaType<typeof paginationQuerySchema>;

export const timestampSchema = { type: 'string', format: 'date-time' } as const satisfies JSONSchema;

export const errorResponseSchema = {
  type: 'object',
  required: ['error'],
  additionalProperties: false,
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'requestId', 'statusCode'],
      additionalProperties: false,
      properties: {
        code: { type: 'string' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              instancePath: { type: 'string' },
              keyword: { type: 'string' },
              message: { type: 'string' },
              schemaPath: { type: 'string' },
            },
          },
        },
        message: { type: 'string' },
        requestId: { type: 'string' },
        statusCode: { type: 'integer' },
      },
    },
  },
} as const satisfies JSONSchema;

export type ErrorResponse = SchemaType<typeof errorResponseSchema>;
