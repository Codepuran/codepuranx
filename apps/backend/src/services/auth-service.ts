import type { User } from '../domain/user.js';
import { DomainError } from './errors.js';
import { verifyPassword } from '../auth/password.js';
import type { UserRepositoryPort } from './user-service.js';

export type AuthenticatedUser = Pick<User, 'id' | 'email' | 'roleIds'>;

export class AuthService {
  constructor(private readonly userRepository: Pick<UserRepositoryPort, 'getByEmail'>) {}

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.userRepository.getByEmail(email);

    if (!user || !user.passwordHash) {
      throw new DomainError('Invalid email or password', 'UNAUTHORIZED');
    }

    if (!verifyPassword(password, user.passwordHash)) {
      throw new DomainError('Invalid email or password', 'UNAUTHORIZED');
    }

    return { id: user.id, email: user.email, roleIds: user.roleIds };
  }
}
