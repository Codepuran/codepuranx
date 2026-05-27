import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

const DEFAULT_BCRYPT_COST = 12;

const normalizeCost = (cost?: number): number => {
  if (cost === undefined) {
    return DEFAULT_BCRYPT_COST;
  }

  if (!Number.isInteger(cost) || cost < 4 || cost > 31) {
    throw new Error('bcrypt cost must be an integer between 4 and 31');
  }

  return cost;
};

export const hashPassword = (password: string, cost?: number): string => {
  if (password.length === 0) {
    throw new Error('password must not be empty');
  }

  const salt = genSaltSync(normalizeCost(cost));
  return hashSync(password, salt);
};

export const verifyPassword = (password: string, passwordHash: string): boolean => {
  if (password.length === 0 || passwordHash.length === 0) {
    return false;
  }

  return compareSync(password, passwordHash);
};
