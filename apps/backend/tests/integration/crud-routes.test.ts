import { buildApp } from '../../src/app.js';
import { DomainError } from '../../src/services/errors.js';
import { createMockDependencies, testConfig } from '../helpers/app-test-dependencies.js';
import { sampleRole, sampleTodo, sampleUser } from '../helpers/sample-domain.js';

describe('CRUD routes', () => {
  it('creates users through the user service', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.user.create.mockResolvedValue(sampleUser({ email: 'person@example.com', name: 'Person' }));
    const app = await buildApp({ config: testConfig, dependencies });

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { email: 'person@example.com', name: 'Person' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ email: 'person@example.com', name: 'Person' });
    expect(dependencies.services.user.create).toHaveBeenCalledWith({
      id: expect.any(String),
      email: 'person@example.com',
      name: 'Person',
      roleIds: [],
    });

    await app.close();
  });

  it('gets, updates, and deletes a user by id', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.user.getById.mockResolvedValue(sampleUser({ id: 'user-1' }));
    dependencies.services.user.update.mockResolvedValue(sampleUser({ id: 'user-1', name: 'Updated' }));
    dependencies.services.user.delete.mockResolvedValue(undefined);
    const app = await buildApp({ config: testConfig, dependencies });

    const getResponse = await app.inject({ method: 'GET', url: '/api/v1/users/user-1' });
    const patchResponse = await app.inject({
      method: 'PATCH',
      url: '/api/v1/users/user-1',
      payload: { name: 'Updated' },
    });
    const deleteResponse = await app.inject({ method: 'DELETE', url: '/api/v1/users/user-1' });

    expect(getResponse.statusCode).toBe(200);
    expect(patchResponse.statusCode).toBe(200);
    expect(deleteResponse.statusCode).toBe(204);
    expect(dependencies.services.user.getById).toHaveBeenCalledWith('user-1');
    expect(dependencies.services.user.update).toHaveBeenCalledWith('user-1', { name: 'Updated' });
    expect(dependencies.services.user.delete).toHaveBeenCalledWith('user-1');

    await app.close();
  });

  it('creates and lists todos under one user', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.todo.create.mockResolvedValue(sampleTodo({ userId: 'user-1', title: 'Task' }));
    dependencies.services.todo.listByUser.mockResolvedValue({
      items: [sampleTodo({ userId: 'user-1' })],
      cursor: 'next',
    });
    const app = await buildApp({ config: testConfig, dependencies });

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/users/user-1/todos',
      payload: { title: 'Task' },
    });
    const listResponse = await app.inject({ method: 'GET', url: '/api/v1/users/user-1/todos?limit=10&cursor=abc' });

    expect(createResponse.statusCode).toBe(201);
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json()).toMatchObject({ items: [{ userId: 'user-1' }], cursor: 'next' });
    expect(dependencies.services.todo.create).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: 'user-1',
      title: 'Task',
    });
    expect(dependencies.services.todo.listByUser).toHaveBeenCalledWith('user-1', { limit: 10, cursor: 'abc' });

    await app.close();
  });

  it('gets, updates, and deletes a todo by user and todo id', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.todo.getById.mockResolvedValue(sampleTodo({ id: 'todo-1', userId: 'user-1' }));
    dependencies.services.todo.update.mockResolvedValue(
      sampleTodo({ id: 'todo-1', status: 'completed', userId: 'user-1' })
    );
    dependencies.services.todo.delete.mockResolvedValue(undefined);
    const app = await buildApp({ config: testConfig, dependencies });

    const getResponse = await app.inject({ method: 'GET', url: '/api/v1/users/user-1/todos/todo-1' });
    const patchResponse = await app.inject({
      method: 'PATCH',
      url: '/api/v1/users/user-1/todos/todo-1',
      payload: { status: 'completed' },
    });
    const deleteResponse = await app.inject({ method: 'DELETE', url: '/api/v1/users/user-1/todos/todo-1' });

    expect(getResponse.statusCode).toBe(200);
    expect(patchResponse.statusCode).toBe(200);
    expect(deleteResponse.statusCode).toBe(204);
    expect(dependencies.services.todo.getById).toHaveBeenCalledWith('user-1', 'todo-1');
    expect(dependencies.services.todo.update).toHaveBeenCalledWith('user-1', 'todo-1', { status: 'completed' });
    expect(dependencies.services.todo.delete).toHaveBeenCalledWith('user-1', 'todo-1');

    await app.close();
  });

  it('creates, gets, updates, and deletes roles', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.role.create.mockResolvedValue(sampleRole({ name: 'Admin' }));
    dependencies.services.role.getById.mockResolvedValue(sampleRole({ id: 'role-1' }));
    dependencies.services.role.update.mockResolvedValue(sampleRole({ id: 'role-1', name: 'Owner' }));
    dependencies.services.role.delete.mockResolvedValue(undefined);
    const app = await buildApp({ config: testConfig, dependencies });

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/roles',
      payload: { name: 'Admin' },
    });
    const getResponse = await app.inject({ method: 'GET', url: '/api/v1/roles/role-1' });
    const patchResponse = await app.inject({
      method: 'PATCH',
      url: '/api/v1/roles/role-1',
      payload: { name: 'Owner' },
    });
    const deleteResponse = await app.inject({ method: 'DELETE', url: '/api/v1/roles/role-1' });

    expect(createResponse.statusCode).toBe(201);
    expect(getResponse.statusCode).toBe(200);
    expect(patchResponse.statusCode).toBe(200);
    expect(deleteResponse.statusCode).toBe(204);
    expect(dependencies.services.role.create).toHaveBeenCalledWith({
      id: expect.any(String),
      name: 'Admin',
    });
    expect(dependencies.services.role.update).toHaveBeenCalledWith('role-1', { name: 'Owner' });
    expect(dependencies.services.role.delete).toHaveBeenCalledWith('role-1');

    await app.close();
  });

  it('returns validation and domain errors consistently', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.todo.getById.mockRejectedValue(new DomainError('Todo not found', 'NOT_FOUND'));
    const app = await buildApp({ config: testConfig, dependencies });

    const validationResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Missing Email' },
    });
    const notFoundResponse = await app.inject({ method: 'GET', url: '/api/v1/users/user-1/todos/missing' });

    expect(validationResponse.statusCode).toBe(400);
    expect(validationResponse.json()).toMatchObject({ error: { code: 'VALIDATION_ERROR', statusCode: 400 } });
    expect(notFoundResponse.statusCode).toBe(404);
    expect(notFoundResponse.json()).toMatchObject({
      error: { code: 'NOT_FOUND', message: 'Todo not found', statusCode: 404 },
    });

    await app.close();
  });
});
