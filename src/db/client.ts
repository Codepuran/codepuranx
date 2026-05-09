import { DynamoDBClient, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { AppConfig } from "../config/index.js";

export type DynamoClients = { client: DynamoDBClient; documentClient: DynamoDBDocumentClient };

export const createDynamoDBClient = (config: AppConfig["dynamodb"]): DynamoDBClient => {
  const clientConfig: DynamoDBClientConfig = {
    region: config.region,
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
  };

  return new DynamoDBClient(clientConfig);
};

export const createDynamoDBDocumentClient = (client: DynamoDBClient): DynamoDBDocumentClient => {
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { convertClassInstanceToMap: false, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });
};

export const createDynamoClients = (config: AppConfig["dynamodb"]): DynamoClients => {
  const client = createDynamoDBClient(config);
  return { client, documentClient: createDynamoDBDocumentClient(client) };
};
