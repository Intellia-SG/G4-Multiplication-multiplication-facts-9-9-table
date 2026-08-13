import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // New JSX transform (React 17+) — no need to import React in scope
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Several files intentionally export a constant alongside the default
      // component (e.g. FLOAT_ITEMS, JOURNEY_ITEMS) — fine for this app's
      // size; downgraded from error so it doesn't block CI.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
