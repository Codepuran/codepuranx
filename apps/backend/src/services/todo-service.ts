import type { PageInput, PageResult } from '../db/pagination.js';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/todo.js';
import { DomainError } from './errors.js';
import { toCreateDomainError, toMutationDomainError } from './repository-errors.js';

export type TodoRepositoryPort = {
  create(input: CreateTodoInput): Promise<Todo>;
  delete(userId: string, todoId: string): Promise<void>;
  getById(userId: string, todoId: string): Promise<Todo | undefined>;
  listByUser(userId: string, page?: PageInput): Promise<PageResult<Todo>>;
  update(userId: string, todoId: string, input: UpdateTodoInput): Promise<Todo | undefined>;
};

export class TodoService {
  constructor(private readonly todoRepository: TodoRepositoryPort) {}

  async create(input: CreateTodoInput): Promise<Todo> {
    try {
      return await this.todoRepository.create(input);
    } catch (error) {
      throw toCreateDomainError('Todo', error);
    }
  }

  async getById(userId: string, todoId: string): Promise<Todo> {
    const todo = await this.todoRepository.getById(userId, todoId);

    if (!todo) {
      throw new DomainError('Todo not found', 'NOT_FOUND');
    }

    return todo;
  }

  async listByUser(userId: string, page: PageInput = {}): Promise<PageResult<Todo>> {
    return this.todoRepository.listByUser(userId, page);
  }

  async update(userId: string, todoId: string, input: UpdateTodoInput): Promise<Todo> {
    await this.getById(userId, todoId);

    try {
      const todo = await this.todoRepository.update(userId, todoId, input);

      if (!todo) {
        throw new DomainError('Todo not found', 'NOT_FOUND');
      }

      return todo;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }

      throw toMutationDomainError('Todo', error);
    }
  }

  async delete(userId: string, todoId: string): Promise<void> {
    await this.getById(userId, todoId);

    try {
      await this.todoRepository.delete(userId, todoId);
    } catch (error) {
      throw toMutationDomainError('Todo', error);
    }
  }
}
