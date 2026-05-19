import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import type { AppConfig } from '../config/index.js';
import { createDynamoClients, type DynamoClients } from '../db/client.js';
import { systemClock } from '../repositories/clock.js';
import { RoleRepository } from '../repositories/role-repository.js';
import { TodoRepository } from '../repositories/todo-repository.js';
import { UserRepository } from '../repositories/user-repository.js';
import { AuthService } from '../services/auth-service.js';
import { RoleService } from '../services/role-service.js';
import { TodoService } from '../services/todo-service.js';
import { UserService } from '../services/user-service.js';

export type AppRepositories = { role: RoleRepository; todo: TodoRepository; user: UserRepository };

export type AppServices = { auth: AuthService; role: RoleService; todo: TodoService; user: UserService };

export type AppDependencies = { dynamo: DynamoClients; repositories: AppRepositories; services: AppServices };

export type DependenciesPluginOptions = { config: AppConfig; dependencies?: AppDependencies };

declare module 'fastify' {
  interface FastifyInstance {
    appConfig: AppConfig;
    dynamo: DynamoClients;
    repositories: AppRepositories;
    services: AppServices;
  }
}

export const createAppDependencies = (config: AppConfig): AppDependencies => {
  const dynamo = createDynamoClients(config.dynamodb);
  const repositoryOptions = { clock: systemClock, tableName: config.dynamodb.tableName };
  const repositories: AppRepositories = {
    role: new RoleRepository(dynamo.documentClient, repositoryOptions),
    todo: new TodoRepository(dynamo.documentClient, repositoryOptions),
    user: new UserRepository(dynamo.documentClient, repositoryOptions),
  };

  return {
    dynamo,
    repositories,
    services: {
      auth: new AuthService(repositories.user),
      role: new RoleService(repositories.role),
      todo: new TodoService(repositories.todo),
      user: new UserService(repositories.user),
    },
  };
};

const dependenciesPlugin: FastifyPluginAsync<DependenciesPluginOptions> = async (app, options) => {
  const dependencies = options.dependencies ?? createAppDependencies(options.config);

  app.decorate('appConfig', options.config);
  app.decorate('dynamo', dependencies.dynamo);
  app.decorate('repositories', dependencies.repositories);
  app.decorate('services', dependencies.services);
};

export const registerDependencies = async (
  app: FastifyInstance,
  options: DependenciesPluginOptions
): Promise<FastifyInstance> => {
  await app.register(fp(dependenciesPlugin, { name: 'app-dependencies' }), options);
  return app;
};
