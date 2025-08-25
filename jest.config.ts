import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^server-only$': '<rootDir>/test/mocks/server-only.ts',
  },
  testMatch: [
    '**/*.(test|spec).(ts|tsx)',
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
  ],
  setupFilesAfterEnv: [],
  clearMocks: true,
};

export default config;
