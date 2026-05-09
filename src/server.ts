import { buildApp } from './app.js';
import { createLoggerOptions, loadConfig } from './config/index.js';

const config = loadConfig();

const app = await buildApp({ logger: createLoggerOptions(config) });

const close = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, 'closing server');
  await app.close();
};

process.once('SIGINT', (signal) => {
  close(signal).then(
    () => {
      process.exit(0);
    },
    (error: unknown) => {
      app.log.error({ error }, 'failed to close server');
      process.exit(1);
    }
  );
});

process.once('SIGTERM', (signal) => {
  close(signal).then(
    () => {
      process.exit(0);
    },
    (error: unknown) => {
      app.log.error({ error }, 'failed to close server');
      process.exit(1);
    }
  );
});

try {
  await app.listen({ host: config.server.host, port: config.server.port });
} catch (error) {
  app.log.error({ error }, 'failed to start server');
  process.exit(1);
}
