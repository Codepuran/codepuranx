export type DomainErrorCode = 'ALREADY_EXISTS' | 'NOT_FOUND' | 'CONFLICT' | 'UNKNOWN';

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export const isDomainError = (error: unknown): error is DomainError => {
  return error instanceof DomainError;
};
