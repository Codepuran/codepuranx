import { buildApp } from '../../src/app.js';

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

  it('registers the v1 API prefix', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/api/v1' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ name: 'codepuranx-api', version: 'v1' });

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
});
