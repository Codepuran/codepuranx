import type { CreateUserInput, UpdateUserInput, User } from '../domain/user.js';
import { DomainError } from './errors.js';
import { toCreateDomainError, toMutationDomainError } from './repository-errors.js';

export type UserRepositoryPort = {
  create(input: CreateUserInput): Promise<User>;
  delete(userId: string, email: string): Promise<void>;
  getById(userId: string): Promise<User | undefined>;
  update(userId: string, input: UpdateUserInput): Promise<User | undefined>;
};

export class UserService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async create(input: CreateUserInput): Promise<User> {
    try {
      return await this.userRepository.create(input);
    } catch (error) {
      throw toCreateDomainError('User', error);
    }
  }

  async getById(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new DomainError('User not found', 'NOT_FOUND');
    }

    return user;
  }

  async update(userId: string, input: UpdateUserInput): Promise<User> {
    await this.getById(userId);

    try {
      const user = await this.userRepository.update(userId, input);

      if (!user) {
        throw new DomainError('User not found', 'NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }

      throw toMutationDomainError('User', error);
    }
  }

  async delete(userId: string): Promise<void> {
    const user = await this.getById(userId);

    try {
      await this.userRepository.delete(userId, user.email);
    } catch (error) {
      throw toMutationDomainError('User', error);
    }
  }
}
