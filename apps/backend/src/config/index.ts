import { config as loadDotenv } from 'dotenv';
import type { FastifyServerOptions } from 'fastify';

const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;
const LOG_LEVEL_VALUES = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
const LOG_ROTATION_FREQUENCY_VALUES = ['hourly', 'daily', 'weekly'] as const;

type NodeEnv = (typeof NODE_ENV_VALUES)[number];
type LogLevel = (typeof LOG_LEVEL_VALUES)[number];
type LogRotationFrequency = (typeof LOG_ROTATION_FREQUENCY_VALUES)[number];

export type AppConfig = {
  server: { env: NodeEnv; host: string; port: number };
  logger: {
    level: LogLevel;
    redact: string[];
    console: { enabled: boolean };
    file: {
      enabled: boolean;
      path: string;
      rotationFrequency: LogRotationFrequency;
      rotationSize: string;
      retentionCount: number;
    };
  };
  dynamodb: { region: string; tableName: string; endpoint?: string };
  jwt: { secret: string; expiresIn: string };
  openapi: { routePrefix: string };
};

type EnvInput = NodeJS.ProcessEnv;

type ConfigField = { description: string; required: boolean; default?: string; secret?: boolean };

type ConfigKey =
  | 'NODE_ENV'
  | 'HOST'
  | 'PORT'
  | 'LOG_LEVEL'
  | 'LOG_CONSOLE_ENABLED'
  | 'LOG_FILE_ENABLED'
  | 'LOG_FILE_PATH'
  | 'LOG_ROTATION_FREQUENCY'
  | 'LOG_ROTATION_SIZE'
  | 'LOG_RETENTION_COUNT'
  | 'DYNAMODB_REGION'
  | 'DYNAMODB_TABLE_NAME'
  | 'DYNAMODB_ENDPOINT'
  | 'JWT_SECRET'
  | 'JWT_EXPIRES_IN'
  | 'OPENAPI_ROUTE_PREFIX';

export const configSchema: Record<ConfigKey, ConfigField> = {
  NODE_ENV: { description: 'Application runtime environment', required: false, default: 'development' },
  HOST: { description: 'Local HTTP bind host', required: false, default: '127.0.0.1' },
  PORT: { description: 'Local HTTP bind port', required: false, default: '3000' },
  LOG_LEVEL: { description: 'Pino log level', required: false, default: 'info' },
  LOG_CONSOLE_ENABLED: { description: 'Write logs to stdout', required: false, default: 'true' },
  LOG_FILE_ENABLED: { description: 'Write logs to a rotated file', required: false, default: 'true' },
  LOG_FILE_PATH: { description: 'Rotated application log file path', required: false, default: 'logs/backend.log' },
  LOG_ROTATION_FREQUENCY: { description: 'Log rotation frequency', required: false, default: 'daily' },
  LOG_ROTATION_SIZE: { description: 'Log rotation size threshold', required: false, default: '10m' },
  LOG_RETENTION_COUNT: { description: 'Number of rotated log files to retain', required: false, default: '7' },
  DYNAMODB_REGION: { description: 'AWS region for DynamoDB', required: false, default: 'us-east-1' },
  DYNAMODB_TABLE_NAME: { description: 'DynamoDB table name', required: true },
  DYNAMODB_ENDPOINT: { description: 'Optional local DynamoDB endpoint', required: false },
  JWT_SECRET: { description: 'Secret used to sign local JWTs', required: true, secret: true },
  JWT_EXPIRES_IN: { description: 'JWT expiration duration', required: false, default: '1h' },
  OPENAPI_ROUTE_PREFIX: { description: 'OpenAPI UI route prefix', required: false, default: '/docs' },
};

loadDotenv({ path: '.env', override: false });
loadDotenv({ path: 'apps/backend/.env', override: false });

const requiredKeys = Object.entries(configSchema)
  .filter(([, field]) => field.required)
  .map(([key]) => key as ConfigKey);

const valueFromEnv = (env: EnvInput, key: ConfigKey): string | undefined => {
  const value = env[key];

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return configSchema[key].default;
};

const parseEnum = <T extends readonly string[]>(key: string, value: string, values: T): T[number] => {
  if (values.includes(value)) {
    return value as T[number];
  }

  throw new Error(`${key} must be one of: ${values.join(', ')}`);
};

const parsePort = (value: string): number => {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
};

const parseBoolean = (key: string, value: string): boolean => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${key} must be either true or false`);
};

const parsePositiveInteger = (key: string, value: string): number => {
  const number = Number.parseInt(value, 10);

  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`${key} must be a positive integer`);
  }

  return number;
};

const requireValue = (env: EnvInput, key: ConfigKey): string => {
  const value = valueFromEnv(env, key);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
};

const validateRequiredValues = (env: EnvInput): void => {
  const missingKeys = requiredKeys.filter((key) => !valueFromEnv(env, key));

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
  }
};

export const loadConfig = (env: EnvInput = process.env): AppConfig => {
  validateRequiredValues(env);

  const nodeEnv = parseEnum('NODE_ENV', requireValue(env, 'NODE_ENV'), NODE_ENV_VALUES);
  const logLevel = parseEnum('LOG_LEVEL', requireValue(env, 'LOG_LEVEL'), LOG_LEVEL_VALUES);
  const logRotationFrequency = parseEnum(
    'LOG_ROTATION_FREQUENCY',
    requireValue(env, 'LOG_ROTATION_FREQUENCY'),
    LOG_ROTATION_FREQUENCY_VALUES
  );
  const endpoint = valueFromEnv(env, 'DYNAMODB_ENDPOINT');

  return {
    server: { env: nodeEnv, host: requireValue(env, 'HOST'), port: parsePort(requireValue(env, 'PORT')) },
    logger: {
      level: logLevel,
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        'req.headers["x-amz-security-token"]',
        'config.jwt.secret',
        'jwt.secret',
      ],
      console: { enabled: parseBoolean('LOG_CONSOLE_ENABLED', requireValue(env, 'LOG_CONSOLE_ENABLED')) },
      file: {
        enabled: parseBoolean('LOG_FILE_ENABLED', requireValue(env, 'LOG_FILE_ENABLED')),
        path: requireValue(env, 'LOG_FILE_PATH'),
        rotationFrequency: logRotationFrequency,
        rotationSize: requireValue(env, 'LOG_ROTATION_SIZE'),
        retentionCount: parsePositiveInteger('LOG_RETENTION_COUNT', requireValue(env, 'LOG_RETENTION_COUNT')),
      },
    },
    dynamodb: {
      region: requireValue(env, 'DYNAMODB_REGION'),
      tableName: requireValue(env, 'DYNAMODB_TABLE_NAME'),
      ...(endpoint ? { endpoint } : {}),
    },
    jwt: { secret: requireValue(env, 'JWT_SECRET'), expiresIn: requireValue(env, 'JWT_EXPIRES_IN') },
    openapi: { routePrefix: requireValue(env, 'OPENAPI_ROUTE_PREFIX') },
  };
};

export const createLoggerOptions = (config: AppConfig): FastifyServerOptions['logger'] => {
  const targets = [
    ...(config.logger.console.enabled ? [{ target: 'pino/file', options: { destination: 1 } }] : []),
    ...(config.logger.file.enabled
      ? [
          {
            target: 'pino-roll',
            options: {
              file: config.logger.file.path,
              frequency: config.logger.file.rotationFrequency,
              limit: { count: config.logger.file.retentionCount },
              mkdir: true,
              size: config.logger.file.rotationSize,
            },
          },
        ]
      : []),
  ];

  if (targets.length === 0) {
    return false;
  }

  return { level: config.logger.level, redact: config.logger.redact, transport: { targets } };
};
