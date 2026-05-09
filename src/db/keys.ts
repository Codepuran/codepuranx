export const keyPrefix = { role: "ROLE", todo: "TODO", user: "USER", userEmail: "USER_EMAIL" } as const;

export type DynamoKey = { pk: string; sk: string };

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const userKey = (userId: string): DynamoKey => ({ pk: `${keyPrefix.user}#${userId}`, sk: "PROFILE" });

export const userEmailUniqueKey = (email: string): DynamoKey => ({
  pk: `${keyPrefix.userEmail}#${normalizeEmail(email)}`,
  sk: "UNIQUE",
});

export const roleKey = (roleId: string): DynamoKey => ({ pk: `${keyPrefix.role}#${roleId}`, sk: "PROFILE" });

export const todoKey = (userId: string, todoId: string): DynamoKey => ({
  pk: `${keyPrefix.user}#${userId}`,
  sk: `${keyPrefix.todo}#${todoId}`,
});

export const userTodoSortKeyPrefix = (): string => `${keyPrefix.todo}#`;
