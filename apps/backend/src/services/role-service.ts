import type { CreateRoleInput, Role, UpdateRoleInput } from '../domain/role.js';
import { DomainError } from './errors.js';

export type RoleRepositoryPort = {
  create(input: CreateRoleInput): Promise<Role>;
  delete(roleId: string): Promise<void>;
  getById(roleId: string): Promise<Role | undefined>;
  update(roleId: string, input: UpdateRoleInput): Promise<Role | undefined>;
};

export class RoleService {
  constructor(private readonly roleRepository: RoleRepositoryPort) {}

  async create(input: CreateRoleInput): Promise<Role> {
    return this.roleRepository.create(input);
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

    const role = await this.roleRepository.update(roleId, input);

    if (!role) {
      throw new DomainError('Role not found', 'NOT_FOUND');
    }

    return role;
  }

  async delete(roleId: string): Promise<void> {
    await this.getById(roleId);

    await this.roleRepository.delete(roleId);
  }
}
