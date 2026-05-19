import awsLambdaFastify from '@fastify/aws-lambda';
import { type BuildAppOptions, buildApp } from './app.js';
import { createLoggerOptions, loadConfig } from './config/index.js';

export type LambdaHandler = (event: unknown, context: unknown) => Promise<unknown>;

export const buildLambdaHandler = async (options: BuildAppOptions = {}): Promise<LambdaHandler> => {
  const config = options.config ?? loadConfig();
  const app = await buildApp({
    config,
    ...(options.dependencies ? { dependencies: options.dependencies } : {}),
    logger: options.logger ?? createLoggerOptions(config),
  });

  const handler = awsLambdaFastify(app) as LambdaHandler;
  await app.ready();

  return handler;
};

let lambdaHandlerPromise: Promise<LambdaHandler> | undefined;

const getLambdaHandler = async (): Promise<LambdaHandler> => {
  if (!lambdaHandlerPromise) {
    lambdaHandlerPromise = buildLambdaHandler();
  }

  return lambdaHandlerPromise;
};

export const handler: LambdaHandler = async (event, context) => {
  const lambdaHandler = await getLambdaHandler();
  return lambdaHandler(event, context);
};
