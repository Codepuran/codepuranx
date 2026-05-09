import {
  DeleteCommand,
  type DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { roleKey } from '../db/keys.js';
import type { CreateRoleInput, Role, UpdateRoleInput } from '../domain/role.js';
import type { Clock } from './clock.js';
import { isRoleRecord, type RoleRecord, roleFromRecord } from './records.js';

export type RoleRepositoryOptions = { clock: Clock; tableName: string };

export class RoleRepository {
  constructor(
    private readonly documentClient: DynamoDBDocumentClient,
    private readonly options: RoleRepositoryOptions
  ) {}

  async create(input: CreateRoleInput): Promise<Role> {
    const now = this.options.clock.now();
    const record: RoleRecord = {
      ...roleKey(input.id),
      entityType: 'ROLE',
      id: input.id,
      name: input.name,
      permissions: input.permissions ?? [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    await this.documentClient.send(
      new PutCommand({
        TableName: this.options.tableName,
        Item: record,
        ConditionExpression: 'attribute_not_exists(pk)',
      })
    );

    return roleFromRecord(record);
  }

  async getById(roleId: string): Promise<Role | undefined> {
    const response = await this.documentClient.send(
      new GetCommand({ TableName: this.options.tableName, Key: roleKey(roleId) })
    );

    if (!isRoleRecord(response.Item)) {
      return undefined;
    }

    return roleFromRecord(response.Item);
  }

  async update(roleId: string, input: UpdateRoleInput): Promise<Role | undefined> {
    const now = this.options.clock.now();
    const names: Record<string, string> = { '#updatedAt': 'updatedAt', '#version': 'version' };
    const values: Record<string, unknown> = { ':updatedAt': now, ':versionIncrement': 1 };
    const assignments = ['#updatedAt = :updatedAt', '#version = #version + :versionIncrement'];

    if (input.name !== undefined) {
      names['#name'] = 'name';
      values[':name'] = input.name;
      assignments.push('#name = :name');
    }

    if (input.permissions !== undefined) {
      names['#permissions'] = 'permissions';
      values[':permissions'] = input.permissions;
      assignments.push('#permissions = :permissions');
    }

    const response = await this.documentClient.send(
      new UpdateCommand({
        TableName: this.options.tableName,
        Key: roleKey(roleId),
        ConditionExpression: 'attribute_exists(pk)',
        UpdateExpression: `SET ${assignments.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!isRoleRecord(response.Attributes)) {
      return undefined;
    }

    return roleFromRecord(response.Attributes);
  }

  async delete(roleId: string): Promise<void> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: this.options.tableName,
        Key: roleKey(roleId),
        ConditionExpression: 'attribute_exists(pk)',
      })
    );
  }
}
