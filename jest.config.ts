import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: ['**/*.test.tsx', '**/*.spec.tsx'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: ['**/*.tsx'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/*.test.tsx',
    '/*.spec.tsx',
    'src/__tests__/setup.ts',
    'src/App.tsx',
    '/main.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
    },
  },
};

export default config;
