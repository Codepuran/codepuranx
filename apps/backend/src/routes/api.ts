import type { FastifyPluginAsync } from 'fastify';
import { type ApiInfoResponse, apiInfoResponseSchema } from '../schemas/api.js';
import { type IdParams, idParamSchema } from '../schemas/common.js';
import { registerRoleRoutes } from './roles.js';
import { registerTodoRoutes } from './todos.js';
import { registerUserRoutes } from './users.js';
import { registerAuthRoutes } from './auth.js';

export const registerApiRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/',
    { schema: { response: { 200: apiInfoResponseSchema }, summary: 'API info', tags: ['api'] } },
    async (): Promise<ApiInfoResponse> => {
      return { name: 'codepuranx-api', version: 'v1' };
    }
  );

  app.get<{ Params: IdParams }>(
    '/validation-check/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: {
            type: 'object',
            required: ['id'],
            additionalProperties: false,
            properties: { id: { type: 'string' } },
          },
        },
        summary: 'Validate route params',
        tags: ['api'],
      },
    },
    async (request) => {
      return { id: request.params.id };
    }
  );

  await app.register(registerUserRoutes);
  await app.register(registerRoleRoutes);
  await app.register(registerTodoRoutes);
  await app.register(registerAuthRoutes);
};
