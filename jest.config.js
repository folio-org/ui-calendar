const { join } = require('path');

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',

  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'src/tsconfig.json' }]
  },
  transformIgnorePatterns: ['node_modules/(?!@folio|ky)'],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  testMatch: ['**/src/**/?(*.)test.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', 'src/typings/'],

  reporters: ['default', 'jest-junit'],

  coverageReporters: ['lcov', 'text'],
  coverageDirectory: './artifacts/coverage-jest/',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/test/**',
    '!**/node_modules/**'
  ],

  setupFiles: [join(__dirname, './src/test/setupTests.ts')],
  setupFilesAfterEnv: [join(__dirname, './src/test/jest.setup.ts')],

  moduleNameMapper: {
    '^.+\\.(css|svg)$': 'identity-obj-proxy',

    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid')
  },

  slowTestThreshold: 10
};
