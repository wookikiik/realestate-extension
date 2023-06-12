/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'Unit test chrome extension share scripts',
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/src/share/**/*.ts'],
  modulePathIgnorePatterns: [],
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: '<rootDir>/test/tsconfig.json' },
    ],
  },
  coverageReporters: ['html'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.(spec|test).ts'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '~~/(.*)$': '<rootDir>/$1',
  },
}
