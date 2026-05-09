import { buildApp } from "./app.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

if (Number.isNaN(port)) {
  throw new Error("PORT must be a valid number");
}

const app = await buildApp({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    redact: ["req.headers.authorization", "req.headers.cookie"],
  },
});

const close = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, "closing server");
  await app.close();
};

process.once("SIGINT", (signal) => {
  close(signal).then(
    () => {
      process.exit(0);
    },
    (error: unknown) => {
      app.log.error({ error }, "failed to close server");
      process.exit(1);
    }
  );
});

process.once("SIGTERM", (signal) => {
  close(signal).then(
    () => {
      process.exit(0);
    },
    (error: unknown) => {
      app.log.error({ error }, "failed to close server");
      process.exit(1);
    }
  );
});

try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error({ error }, "failed to start server");
  process.exit(1);
}
