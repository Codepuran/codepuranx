export type User = {
  id: string;
  email: string;
  name: string;
  roleIds: string[];
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type CreateUserInput = { id: string; email: string; name: string; passwordHash?: string; roleIds?: string[] };

export type UpdateUserInput = { email?: string; name?: string; roleIds?: string[]; passwordHash?: string };
