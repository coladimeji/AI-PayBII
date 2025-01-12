// jest.config.ts
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/**/*.d.ts',
      '!src/types/**/*.ts',
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  };