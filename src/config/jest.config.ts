export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '../../',
  moduleNameMapper: {
    '^../services/(.*)\\.js$': '<rootDir>/src/services/$1.ts',
    '^../utils/(.*)\\.js$': '<rootDir>/src/utils/$1.ts',
    '^../controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1.ts',
    '^../errors/(.*)\\.js$': '<rootDir>/src/errors/$1.ts',
    '^../types/(.*)\\.js$': '<rootDir>/src/types/$1.ts',
  },
};
