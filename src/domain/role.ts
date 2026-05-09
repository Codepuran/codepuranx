export type Role = {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type CreateRoleInput = { id: string; name: string; permissions?: string[] };

export type UpdateRoleInput = { name?: string; permissions?: string[] };
