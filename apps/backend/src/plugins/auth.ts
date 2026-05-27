import type { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export type RequestPrincipal = { email: string; roleIds: string[]; userId: string };

declare module 'fastify' {
  interface FastifyRequest {
    principal?: RequestPrincipal;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (...roleIds: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
  const unauthorized = (message: string): Error => {
    const error = new Error(message);
    Object.assign(error, { code: 'UNAUTHORIZED', statusCode: 401 });
    return error;
  };

  const forbidden = (message: string): Error => {
    const error = new Error(message);
    Object.assign(error, { code: 'FORBIDDEN', statusCode: 403 });
    return error;
  };

  app.decorate('authenticate', async (request, _reply) => {
    try {
      const payload = await request.jwtVerify<{ sub: string; email: string; roleIds: string[] }>();

      request.principal = { email: payload.email, roleIds: payload.roleIds, userId: payload.sub };
    } catch {
      throw unauthorized('Invalid or missing access token');
    }
  });

  app.decorate('authorize', (...requiredRoleIds: string[]) => {
    return async (request, reply) => {
      await app.authenticate(request, reply);

      const principal = request.principal;

      if (!principal) {
        throw unauthorized('Invalid or missing access token');
      }

      const hasRole = requiredRoleIds.some((roleId) => principal.roleIds.includes(roleId));

      if (!hasRole) {
        throw forbidden('Forbidden');
      }
    };
  });
};

export const registerAuthPlugin = async (app: FastifyInstance): Promise<FastifyInstance> => {
  await app.register(fp(authPlugin, { name: 'auth-plugin' }));
  return app;
};
