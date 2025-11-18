import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': [
        'error',
        2,
        { offsetTernaryExpressions: true, SwitchCase: 1 },
      ],
      '@stylistic/linebreak-style': ['error', 'windows'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      'no-console': ['warn'],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          arrowParens: 'always',
          endOfLine: 'auto',
          trailingComma: 'all',
        },
      ],
    },
  },
];
