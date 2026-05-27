import {
  DeleteCommand,
  type DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { todoKey, userTodoSortKeyPrefix } from '../db/keys.js';
import { decodeCursor, encodeCursor, normalizeLimit, type PageInput, type PageResult } from '../db/pagination.js';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/todo.js';
import type { Clock } from './clock.js';
import { isTodoRecord, type TodoRecord, todoFromRecord } from './records.js';

export type TodoRepositoryOptions = { clock: Clock; tableName: string };

export class TodoRepository {
  constructor(
    private readonly documentClient: DynamoDBDocumentClient,
    private readonly options: TodoRepositoryOptions
  ) {}

  async create(input: CreateTodoInput): Promise<Todo> {
    const now = this.options.clock.now();
    const record: TodoRecord = {
      ...todoKey(input.userId, input.id),
      entityType: 'TODO',
      id: input.id,
      userId: input.userId,
      title: input.title,
      ...(input.description ? { description: input.description } : {}),
      status: 'open',
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

    return todoFromRecord(record);
  }

  async getById(userId: string, todoId: string): Promise<Todo | undefined> {
    const response = await this.documentClient.send(
      new GetCommand({ TableName: this.options.tableName, Key: todoKey(userId, todoId) })
    );

    if (!isTodoRecord(response.Item)) {
      return undefined;
    }

    return todoFromRecord(response.Item);
  }

  async listByUser(userId: string, page: PageInput = {}): Promise<PageResult<Todo>> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.options.tableName,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
        ExpressionAttributeValues: { ':pk': `USER#${userId}`, ':skPrefix': userTodoSortKeyPrefix() },
        ExclusiveStartKey: decodeCursor(page.cursor),
        Limit: normalizeLimit(page.limit),
      })
    );

    const cursor = encodeCursor(response.LastEvaluatedKey);

    return { items: (response.Items ?? []).filter(isTodoRecord).map(todoFromRecord), ...(cursor ? { cursor } : {}) };
  }

  async update(userId: string, todoId: string, input: UpdateTodoInput): Promise<Todo | undefined> {
    const now = this.options.clock.now();
    const names: Record<string, string> = { '#updatedAt': 'updatedAt', '#version': 'version' };
    const values: Record<string, unknown> = { ':updatedAt': now, ':versionIncrement': 1 };
    const assignments = ['#updatedAt = :updatedAt', '#version = #version + :versionIncrement'];

    if (input.title !== undefined) {
      names['#title'] = 'title';
      values[':title'] = input.title;
      assignments.push('#title = :title');
    }

    if (input.description !== undefined) {
      names['#description'] = 'description';
      values[':description'] = input.description;
      assignments.push('#description = :description');
    }

    if (input.status !== undefined) {
      names['#status'] = 'status';
      values[':status'] = input.status;
      assignments.push('#status = :status');
    }

    const response = await this.documentClient.send(
      new UpdateCommand({
        TableName: this.options.tableName,
        Key: todoKey(userId, todoId),
        ConditionExpression: 'attribute_exists(pk)',
        UpdateExpression: `SET ${assignments.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!isTodoRecord(response.Attributes)) {
      return undefined;
    }

    return todoFromRecord(response.Attributes);
  }

  async delete(userId: string, todoId: string): Promise<void> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: this.options.tableName,
        Key: todoKey(userId, todoId),
        ConditionExpression: 'attribute_exists(pk)',
      })
    );
  }
}
