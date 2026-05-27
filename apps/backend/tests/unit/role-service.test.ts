import type { Role } from '../../src/domain/role.js';
import { type RoleRepositoryPort, RoleService } from '../../src/services/role-service.js';
import { sampleRole } from '../helpers/sample-domain.js';

const createRepository = (
  overrides: Partial<jest.Mocked<RoleRepositoryPort>> = {}
): jest.Mocked<RoleRepositoryPort> => ({
  create: jest.fn<Promise<Role>, Parameters<RoleRepositoryPort['create']>>(),
  delete: jest.fn<Promise<void>, Parameters<RoleRepositoryPort['delete']>>(),
  getById: jest.fn<Promise<Role | undefined>, Parameters<RoleRepositoryPort['getById']>>(),
  update: jest.fn<Promise<Role | undefined>, Parameters<RoleRepositoryPort['update']>>(),
  ...overrides,
});

describe('RoleService', () => {
  it('gets roles by id', async () => {
    const role = sampleRole();
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(role) });
    const service = new RoleService(repository);

    await expect(service.getById('role-1')).resolves.toBe(role);
  });

  it('throws a domain not found error when a role is missing', async () => {
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(undefined) });
    const service = new RoleService(repository);

    await expect(service.getById('missing')).rejects.toMatchObject({ code: 'NOT_FOUND', message: 'Role not found' });
  });

  it('checks existence before updating a role', async () => {
    const role = sampleRole({ name: 'Admin Updated', version: 2 });
    const repository = createRepository({
      getById: jest.fn().mockResolvedValue(sampleRole()),
      update: jest.fn().mockResolvedValue(role),
    });
    const service = new RoleService(repository);

    await expect(service.update('role-1', { name: 'Admin Updated' })).resolves.toBe(role);
    expect(repository.getById).toHaveBeenCalledWith('role-1');
    expect(repository.update).toHaveBeenCalledWith('role-1', { name: 'Admin Updated' });
  });
});
