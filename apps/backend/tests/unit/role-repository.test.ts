import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { RoleRepository } from '../../src/repositories/role-repository.js';
import { FakeDocumentClient } from '../helpers/fake-document-client.js';

const clock = { now: () => '2026-01-01T00:00:00.000Z' };

describe('RoleRepository', () => {
  it('creates role records with conditional writes', async () => {
    const fake = new FakeDocumentClient();
    const repository = new RoleRepository(fake as unknown as DynamoDBDocumentClient, { clock, tableName: 'table' });

    const role = await repository.create({ id: 'admin', name: 'Admin' });

    expect(role).toMatchObject({ id: 'admin', name: 'Admin', version: 1 });
    expect(fake.sent[0]?.constructor.name).toBe('PutCommand');
    expect(fake.sent[0]?.input).toMatchObject({
      TableName: 'table',
      Item: { pk: 'ROLE#admin', sk: 'PROFILE', entityType: 'ROLE' },
      ConditionExpression: 'attribute_not_exists(pk)',
    });
  });
});
