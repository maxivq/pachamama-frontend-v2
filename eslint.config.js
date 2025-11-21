import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['dist/**'],
  },

  // Config general para código de app (.js y .vue, excepto tests)
  {
    files: ['src/**/*.{js,vue}'],
    ignores: ['src/tests/**'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Navegador
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        alert: 'readonly',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      'vue/html-indent': ['warn', 2],
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },

  // Config específica para tests (Vitest)
  {
    files: ['src/tests/**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        // también describe, it, vi si los usás
        describe: 'readonly',
        it: 'readonly',
        vi: 'readonly',
        localStorage: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off', // ya definimos los globals de test
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];