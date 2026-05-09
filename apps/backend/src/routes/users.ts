import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { errorResponseSchema } from '../schemas/common.js';
import {
  type CreateUserBody,
  createUserBodySchema,
  type UpdateUserBody,
  type UserParams,
  updateUserBodySchema,
  userParamsSchema,
  userResponseSchema,
} from '../schemas/user.js';

const commonErrors = { 400: errorResponseSchema, 404: errorResponseSchema, 409: errorResponseSchema };

export const registerUserRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateUserBody }>(
    '/users',
    {
      schema: {
        body: createUserBodySchema,
        response: { 201: userResponseSchema, ...commonErrors },
        summary: 'Create user',
        tags: ['users'],
      },
    },
    async (request, reply) => {
      const user = await app.services.user.create({
        id: randomUUID(),
        email: request.body.email,
        name: request.body.name,
        ...(request.body.roleIds ? { roleIds: request.body.roleIds } : {}),
      });

      return reply.code(201).send(user);
    }
  );

  app.get<{ Params: UserParams }>(
    '/users/:userId',
    {
      schema: {
        params: userParamsSchema,
        response: { 200: userResponseSchema, ...commonErrors },
        summary: 'Get user',
        tags: ['users'],
      },
    },
    async (request) => {
      return app.services.user.getById(request.params.userId);
    }
  );

  app.patch<{ Body: UpdateUserBody; Params: UserParams }>(
    '/users/:userId',
    {
      schema: {
        body: updateUserBodySchema,
        params: userParamsSchema,
        response: { 200: userResponseSchema, ...commonErrors },
        summary: 'Update user',
        tags: ['users'],
      },
    },
    async (request) => {
      return app.services.user.update(request.params.userId, request.body);
    }
  );

  app.delete<{ Params: UserParams }>(
    '/users/:userId',
    {
      schema: {
        params: userParamsSchema,
        response: { 204: { type: 'null' }, ...commonErrors },
        summary: 'Delete user',
        tags: ['users'],
      },
    },
    async (request, reply) => {
      await app.services.user.delete(request.params.userId);
      return reply.code(204).send();
    }
  );
};
