/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^\\.\\./\\.\\./src/(.*)\\.js$": "<rootDir>/src/$1.ts",
    "^\\./(plugins|routes)/(.*)\\.js$": "<rootDir>/src/$1/$2.ts",
  },
  passWithNoTests: true,
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      { jsc: { parser: { syntax: "typescript" }, target: "es2024" }, module: { type: "es6" } },
    ],
  },
};
