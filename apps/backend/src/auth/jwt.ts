import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config/index.js';
import type { AuthenticatedUser } from '../services/auth-service.js';

export type LoginTokenPayload = { email: string; roleIds: string[] };

export const signAccessToken = (app: FastifyInstance, user: AuthenticatedUser, config: AppConfig): string => {
  return app.jwt.sign(
    { sub: user.id, email: user.email, roleIds: user.roleIds } satisfies LoginTokenPayload & { sub: string },
    { expiresIn: config.jwt.expiresIn }
  );
};
