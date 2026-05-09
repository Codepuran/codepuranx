import { buildApp } from '../../src/app.js';
import type { AppConfig } from '../../src/config/index.js';
import { createAppDependencies } from '../../src/plugins/dependencies.js';
import { RoleService } from '../../src/services/role-service.js';
import { TodoService } from '../../src/services/todo-service.js';
import { UserService } from '../../src/services/user-service.js';

const config: AppConfig = {
  server: { env: 'test', host: '127.0.0.1', port: 0 },
  logger: { level: 'silent', redact: [] },
  dynamodb: { region: 'us-east-1', tableName: 'test-table', endpoint: 'http://127.0.0.1:8000' },
  jwt: { secret: 'test-secret', expiresIn: '1h' },
  openapi: { routePrefix: '/docs' },
};

describe('dependency plugin', () => {
  it('creates DynamoDB-backed repositories and services', () => {
    const dependencies = createAppDependencies(config);

    expect(dependencies.services.todo).toBeInstanceOf(TodoService);
    expect(dependencies.services.user).toBeInstanceOf(UserService);
    expect(dependencies.services.role).toBeInstanceOf(RoleService);
  });

  it('decorates Fastify with typed dependencies when config is provided', async () => {
    const app = await buildApp({ config });

    await app.ready();

    expect(app.appConfig).toBe(config);
    expect(app.services.todo).toBeInstanceOf(TodoService);
    expect(app.repositories.user).toBeDefined();
    expect(app.dynamo.documentClient).toBeDefined();

    await app.close();
  });
});
