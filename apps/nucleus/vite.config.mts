/// <reference types='vitest' />

import path from 'node:path';
import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import { getPathAlias } from '../../utils/path-alias';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/nucleus',
  plugins: [angular()],
  resolve: { alias: getPathAlias() },
  test: {
    name: 'nucleus',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/nucleus',
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
