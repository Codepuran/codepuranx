import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { TodoRepository } from '../../src/repositories/todo-repository.js';
import { FakeDocumentClient } from '../helpers/fake-document-client.js';

const clock = { now: () => '2026-01-01T00:00:00.000Z' };

describe('TodoRepository', () => {
  it('creates todo records with conditional writes', async () => {
    const fake = new FakeDocumentClient();
    const repository = new TodoRepository(fake as unknown as DynamoDBDocumentClient, { clock, tableName: 'table' });

    const todo = await repository.create({ id: 't1', userId: 'u1', title: 'Task' });

    expect(todo).toMatchObject({ id: 't1', userId: 'u1', title: 'Task', status: 'open', version: 1 });
    expect(fake.sent[0]?.constructor.name).toBe('PutCommand');
    expect(fake.sent[0]?.input).toMatchObject({
      TableName: 'table',
      Item: { pk: 'USER#u1', sk: 'TODO#t1', entityType: 'TODO' },
      ConditionExpression: 'attribute_not_exists(pk)',
    });
  });

  it('lists todos for one user using query and cursor pagination', async () => {
    const fake = new FakeDocumentClient();
    fake.queueResponse({
      Items: [
        {
          pk: 'USER#u1',
          sk: 'TODO#t1',
          entityType: 'TODO',
          id: 't1',
          userId: 'u1',
          title: 'Task',
          status: 'open',
          createdAt: clock.now(),
          updatedAt: clock.now(),
          version: 1,
        },
      ],
      LastEvaluatedKey: { pk: 'USER#u1', sk: 'TODO#t1' },
    });
    const repository = new TodoRepository(fake as unknown as DynamoDBDocumentClient, { clock, tableName: 'table' });

    const page = await repository.listByUser('u1', { limit: 10 });

    expect(page.items).toHaveLength(1);
    expect(page.cursor).toBeDefined();
    expect(fake.sent[0]?.constructor.name).toBe('QueryCommand');
    expect(fake.sent[0]?.input).toMatchObject({
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
      ExpressionAttributeValues: { ':pk': 'USER#u1', ':skPrefix': 'TODO#' },
      Limit: 10,
    });
  });
});
