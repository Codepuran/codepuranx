import { buildLambdaHandler } from '../../src/lambda.js';
import { createMockDependencies, testConfig } from '../helpers/app-test-dependencies.js';

const createApiGatewayEvent = (method: string, path: string, body?: unknown) => {
  return {
    version: '2.0',
    routeKey: `${method} ${path}`,
    rawPath: path,
    rawQueryString: '',
    headers: { host: 'example.com', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) },
    requestContext: {
      accountId: '123456789012',
      apiId: 'api-id',
      domainName: 'example.com',
      domainPrefix: 'example',
      http: { method, path, protocol: 'HTTP/1.1', sourceIp: '127.0.0.1', userAgent: 'jest' },
      requestId: 'req-1',
      routeKey: `${method} ${path}`,
      stage: '$default',
      time: '01/Jan/2026:00:00:00 +0000',
      timeEpoch: 1767225600000,
    },
    isBase64Encoded: false,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };
};

describe('Lambda handler', () => {
  it('serves health and protected routes through API Gateway events', async () => {
    const dependencies = createMockDependencies();
    dependencies.services.auth.login.mockResolvedValue({
      id: 'user-1',
      email: 'person@example.com',
      roleIds: ['admin'],
    });
    dependencies.services.user.getById.mockResolvedValue({
      id: 'user-1',
      email: 'person@example.com',
      name: 'Person',
      roleIds: ['admin'],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      version: 1,
    });

    const handler = (await buildLambdaHandler({ config: testConfig, dependencies })) as (
      event: unknown,
      context: unknown
    ) => Promise<unknown>;
    const loginResponse = await handler(
      createApiGatewayEvent('POST', '/api/v1/auth/login', { email: 'person@example.com', password: 'secret' }) as never,
      {} as never
    );

    expect((loginResponse as { statusCode: number }).statusCode).toBe(200);
    const loginBody = JSON.parse((loginResponse as { body: string }).body);
    expect(loginBody.tokenType).toBe('Bearer');

    const token = loginBody.accessToken as string;
    const userResponse = await handler(
      {
        ...createApiGatewayEvent('GET', '/api/v1/users/user-1'),
        headers: { authorization: `Bearer ${token}`, host: 'example.com' },
      } as never,
      {} as never
    );

    expect((userResponse as { statusCode: number }).statusCode).toBe(200);
    expect(JSON.parse((userResponse as { body: string }).body)).toMatchObject({
      id: 'user-1',
      email: 'person@example.com',
      roleIds: ['admin'],
    });
  });
});
