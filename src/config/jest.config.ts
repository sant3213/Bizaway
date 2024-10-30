export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '../../',
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1'},
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageReporters: ['text', 'html'],
};