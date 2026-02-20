import configPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default [
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']
    },

    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json'
            }
        }
    },

    configPrettier,

    {
        plugins: {
            prettier,
            import: importPlugin
        },

        rules: {
            'prettier/prettier': 'warn',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': 'error',

            'import/order': [
                'warn',
                {
                    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always'
                }
            ],

            'no-console': 'off',
            'no-undef': 'off'
        }
    }
];
