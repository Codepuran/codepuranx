import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { errorResponseSchema } from '../schemas/common.js';
import {
  type CreateRoleBody,
  createRoleBodySchema,
  type RoleParams,
  roleParamsSchema,
  roleResponseSchema,
  type UpdateRoleBody,
  updateRoleBodySchema,
} from '../schemas/role.js';

const commonErrors = { 400: errorResponseSchema, 404: errorResponseSchema, 409: errorResponseSchema };

export const registerRoleRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateRoleBody }>(
    '/roles',
    {
      schema: {
        body: createRoleBodySchema,
        response: { 201: roleResponseSchema, ...commonErrors },
        summary: 'Create role',
        tags: ['roles'],
      },
      preHandler: [app.authorize('admin')],
    },
    async (request, reply) => {
      const role = await app.services.role.create({ id: randomUUID(), name: request.body.name });

      return reply.code(201).send(role);
    }
  );

  app.get<{ Params: RoleParams }>(
    '/roles/:roleId',
    {
      schema: {
        params: roleParamsSchema,
        response: { 200: roleResponseSchema, ...commonErrors },
        summary: 'Get role',
        tags: ['roles'],
      },
      preHandler: [app.authenticate],
    },
    async (request) => {
      return app.services.role.getById(request.params.roleId);
    }
  );

  app.patch<{ Body: UpdateRoleBody; Params: RoleParams }>(
    '/roles/:roleId',
    {
      schema: {
        body: updateRoleBodySchema,
        params: roleParamsSchema,
        response: { 200: roleResponseSchema, ...commonErrors },
        summary: 'Update role',
        tags: ['roles'],
      },
      preHandler: [app.authorize('admin')],
    },
    async (request) => {
      return app.services.role.update(request.params.roleId, request.body);
    }
  );

  app.delete<{ Params: RoleParams }>(
    '/roles/:roleId',
    {
      schema: {
        params: roleParamsSchema,
        response: { 204: { type: 'null' }, ...commonErrors },
        summary: 'Delete role',
        tags: ['roles'],
      },
      preHandler: [app.authorize('admin')],
    },
    async (request, reply) => {
      await app.services.role.delete(request.params.roleId);
      return reply.code(204).send();
    }
  );
};
