import type { FastifyPluginAsync } from 'fastify';
import { type HealthResponse, healthResponseSchema } from '../schemas/health.js';

export const registerHealthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', { schema: { response: { 200: healthResponseSchema } } }, async (): Promise<HealthResponse> => {
    return { status: 'ok' };
  });
};
