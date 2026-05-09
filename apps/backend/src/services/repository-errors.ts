import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { RepositoryError } from '../db/errors.js';
import { DomainError } from './errors.js';

export const toCreateDomainError = (entityName: string, error: unknown): DomainError => {
  if (error instanceof RepositoryError && error.code === 'CONFLICT') {
    return new DomainError(`${entityName} already exists`, 'ALREADY_EXISTS', error);
  }

  if (error instanceof ConditionalCheckFailedException) {
    return new DomainError(`${entityName} already exists`, 'ALREADY_EXISTS', error);
  }

  if (error instanceof RepositoryError) {
    return new DomainError(error.message, error.code, error);
  }

  return new DomainError(`Failed to create ${entityName.toLowerCase()}`, 'UNKNOWN', error);
};

export const toMutationDomainError = (entityName: string, error: unknown): DomainError => {
  if (error instanceof RepositoryError) {
    return new DomainError(error.message, error.code, error);
  }

  if (error instanceof ConditionalCheckFailedException) {
    return new DomainError(`${entityName} was changed or removed`, 'CONFLICT', error);
  }

  return new DomainError(`Failed to save ${entityName.toLowerCase()}`, 'UNKNOWN', error);
};
