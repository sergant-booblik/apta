import eslintPluginImport from 'eslint-plugin-import';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default {
  files: ['./src/**/*.{ts,js}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    'unused-imports': unusedImports,
    'import': eslintPluginImport,
  },
  rules: {
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'no-console': ['error'],
    'no-debugger': 'warn',
    'no-alert': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    'unused-imports/no-unused-imports': 'error',
    'no-restricted-imports': ['warn', {
      paths: [],
      patterns: ['../*'],
    }],
  },
  ignores: ['dist', 'node_modules'],
};
