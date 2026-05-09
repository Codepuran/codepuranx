import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { UserRepository } from '../../src/repositories/user-repository.js';
import { FakeDocumentClient } from '../helpers/fake-document-client.js';

const clock = { now: () => '2026-01-01T00:00:00.000Z' };

describe('UserRepository', () => {
  it('creates user and email uniqueness guard transactionally', async () => {
    const fake = new FakeDocumentClient();
    const repository = new UserRepository(fake as unknown as DynamoDBDocumentClient, { clock, tableName: 'table' });

    const user = await repository.create({ id: 'u1', email: ' Person@Example.COM ', name: 'Person' });

    expect(user).toMatchObject({ id: 'u1', email: 'person@example.com', name: 'Person', roleIds: [], version: 1 });
    expect(fake.sent[0]?.constructor.name).toBe('TransactWriteCommand');
    expect(fake.sent[0]?.input).toMatchObject({
      TransactItems: [
        { Put: { TableName: 'table', Item: { pk: 'USER#u1', sk: 'PROFILE', entityType: 'USER' } } },
        {
          Put: {
            TableName: 'table',
            Item: { pk: 'USER_EMAIL#person@example.com', sk: 'UNIQUE', entityType: 'USER_EMAIL', userId: 'u1' },
          },
        },
      ],
    });
  });
});
