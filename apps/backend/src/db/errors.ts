import {
  ConditionalCheckFailedException,
  ResourceInUseException,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb';

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONFLICT' | 'NOT_FOUND' | 'UNKNOWN',
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export const mapDynamoError = (error: unknown): RepositoryError => {
  if (error instanceof ConditionalCheckFailedException) {
    return new RepositoryError('Conditional write failed', 'CONFLICT', error);
  }

  if (error instanceof ResourceNotFoundException) {
    return new RepositoryError('DynamoDB resource not found', 'NOT_FOUND', error);
  }

  if (error instanceof ResourceInUseException) {
    return new RepositoryError('DynamoDB resource is already in use', 'CONFLICT', error);
  }

  return new RepositoryError('Unexpected DynamoDB error', 'UNKNOWN', error);
};
