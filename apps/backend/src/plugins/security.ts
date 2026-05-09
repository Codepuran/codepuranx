import helmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

export const registerSecurityHeaders = async (app: FastifyInstance): Promise<void> => {
  await app.register(helmet);
};
