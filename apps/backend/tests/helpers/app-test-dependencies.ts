import type { AppConfig } from '../../src/config/index.js';
import type { AppDependencies } from '../../src/plugins/dependencies.js';
import type { RoleService } from '../../src/services/role-service.js';
import type { TodoService } from '../../src/services/todo-service.js';
import type { UserService } from '../../src/services/user-service.js';

export const testConfig: AppConfig = {
  server: { env: 'test', host: '127.0.0.1', port: 0 },
  logger: { level: 'silent', redact: [] },
  dynamodb: { region: 'us-east-1', tableName: 'test-table', endpoint: 'http://127.0.0.1:8000' },
  jwt: { secret: 'test-secret', expiresIn: '1h' },
  openapi: { routePrefix: '/docs' },
};

export type MockServices = {
  role: jest.Mocked<RoleService>;
  todo: jest.Mocked<TodoService>;
  user: jest.Mocked<UserService>;
};

export const createMockDependencies = (): AppDependencies & { services: MockServices } => {
  const services: MockServices = {
    role: {
      create: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<RoleService>,
    todo: {
      create: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
      listByUser: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<TodoService>,
    user: {
      create: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserService>,
  };

  return { dynamo: {} as AppDependencies['dynamo'], repositories: {} as AppDependencies['repositories'], services };
};
