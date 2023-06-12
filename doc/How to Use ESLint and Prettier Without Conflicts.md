# How to Use ESLint and Prettier Without Conflicts

This guide will walk you through the process of setting up ESLint and Prettier in your project without any conflicts. Both of these tools are widely used in the JavaScript ecosystem to enforce code style and catch potential bugs.

## Step 1: Install Dependencies

First, you need to install ESLint, Prettier, and their respective plugins. You can do this by running the following command in your terminal:

```bash
yarn add -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

This command installs the following packages:

- `eslint`: The core ESLint library
- `prettier`: The core Prettier library
- `eslint-plugin-prettier`: A plugin that allows ESLint to recognize Prettier rules
- `eslint-config-prettier`: A configuration that turns off ESLint rules that conflict with Prettier

## Step 2: Configure ESLint

Next, you need to configure ESLint to use the Prettier plugin and configuration. To do this, you need to modify your `.eslintrc.js` file.

If you don't have this file in your project, you can create it. This file is where you define your ESLint rules.

Here's what your `.eslintrc.js` file should look like:

```json
module.exports = {
  ...
  extends: [
    'plugin:prettier/recommended',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

In this configuration:

- The `extends` field is an array that specifies the configurations that this configuration extends. The `'plugin:prettier/recommended'` configuration turns on the `prettier/prettier` rule.
- The `plugins` field is an array that lists the plugins that are used in this configuration. The `'prettier'` plugin allows ESLint to recognize Prettier rules.
- The `rules` field is an object that specifies the rules of this configuration. The `'prettier/prettier': 'error'` rule makes all unformatted code produce an error.

That's it! You've now set up ESLint and Prettier in your project without any conflicts. Happy coding!
