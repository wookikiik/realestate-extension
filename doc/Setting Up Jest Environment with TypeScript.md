# Setting Up Jest Environment with TypeScript

This guide will walk you through the process of setting up a Jest testing environment with TypeScript. Jest is a popular JavaScript testing framework, and TypeScript is a statically typed superset of JavaScript that adds types.

## Step 1: Install Dependencies

First, you need to install Jest, the Jest globals package, and ts-jest, a TypeScript preprocessor for Jest. You can do this by running the following command in your terminal:

```bash
yarn add -D jest @jest/globals ts-jest
```

## Step 2: Create Jest Configuration File

Next, you need to create a Jest configuration file. You can do this by running the following command:

```bash
yarn ts-jest config:init
```

This command creates a `jest.config.js` file with a basic ts-jest configuration.

## Step 3: Add TypeScript Configuration File for Jest

Next, you need to create a TypeScript configuration file specifically for Jest. You can do this by running the following command:

```bash
touch test/tsconfig.test.json
```

Then, add the following configuration to the `tsconfig.test.json` file:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "emitDeclarationOnly": false,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "types": ["@jest/globals"]
  },
  "include": ["./**/*"]
}
```

This configuration extends your main TypeScript configuration and includes all TypeScript files in the `test` directory and its subdirectories.

## Step 4: Configure Jest

Finally, you need to configure Jest to use the TypeScript configuration file you created. Modify your `jest.config.js` file to look like this:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'Unit test chrome extension share scripts',
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/src/share/**/*.ts'],
  modulePathIgnorePatterns: [],
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: '<rootDir>/test/tsconfig.json' }],
  },
  coverageReporters: ['html'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.(spec|test).ts'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '~~/(.*)$': '<rootDir>/$1',
  },
}
```

In this configuration:

- `displayName` is a label for the test suite.
- `preset` is set to 'ts-jest', which means Jest will use ts-jest for transpiling.
- `collectCoverageFrom` specifies which files Jest should collect code coverage information from.
- `transform` tells Jest to use ts-jest to transpile TypeScript files before testing them, and specifies the location of the TypeScript configuration file.
- `coverageReporters` specifies that Jest should output coverage reports in HTML format.
- `testEnvironment` is set to 'node', which means Jest will run tests in a Node.js environment.
- `testMatch` specifies the pattern Jest uses to locate test files.
- `moduleNameMapper` allows you to set up path aliases.

That's it! You've now set up a Jest testing environment with TypeScript. Happy testing!
