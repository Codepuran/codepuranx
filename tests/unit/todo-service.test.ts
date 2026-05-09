import { RepositoryError } from '../../src/db/errors.js';
import type { Todo } from '../../src/domain/todo.js';
import { DomainError } from '../../src/services/errors.js';
import { type TodoRepositoryPort, TodoService } from '../../src/services/todo-service.js';
import { sampleTodo } from '../helpers/sample-domain.js';

const createRepository = (
  overrides: Partial<jest.Mocked<TodoRepositoryPort>> = {}
): jest.Mocked<TodoRepositoryPort> => ({
  create: jest.fn<Promise<Todo>, Parameters<TodoRepositoryPort['create']>>(),
  delete: jest.fn<Promise<void>, Parameters<TodoRepositoryPort['delete']>>(),
  getById: jest.fn<Promise<Todo | undefined>, Parameters<TodoRepositoryPort['getById']>>(),
  listByUser: jest.fn<ReturnType<TodoRepositoryPort['listByUser']>, Parameters<TodoRepositoryPort['listByUser']>>(),
  update: jest.fn<Promise<Todo | undefined>, Parameters<TodoRepositoryPort['update']>>(),
  ...overrides,
});

describe('TodoService', () => {
  it('returns a todo by user and id', async () => {
    const todo = sampleTodo();
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(todo) });
    const service = new TodoService(repository);

    await expect(service.getById('user-1', 'todo-1')).resolves.toBe(todo);
  });

  it('throws a domain not found error when a todo is missing', async () => {
    const repository = createRepository({ getById: jest.fn().mockResolvedValue(undefined) });
    const service = new TodoService(repository);

    await expect(service.getById('user-1', 'missing')).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Todo not found',
    });
  });

  it('maps duplicate create failures to domain errors', async () => {
    const repository = createRepository({
      create: jest.fn().mockRejectedValue(new RepositoryError('duplicate', 'CONFLICT')),
    });
    const service = new TodoService(repository);

    await expect(service.create({ id: 'todo-1', userId: 'user-1', title: 'Task' })).rejects.toBeInstanceOf(DomainError);
    await expect(service.create({ id: 'todo-1', userId: 'user-1', title: 'Task' })).rejects.toMatchObject({
      code: 'ALREADY_EXISTS',
      message: 'Todo already exists',
    });
  });

  it('checks existence before deleting a todo', async () => {
    const repository = createRepository({
      delete: jest.fn().mockResolvedValue(undefined),
      getById: jest.fn().mockResolvedValue(sampleTodo()),
    });
    const service = new TodoService(repository);

    await service.delete('user-1', 'todo-1');

    expect(repository.getById).toHaveBeenCalledWith('user-1', 'todo-1');
    expect(repository.delete).toHaveBeenCalledWith('user-1', 'todo-1');
  });
});
