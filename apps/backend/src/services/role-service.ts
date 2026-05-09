import type { CreateRoleInput, Role, UpdateRoleInput } from '../domain/role.js';
import { DomainError } from './errors.js';
import { toCreateDomainError, toMutationDomainError } from './repository-errors.js';

export type RoleRepositoryPort = {
  create(input: CreateRoleInput): Promise<Role>;
  delete(roleId: string): Promise<void>;
  getById(roleId: string): Promise<Role | undefined>;
  update(roleId: string, input: UpdateRoleInput): Promise<Role | undefined>;
};

export class RoleService {
  constructor(private readonly roleRepository: RoleRepositoryPort) {}

  async create(input: CreateRoleInput): Promise<Role> {
    try {
      return await this.roleRepository.create(input);
    } catch (error) {
      throw toCreateDomainError('Role', error);
    }
  }

  async getById(roleId: string): Promise<Role> {
    const role = await this.roleRepository.getById(roleId);

    if (!role) {
      throw new DomainError('Role not found', 'NOT_FOUND');
    }

    return role;
  }

  async update(roleId: string, input: UpdateRoleInput): Promise<Role> {
    await this.getById(roleId);

    try {
      const role = await this.roleRepository.update(roleId, input);

      if (!role) {
        throw new DomainError('Role not found', 'NOT_FOUND');
      }

      return role;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }

      throw toMutationDomainError('Role', error);
    }
  }

  async delete(roleId: string): Promise<void> {
    await this.getById(roleId);

    try {
      await this.roleRepository.delete(roleId);
    } catch (error) {
      throw toMutationDomainError('Role', error);
    }
  }
}
