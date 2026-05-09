import type { FastifyPluginAsync } from 'fastify';
import { type ApiInfoResponse, apiInfoResponseSchema } from '../schemas/api.js';
import { type IdParams, idParamSchema } from '../schemas/common.js';

export const registerApiRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { schema: { response: { 200: apiInfoResponseSchema } } }, async (): Promise<ApiInfoResponse> => {
    return { name: 'codepuranx-api', version: 'v1' };
  });

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
      },
    },
    async (request) => {
      return { id: request.params.id };
    }
  );
};
