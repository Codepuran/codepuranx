import { hashPassword, verifyPassword } from '../../src/auth/password.js';

describe('password utilities', () => {
  it('hashes passwords with bcrypt and verifies them', () => {
    const password = 'correct horse battery staple';
    const hash = hashPassword(password, 4);

    expect(hash).toMatch(/^\$2[aby]\$/);
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword('wrong password', hash)).toBe(false);
  });

  it('rejects empty passwords and invalid cost factors', () => {
    expect(() => hashPassword('', 4)).toThrow('password must not be empty');
    expect(() => hashPassword('secret', 3)).toThrow('bcrypt cost must be an integer between 4 and 31');
  });

  it('returns false for empty verification input', () => {
    expect(verifyPassword('', '')).toBe(false);
  });
});
