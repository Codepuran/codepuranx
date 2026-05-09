import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { errorResponseSchema, paginationQuerySchema } from '../schemas/common.js';
import {
  type CreateTodoBody,
  createTodoBodySchema,
  type TodoListQuery,
  todoListResponseSchema,
  todoResponseSchema,
  type UpdateTodoBody,
  type UserTodoParams,
  type UserTodosParams,
  updateTodoBodySchema,
  userTodoParamsSchema,
  userTodosParamsSchema,
} from '../schemas/todo.js';

const commonErrors = { 400: errorResponseSchema, 404: errorResponseSchema, 409: errorResponseSchema };

export const registerTodoRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateTodoBody; Params: UserTodosParams }>(
    '/users/:userId/todos',
    {
      schema: {
        body: createTodoBodySchema,
        params: userTodosParamsSchema,
        response: { 201: todoResponseSchema, ...commonErrors },
        summary: 'Create todo',
        tags: ['todos'],
      },
    },
    async (request, reply) => {
      const todo = await app.services.todo.create({
        id: randomUUID(),
        userId: request.params.userId,
        title: request.body.title,
        ...(request.body.description ? { description: request.body.description } : {}),
      });

      return reply.code(201).send(todo);
    }
  );

  app.get<{ Params: UserTodosParams; Querystring: TodoListQuery }>(
    '/users/:userId/todos',
    {
      schema: {
        params: userTodosParamsSchema,
        querystring: paginationQuerySchema,
        response: { 200: todoListResponseSchema, ...commonErrors },
        summary: 'List user todos',
        tags: ['todos'],
      },
    },
    async (request) => {
      return app.services.todo.listByUser(request.params.userId, request.query);
    }
  );

  app.get<{ Params: UserTodoParams }>(
    '/users/:userId/todos/:todoId',
    {
      schema: {
        params: userTodoParamsSchema,
        response: { 200: todoResponseSchema, ...commonErrors },
        summary: 'Get todo',
        tags: ['todos'],
      },
    },
    async (request) => {
      return app.services.todo.getById(request.params.userId, request.params.todoId);
    }
  );

  app.patch<{ Body: UpdateTodoBody; Params: UserTodoParams }>(
    '/users/:userId/todos/:todoId',
    {
      schema: {
        body: updateTodoBodySchema,
        params: userTodoParamsSchema,
        response: { 200: todoResponseSchema, ...commonErrors },
        summary: 'Update todo',
        tags: ['todos'],
      },
    },
    async (request) => {
      return app.services.todo.update(request.params.userId, request.params.todoId, request.body);
    }
  );

  app.delete<{ Params: UserTodoParams }>(
    '/users/:userId/todos/:todoId',
    {
      schema: {
        params: userTodoParamsSchema,
        response: { 204: { type: 'null' }, ...commonErrors },
        summary: 'Delete todo',
        tags: ['todos'],
      },
    },
    async (request, reply) => {
      await app.services.todo.delete(request.params.userId, request.params.todoId);
      return reply.code(204).send();
    }
  );
};
