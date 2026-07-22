/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ui',
  plugins: [angular()],
  resolve: {
    alias: {
      '@nucleus/common': path.resolve(__dirname, '../common/src/index.ts'),
      '@nucleus/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@nucleus/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      '@nucleus/l10n': path.resolve(__dirname, '../l10n/src/index.ts'),
      '@nucleus/panel': path.resolve(__dirname, '../panel/src/index.ts'),
      '@nucleus/theme': path.resolve(__dirname, '../theme/src/index.ts'),
      '@test-mocks': path.resolve(__dirname, '../../utils/test-mocks.ts'),
    },
  },
  test: {
    name: 'ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/ui',
      provider: 'v8' as const,
    },
  },
}));
