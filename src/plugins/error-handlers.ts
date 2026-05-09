import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    requestId: string;
    statusCode: number;
  };
};

const statusCodeFromError = (error: FastifyError): number => {
  if (typeof error.statusCode === "number" && error.statusCode >= 400) {
    return error.statusCode;
  }

  if (error.validation) {
    return 400;
  }

  return 500;
};

const codeFromError = (error: FastifyError, statusCode: number): string => {
  if (error.validation) {
    return "VALIDATION_ERROR";
  }

  if (error.code) {
    return error.code;
  }

  return statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "HTTP_ERROR";
};

const messageFromError = (error: FastifyError, statusCode: number): string => {
  if (statusCode >= 500) {
    return "Internal server error";
  }

  return error.message;
};

const sendError = (
  request: FastifyRequest,
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string
): void => {
  const payload: ErrorResponse = {
    error: {
      code,
      message,
      requestId: request.id,
      statusCode,
    },
  };

  reply.code(statusCode).send(payload);
};

export const registerErrorHandlers = (app: FastifyInstance): void => {
  app.setErrorHandler((error, request, reply) => {
    const fastifyError = error as FastifyError;
    const statusCode = statusCodeFromError(fastifyError);
    const code = codeFromError(fastifyError, statusCode);
    const message = messageFromError(fastifyError, statusCode);

    if (statusCode >= 500) {
      request.log.error({ error }, "request failed");
    } else {
      request.log.info({ error }, "request rejected");
    }

    sendError(request, reply, statusCode, code, message);
  });

  app.setNotFoundHandler((request, reply) => {
    sendError(request, reply, 404, "ROUTE_NOT_FOUND", "Route not found");
  });
};
