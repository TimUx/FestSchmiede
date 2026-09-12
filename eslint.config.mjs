import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.env.FESTSCHMIEDE_REPO_ROOT ?? import.meta.dirname;
const runtimeNodeModules = process.env.FESTSCHMIEDE_ESLINT_RUNTIME_NODE_MODULES;

const loadFromRuntime = async (specifier, runtimePath) => {
  if (!runtimeNodeModules) {
    return import(specifier);
  }
  return import(pathToFileURL(path.join(runtimeNodeModules, runtimePath)).href);
};

const eslintModule = await loadFromRuntime('@eslint/js', '@eslint/js/src/index.js');
const tseslintModule = await loadFromRuntime('typescript-eslint', 'typescript-eslint/dist/index.js');
const eslint = eslintModule.default ?? eslintModule;
const tseslint = tseslintModule.default ?? tseslintModule;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/artifacts/**'],
  },
  {
    files: ['backend/src/**/*.ts', 'backend/modules/**/*.ts'],
    ignores: ['**/*.test.ts', '**/qa/**'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: repoRoot },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: repoRoot },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.test.ts', 'tests/**/*.ts', 'scripts/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['scripts/qa/**/*.k6.js'],
    languageOptions: {
      globals: {
        __ENV: 'readonly',
        __VU: 'readonly',
        __ITER: 'readonly',
      },
    },
  }
);
