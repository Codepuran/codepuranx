import { type DynamoDBDocumentClient, GetCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { userEmailUniqueKey, userKey } from '../db/keys.js';
import type { CreateUserInput, UpdateUserInput, User } from '../domain/user.js';
import type { Clock } from './clock.js';
import { isUserRecord, type UserEmailUniqueRecord, type UserRecord, userFromRecord } from './records.js';

export type UserRepositoryOptions = { clock: Clock; tableName: string };

export class UserRepository {
  constructor(
    private readonly documentClient: DynamoDBDocumentClient,
    private readonly options: UserRepositoryOptions
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const now = this.options.clock.now();
    const key = userKey(input.id);
    const emailKey = userEmailUniqueKey(input.email);
    const record: UserRecord = {
      ...key,
      entityType: 'USER',
      id: input.id,
      email: input.email.trim().toLowerCase(),
      name: input.name,
      roleIds: input.roleIds ?? [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    const emailRecord: UserEmailUniqueRecord = {
      ...emailKey,
      entityType: 'USER_EMAIL',
      email: record.email,
      userId: input.id,
    };

    await this.documentClient.send(
      new TransactWriteCommand({
        TransactItems: [
          { Put: { TableName: this.options.tableName, Item: record, ConditionExpression: 'attribute_not_exists(pk)' } },
          {
            Put: {
              TableName: this.options.tableName,
              Item: emailRecord,
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          },
        ],
      })
    );

    return userFromRecord(record);
  }

  async getById(userId: string): Promise<User | undefined> {
    const response = await this.documentClient.send(
      new GetCommand({ TableName: this.options.tableName, Key: userKey(userId) })
    );

    if (!isUserRecord(response.Item)) {
      return undefined;
    }

    return userFromRecord(response.Item);
  }

  async update(userId: string, input: UpdateUserInput): Promise<User | undefined> {
    const now = this.options.clock.now();
    const names: Record<string, string> = { '#updatedAt': 'updatedAt', '#version': 'version' };
    const values: Record<string, unknown> = { ':updatedAt': now, ':versionIncrement': 1 };
    const assignments = ['#updatedAt = :updatedAt', '#version = #version + :versionIncrement'];

    if (input.name !== undefined) {
      names['#name'] = 'name';
      values[':name'] = input.name;
      assignments.push('#name = :name');
    }

    if (input.roleIds !== undefined) {
      names['#roleIds'] = 'roleIds';
      values[':roleIds'] = input.roleIds;
      assignments.push('#roleIds = :roleIds');
    }

    const response = await this.documentClient.send(
      new UpdateCommand({
        TableName: this.options.tableName,
        Key: userKey(userId),
        ConditionExpression: 'attribute_exists(pk)',
        UpdateExpression: `SET ${assignments.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!isUserRecord(response.Attributes)) {
      return undefined;
    }

    return userFromRecord(response.Attributes);
  }

  async delete(userId: string, email: string): Promise<void> {
    await this.documentClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: this.options.tableName,
              Key: userKey(userId),
              ConditionExpression: 'attribute_exists(pk)',
            },
          },
          { Delete: { TableName: this.options.tableName, Key: userEmailUniqueKey(email) } },
        ],
      })
    );
  }
}
