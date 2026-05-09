import { createLoggerOptions, loadConfig } from '../../src/config/index.js';

const baseEnv = { DYNAMODB_TABLE_NAME: 'codepuranx-test', JWT_SECRET: 'test-secret' };

describe('config', () => {
  it('loads defaults with required values', () => {
    const config = loadConfig(baseEnv);

    expect(config).toMatchObject({
      server: { env: 'development', host: '127.0.0.1', port: 3000 },
      logger: { level: 'info' },
      dynamodb: { region: 'us-east-1', tableName: 'codepuranx-test' },
      jwt: { secret: 'test-secret', expiresIn: '1h' },
      openapi: { routePrefix: '/docs' },
    });
  });

  it('loads explicit values', () => {
    const config = loadConfig({
      ...baseEnv,
      NODE_ENV: 'test',
      HOST: '0.0.0.0',
      PORT: '4000',
      LOG_LEVEL: 'debug',
      DYNAMODB_REGION: 'ap-south-1',
      DYNAMODB_ENDPOINT: 'http://localhost:8000',
      JWT_EXPIRES_IN: '15m',
      OPENAPI_ROUTE_PREFIX: '/openapi',
    });

    expect(config.server.env).toBe('test');
    expect(config.server.host).toBe('0.0.0.0');
    expect(config.server.port).toBe(4000);
    expect(config.logger.level).toBe('debug');
    expect(config.dynamodb.region).toBe('ap-south-1');
    expect(config.dynamodb.endpoint).toBe('http://localhost:8000');
    expect(config.jwt.expiresIn).toBe('15m');
    expect(config.openapi.routePrefix).toBe('/openapi');
  });

  it('rejects missing required values', () => {
    expect(() => loadConfig({})).toThrow('Missing required environment variables: DYNAMODB_TABLE_NAME, JWT_SECRET');
  });

  it('rejects invalid enum values', () => {
    expect(() => loadConfig({ ...baseEnv, NODE_ENV: 'local' })).toThrow(
      'NODE_ENV must be one of: development, test, production'
    );
    expect(() => loadConfig({ ...baseEnv, LOG_LEVEL: 'verbose' })).toThrow(
      'LOG_LEVEL must be one of: fatal, error, warn, info, debug, trace, silent'
    );
  });

  it('rejects invalid port values', () => {
    expect(() => loadConfig({ ...baseEnv, PORT: 'abc' })).toThrow('PORT must be an integer between 1 and 65535');
    expect(() => loadConfig({ ...baseEnv, PORT: '70000' })).toThrow('PORT must be an integer between 1 and 65535');
  });

  it('creates logger options with sensitive redaction paths', () => {
    const loggerOptions = createLoggerOptions(loadConfig(baseEnv));

    expect(loggerOptions).toMatchObject({
      level: 'info',
      redact: expect.arrayContaining([
        'req.headers.authorization',
        'req.headers.cookie',
        'config.jwt.secret',
        'jwt.secret',
      ]),
    });
  });
});
