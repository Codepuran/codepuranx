import type { FastifyInstance } from 'fastify';

const CORRELATION_ID_HEADER = 'x-correlation-id';

const firstHeaderValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export const registerRequestContext = (app: FastifyInstance): void => {
  app.addHook('onRequest', async (request, reply) => {
    const correlationId = firstHeaderValue(request.headers[CORRELATION_ID_HEADER]) ?? request.id;

    reply.header('x-request-id', request.id);
    reply.header(CORRELATION_ID_HEADER, correlationId);
  });
};
