import { randomBytes, randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadDotenv } from 'dotenv';
import { hashPassword } from '../src/auth/password.js';
import { loadConfig } from '../src/config/index.js';
import { createAppDependencies } from '../src/plugins/dependencies.js';

type OnboardAdminArgs = { email: string; password?: string };

const defaultEmail = 'admin@codepuran.com';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendDir = resolve(scriptDir, '..');
const repoRoot = resolve(backendDir, '..', '..');

loadDotenv({ path: resolve(repoRoot, '.env'), override: false });
loadDotenv({ path: resolve(backendDir, '.env'), override: false });

process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'dummy';
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'dummy';
process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';

const requireEnv = (name: string, value: string | undefined): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(`Missing required environment variable: ${name}`);
};

const parseArgs = (argv: string[]): OnboardAdminArgs => {
  const positional = argv.filter((arg) => !arg.startsWith('--'));
  const emailFlagIndex = argv.indexOf('--email');
  const passwordFlagIndex = argv.indexOf('--password');

  const email = (emailFlagIndex >= 0 ? argv[emailFlagIndex + 1] : undefined) ?? positional[0] ?? defaultEmail;

  const password = (passwordFlagIndex >= 0 ? argv[passwordFlagIndex + 1] : undefined) ?? positional[1];

  return { email, ...(password ? { password } : {}) };
};

const generateStrongPassword = (length = 24): string => {
  return randomBytes(length).toString('base64url').slice(0, length);
};

const main = async (): Promise<void> => {
  const { email, password } = parseArgs(process.argv.slice(2));
  const finalPassword = password ?? generateStrongPassword();
  const config = loadConfig();
  requireEnv('DYNAMODB_TABLE_NAME', config.dynamodb.tableName);
  requireEnv('DYNAMODB_REGION', config.dynamodb.region);
  requireEnv('JWT_SECRET', config.jwt.secret);

  if (!config.dynamodb.endpoint) {
    throw new Error('Missing required DynamoDB endpoint. Set DYNAMODB_ENDPOINT in .env or apps/backend/.env');
  }

  const dependencies = createAppDependencies(config);
  const userRepository = dependencies.repositories.user;

  const existingUser = await userRepository.getByEmail(email);
  const passwordHash = hashPassword(finalPassword);
  const name = email.split('@')[0] || 'Admin';

  const user = existingUser
    ? await userRepository.update(existingUser.id, {
        name: existingUser.name ?? name,
        passwordHash,
        roleIds: ['admin'],
      })
    : await userRepository.create({ id: randomUUID(), email, name, passwordHash, roleIds: ['admin'] });

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        action: existingUser ? 'updated' : 'created',
        email: user?.email,
        userId: user?.id,
        password: password ? undefined : finalPassword,
        roleIds: user?.roleIds ?? [],
      },
      null,
      2
    )
  );
};

await main();
