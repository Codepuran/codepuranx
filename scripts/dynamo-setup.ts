import 'dotenv/config';
import { CreateTableCommand, DescribeTableCommand, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { loadConfig } from '../src/config/index.js';
import { createDynamoDBClient } from '../src/db/client.js';

const config = loadConfig();
const client = createDynamoDBClient(config.dynamodb);

try {
  await client.send(
    new CreateTableCommand({
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      TableName: config.dynamodb.tableName,
    })
  );
} catch (error) {
  if (!(error instanceof ResourceInUseException)) {
    throw error;
  }
}

const table = await client.send(new DescribeTableCommand({ TableName: config.dynamodb.tableName }));

console.log(JSON.stringify({ status: 'ok', table: table.Table?.TableName, tableStatus: table.Table?.TableStatus }));
