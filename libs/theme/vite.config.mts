/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/theme',
  plugins: [angular()],
  resolve: {
    alias: {
      '@nucleus/common': path.resolve(__dirname, '../common/src/index.ts'),
      '@nucleus/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@nucleus/core/auth': path.resolve(__dirname, '../core/src/lib/ext/auth/index.ts'),
      '@nucleus/core/crud': path.resolve(__dirname, '../core/src/lib/ext/crud/index.ts'),
      '@nucleus/core/store': path.resolve(__dirname, '../core/src/lib/ext/store/index.ts'),
      '@nucleus/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      '@nucleus/l10n': path.resolve(__dirname, '../l10n/src/index.ts'),
      '@nucleus/panel': path.resolve(__dirname, '../panel/src/index.ts'),
      '@nucleus/theme': path.resolve(__dirname, '../theme/src/index.ts'),
      '@test-mocks': path.resolve(__dirname, '../../utils/test-mocks.ts'),
    },
  },
  test: {
    name: 'theme',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/theme',
      provider: 'v8' as const,
    },
  },
}));
