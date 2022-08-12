const { join } = require("path");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: "jsdom",

  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },

  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],

  testMatch: ["**/src/test/**/?(*.)test.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/"],

  reporters: ["default"],

  coverageReporters: ["lcov", "text"],
  coverageDirectory: "./artifacts/coverage-jest/",
  collectCoverageFrom: [
    "src/main/**/*.{ts,tsx}",
    "!test/**",
    "!**/node_modules/**",
  ],

  setupFiles: [join(__dirname, "./src/test/config/setupTests.ts")],
  setupFilesAfterEnv: [join(__dirname, "./src/test/config/jest.setup.ts")],

  moduleNameMapper: {
    "^.+\\.(css)$": "identity-obj-proxy",
  },

  slowTestThreshold: 10,

  globals: {
    "ts-jest": {
      tsconfig: "src/tsconfig.json",
    },
  },
};
