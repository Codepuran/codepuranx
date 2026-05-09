import type { ErrorObject } from 'ajv';
import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { type DomainErrorCode, isDomainError } from '../services/errors.js';

type ErrorDetail = { instancePath?: string; keyword?: string; message?: string; schemaPath?: string };

type ErrorResponse = {
  error: { code: string; details?: ErrorDetail[]; message: string; requestId: string; statusCode: number };
};

const validationDetails = (validation: FastifyError['validation']): ErrorDetail[] | undefined => {
  if (!validation || validation.length === 0) {
    return undefined;
  }

  return validation.map((issue: ErrorObject) => {
    return {
      instancePath: issue.instancePath,
      keyword: issue.keyword,
      ...(issue.message ? { message: issue.message } : {}),
      schemaPath: issue.schemaPath,
    };
  });
};

const statusCodeFromError = (error: FastifyError): number => {
  if (typeof error.statusCode === 'number' && error.statusCode >= 400) {
    return error.statusCode;
  }

  if (error.validation) {
    return 400;
  }

  return 500;
};

const codeFromError = (error: FastifyError, statusCode: number): string => {
  if (error.validation) {
    return 'VALIDATION_ERROR';
  }

  if (error.code) {
    return error.code;
  }

  return statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR';
};

const messageFromError = (error: FastifyError, statusCode: number): string => {
  if (statusCode >= 500) {
    return 'Internal server error';
  }

  return error.message;
};

const statusCodeFromDomainCode = (code: DomainErrorCode): number => {
  if (code === 'ALREADY_EXISTS' || code === 'CONFLICT') {
    return 409;
  }

  if (code === 'NOT_FOUND') {
    return 404;
  }

  return 500;
};

const sendError = (
  request: FastifyRequest,
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: ErrorDetail[]
): void => {
  const payload: ErrorResponse = {
    error: { code, ...(details ? { details } : {}), message, requestId: request.id, statusCode },
  };

  reply.code(statusCode).send(payload);
};

export const registerErrorHandlers = (app: FastifyInstance): void => {
  app.setErrorHandler((error, request, reply) => {
    if (isDomainError(error)) {
      const statusCode = statusCodeFromDomainCode(error.code);
      const message = statusCode >= 500 ? 'Internal server error' : error.message;

      if (statusCode >= 500) {
        request.log.error({ error }, 'request failed');
      } else {
        request.log.info({ error }, 'request rejected');
      }

      sendError(request, reply, statusCode, error.code, message);
      return;
    }

    const fastifyError = error as FastifyError;
    const statusCode = statusCodeFromError(fastifyError);
    const code = codeFromError(fastifyError, statusCode);
    const message = messageFromError(fastifyError, statusCode);
    const details = validationDetails(fastifyError.validation);

    if (statusCode >= 500) {
      request.log.error({ error }, 'request failed');
    } else {
      request.log.info({ error }, 'request rejected');
    }

    sendError(request, reply, statusCode, code, message, details);
  });

  app.setNotFoundHandler((request, reply) => {
    sendError(request, reply, 404, 'ROUTE_NOT_FOUND', 'Route not found');
  });
};
