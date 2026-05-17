/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '../../coverage/apps/backend',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^\\.\\./\\.\\./src/(.*)\\.js$': '<rootDir>/src/$1.ts',
    '^\\.\\./(db|domain|repositories|schemas|services)/(.*)\\.js$': '<rootDir>/src/$1/$2.ts',
    '^\\.\\./auth/(.*)\\.js$': '<rootDir>/src/auth/$1.ts',
    '^\\.\\./helpers/(.*)\\.js$': '<rootDir>/tests/helpers/$1.ts',
    '^\\./(clock|records)\\.js$': '<rootDir>/src/repositories/$1.ts',
    '^\\./(auth|config)\\/(.*)\\.js$': '<rootDir>/src/$1/$2.ts',
    '^\\./(errors|repository-errors|role-service|todo-service|user-service)\\.js$': '<rootDir>/src/services/$1.ts',
    '^\\./(plugins|routes|schemas)/(.*)\\.js$': '<rootDir>/src/$1/$2.ts',
    '^\\./auth\\.js$': '<rootDir>/src/routes/auth.ts',
    '^\\./(api|common|health|role|todo|user)\\.js$': '<rootDir>/src/schemas/$1.ts',
    '^\\./(roles|todos|users)\\.js$': '<rootDir>/src/routes/$1.ts',
  },
  passWithNoTests: true,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      { jsc: { parser: { syntax: 'typescript' }, target: 'es2024' }, module: { type: 'es6' } },
    ],
  },
};
