import type { User } from '../../src/domain/user.js';
import { type UserRepositoryPort, UserService } from '../../src/services/user-service.js';
import { sampleUser } from '../helpers/sample-domain.js';

const createRepository = (
  overrides: Partial<jest.Mocked<UserRepositoryPort>> = {}
): jest.Mocked<UserRepositoryPort> => ({
  create: jest.fn<Promise<User>, Parameters<UserRepositoryPort['create']>>(),
  delete: jest.fn<Promise<void>, Parameters<UserRepositoryPort['delete']>>(),
  getByEmail: jest.fn<Promise<User | undefined>, Parameters<UserRepositoryPort['getByEmail']>>(),
  getById: jest.fn<Promise<User | undefined>, Parameters<UserRepositoryPort['getById']>>(),
  update: jest.fn<Promise<User | undefined>, Parameters<UserRepositoryPort['update']>>(),
  ...overrides,
});

describe('UserService', () => {
  it('gets users by id', async () => {
    const user = sampleUser();
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(user) });
    const service = new UserService(repository);

    await expect(service.getById('user-1')).resolves.toBe(user);
  });

  it('throws a domain not found error when a user is missing', async () => {
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(undefined) });
    const service = new UserService(repository);

    await expect(service.getById('missing')).rejects.toMatchObject({ code: 'NOT_FOUND', message: 'User not found' });
  });

  it('loads the user before delete so the email uniqueness guard can be removed', async () => {
    const repository = createRepository({
      delete: jest.fn().mockResolvedValue(undefined),
      getById: jest.fn().mockResolvedValue(sampleUser({ email: 'person@example.com' })),
    });
    const service = new UserService(repository);

    await service.delete('user-1');

    expect(repository.getById).toHaveBeenCalledWith('user-1');
    expect(repository.delete).toHaveBeenCalledWith('user-1', 'person@example.com');
  });
});
