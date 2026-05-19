export type Role = { id: string; name: string; createdAt: string; updatedAt: string; version: number };

export type CreateRoleInput = { id: string; name: string };

export type UpdateRoleInput = { name?: string };
