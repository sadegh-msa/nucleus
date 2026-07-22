/// <reference types='vitest' />

import path from 'node:path';
import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import { getPathAlias } from '../../utils/path-alias';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/theme',
  plugins: [angular()],
  resolve: { alias: getPathAlias() },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, '../ui/src/lib/ext/styles')],
      },
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
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
