export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '../../',
  moduleNameMapper: {'^(../(models|services|utils|controllers|errors|types|validators|middleware)/.*)\\.js$': '$1.ts'},
};