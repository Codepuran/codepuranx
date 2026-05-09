import "dotenv/config";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { loadConfig } from "../src/config/index.js";
import { createDynamoDBClient } from "../src/db/client.js";

const config = loadConfig();
const client = createDynamoDBClient(config.dynamodb);
const table = await client.send(new DescribeTableCommand({ TableName: config.dynamodb.tableName }));

console.log(JSON.stringify({ status: "ok", table: table.Table?.TableName, tableStatus: table.Table?.TableStatus }));
