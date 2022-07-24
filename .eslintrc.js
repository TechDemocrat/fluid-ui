const { rootDir, tsconfigPath } = require('./scripts/getTsConfigRelativePath');

module.exports = {
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:storybook/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'import'],
    env: {
        browser: true,
        es6: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        // Set the root directory of the repo - now preserving symlinks
        tsconfigRootDir: rootDir,
        // Path of tsconfig.json - now preserving symlinks
        project: tsconfigPath,
    },
    rules: {
        'linebreak-style': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
                tabWidth: 4,
                singleQuote: true,
            },
        ],
        'import/no-extraneous-dependencies': 'off',
        'import/named': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
    },
};
