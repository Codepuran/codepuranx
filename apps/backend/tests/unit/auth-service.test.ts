import { hashPassword } from '../../src/auth/password.js';
import type { User } from '../../src/domain/user.js';
import { AuthService } from '../../src/services/auth-service.js';
import { DomainError } from '../../src/services/errors.js';

describe('AuthService', () => {
  const user = (overrides: Partial<User> = {}): User => ({
    id: 'user-1',
    email: 'person@example.com',
    name: 'Person',
    roleIds: ['admin'],
    passwordHash: hashPassword('secret', 4),
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    version: 1,
    ...overrides,
  });

  it('accepts valid credentials', async () => {
    const repository = { getByEmail: jest.fn().mockResolvedValue(user()) };
    const service = new AuthService(repository);

    await expect(service.login('person@example.com', 'secret')).resolves.toEqual({
      id: 'user-1',
      email: 'person@example.com',
      roleIds: ['admin'],
    });
  });

  it('rejects invalid credentials', async () => {
    const repository = { getByEmail: jest.fn().mockResolvedValue(user()) };
    const service = new AuthService(repository);

    await expect(service.login('person@example.com', 'wrong')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    });
  });

  it('rejects unknown users', async () => {
    const repository = { getByEmail: jest.fn().mockResolvedValue(undefined) };
    const service = new AuthService(repository);

    await expect(service.login('missing@example.com', 'secret')).rejects.toBeInstanceOf(DomainError);
  });
});
