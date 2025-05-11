/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  plugins: [
    'unused-imports',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.app.json',
  },
  rules: {
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'vue/singleline-html-element-content-newline': ['error', {
      'ignoreWhenNoAttributes': true,
      'ignoreWhenEmpty': true,
      'ignores': ['pre', 'textarea'],
    }],
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/return-in-computed-property': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    'no-restricted-imports': ['warn', {
      paths: [
        {
          name: '@/store',
          message: 'Specify import store module. Do not import whole store',
        },
        {
          name: '@/utils',
          message: 'Specify import util. Do not import whole util',
        },
      ],
      patterns: ['../*'],
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-alert': 'error',
  },
};
