export const todoStatusValues = ['open', 'completed'] as const;

export type TodoStatus = (typeof todoStatusValues)[number];

export type Todo = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type CreateTodoInput = { id: string; userId: string; title: string; description?: string };

export type UpdateTodoInput = { title?: string; description?: string; status?: TodoStatus };
