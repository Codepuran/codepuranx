import { buildApp } from '../../src/app.js';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { testConfig } from '../helpers/app-test-dependencies.js';

describe('Fastify app foundation', () => {
  it('builds the app without listening on a port', async () => {
    const app = await buildApp();

    await expect(app.ready()).resolves.toBe(app);
    await app.close();
  });

  it('returns health status', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-correlation-id']).toBeDefined();

    await app.close();
  });

  it('applies security headers without enabling CORS', async () => {
    const app = await buildApp();

    const response = await app.inject({ headers: { origin: 'https://example.com' }, method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['access-control-allow-origin']).toBeUndefined();

    await app.close();
  });

  it('registers the v1 API prefix', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/api/v1' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ name: 'codepuranx-api', version: 'v1' });

    await app.close();
  });

  it('serves generated OpenAPI docs when config is provided', async () => {
    const app = await buildApp({ config: testConfig });

    const response = await app.inject({ method: 'GET', url: '/docs/json' });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.openapi).toBe('3.0.3');
    expect(body.info.title).toBe('Codepuranx API');
    expect(body.servers).toEqual([{ description: 'test same-origin server', url: '/' }]);
    expect(body.paths).toHaveProperty('/health');
    expect(body.paths).toHaveProperty('/api/v1/users');
    expect(body.paths).toHaveProperty('/api/v1/users/{userId}/todos');

    await app.close();
  });

  it('serves Swagger UI with its own content security policy', async () => {
    const app = await buildApp({ config: testConfig });

    const response = await app.inject({ method: 'GET', url: '/docs' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-security-policy']).toContain('style-src');
    expect(response.headers['content-security-policy']).toContain("'unsafe-inline'");
    expect(response.headers['content-security-policy']).toContain("connect-src 'self'");
    expect(response.headers['content-type']).toContain('text/html');

    await app.close();
  });

  it('returns a consistent not found response', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/missing' });

    const body = response.json();

    expect(response.statusCode).toBe(404);
    expect(body).toMatchObject({ error: { code: 'ROUTE_NOT_FOUND', message: 'Route not found', statusCode: 404 } });
    expect(body.error.requestId).toBeDefined();

    await app.close();
  });

  it('returns a consistent validation error response', async () => {
    const app = await buildApp();

    const invalidResponse = await app.inject({ method: 'GET', url: '/api/v1/validation-check/%20' });
    const invalidBody = invalidResponse.json();

    expect(invalidResponse.statusCode).toBe(400);
    expect(invalidBody).toMatchObject({ error: { code: 'VALIDATION_ERROR', statusCode: 400 } });
    expect(invalidBody.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ keyword: 'pattern', message: expect.any(String) })])
    );

    await app.close();
  });

  it('masks unexpected server errors', async () => {
    const app = await buildApp();

    app.get('/boom', async () => {
      const error = new Error('database password leaked');
      Object.assign(error, { code: 'DATABASE_SECRET_ERROR', statusCode: 500 });
      throw error;
    });

    const response = await app.inject({ method: 'GET', url: '/boom' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error', statusCode: 500 },
    });

    await app.close();
  });

  it('maps DynamoDB conflicts through the global error handler', async () => {
    const app = await buildApp();

    app.get('/dynamo-conflict', async () => {
      throw new ConditionalCheckFailedException({ $metadata: {}, message: 'condition failed' });
    });

    const response = await app.inject({ method: 'GET', url: '/dynamo-conflict' });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      error: { code: 'DYNAMO_ERROR', message: 'DynamoDB request failed', statusCode: 409 },
    });

    await app.close();
  });
});
