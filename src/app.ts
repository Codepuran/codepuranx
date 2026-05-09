import { randomUUID } from 'node:crypto';
import fastify, { type FastifyBaseLogger, type FastifyInstance, type FastifyServerOptions } from 'fastify';
import type { AppConfig } from './config/index.js';
import { type AppDependencies, registerDependencies } from './plugins/dependencies.js';
import { registerErrorHandlers } from './plugins/error-handlers.js';
import { registerHealthRoutes } from './plugins/health.js';
import { registerRequestContext } from './plugins/request-context.js';
import { registerApiRoutes } from './routes/api.js';

export type BuildAppOptions = {
  config?: AppConfig;
  dependencies?: AppDependencies;
  logger?: FastifyServerOptions['logger'];
};

export const buildApp = async (options: BuildAppOptions = {}): Promise<FastifyInstance> => {
  const app = fastify({
    disableRequestLogging: false,
    genReqId: () => randomUUID(),
    logger: options.logger ?? false,
    requestIdHeader: 'x-request-id',
  });

  registerErrorHandlers(app);

  registerRequestContext(app);

  if (options.config) {
    await registerDependencies(app, {
      config: options.config,
      ...(options.dependencies ? { dependencies: options.dependencies } : {}),
    });
  }

  await app.register(registerHealthRoutes);
  await app.register(registerApiRoutes, { prefix: '/api/v1' });

  return app;
};

export type AppLogger = FastifyBaseLogger;
