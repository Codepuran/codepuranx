import type { FastifyPluginAsync } from 'fastify';
import { signAccessToken } from '../auth/jwt.js';
import { type LoginBody, loginBodySchema, loginResponseSchema } from '../schemas/auth.js';

export const registerAuthRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: LoginBody }>(
    '/auth/login',
    { schema: { body: loginBodySchema, response: { 200: loginResponseSchema }, summary: 'Login', tags: ['auth'] } },
    async (request) => {
      const principal = await app.services.auth.login(request.body.email, request.body.password);
      const accessToken = signAccessToken(app, principal, app.appConfig);

      return { accessToken, tokenType: 'Bearer' };
    }
  );
};
