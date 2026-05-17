import type { CreateUserInput, UpdateUserInput, User } from '../domain/user.js';
import { DomainError } from './errors.js';

export type UserRepositoryPort = {
  create(input: CreateUserInput): Promise<User>;
  delete(userId: string, email: string): Promise<void>;
  getById(userId: string): Promise<User | undefined>;
  update(userId: string, input: UpdateUserInput): Promise<User | undefined>;
};

export class UserService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async create(input: CreateUserInput): Promise<User> {
    return this.userRepository.create(input);
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

    const user = await this.userRepository.update(userId, input);

    if (!user) {
      throw new DomainError('User not found', 'NOT_FOUND');
    }

    return user;
  }

  async delete(userId: string): Promise<void> {
    const user = await this.getById(userId);

    await this.userRepository.delete(userId, user.email);
  }
}
