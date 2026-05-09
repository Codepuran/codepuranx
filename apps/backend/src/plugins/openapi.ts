import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config/index.js';

export const registerOpenApi = async (app: FastifyInstance, config: AppConfig): Promise<void> => {
  await app.register(swagger, {
    hideUntagged: false,
    openapi: {
      info: { description: 'Fastify TypeScript API for Codepuranx.', title: 'Codepuranx API', version: '1.0.0' },
      openapi: '3.0.3',
      servers: [{ description: `${config.server.env} same-origin server`, url: '/' }],
      tags: [
        { description: 'Service health checks', name: 'health' },
        { description: 'API metadata and validation checks', name: 'api' },
        { description: 'User operations', name: 'users' },
        { description: 'Role operations', name: 'roles' },
        { description: 'Todo operations', name: 'todos' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: config.openapi.routePrefix,
    staticCSP: {
      'base-uri': "'self'",
      'connect-src': "'self'",
      'default-src': "'self'",
      'font-src': ["'self'", 'https:', 'data:'],
      'frame-ancestors': "'self'",
      'img-src': ["'self'", 'data:', 'validator.swagger.io'],
      'object-src': "'none'",
      'script-src': "'self'",
      'script-src-attr': "'none'",
      'style-src': ["'self'", "'unsafe-inline'", 'https:'],
    },
    uiConfig: { deepLinking: true, docExpansion: 'list' },
  });
};
