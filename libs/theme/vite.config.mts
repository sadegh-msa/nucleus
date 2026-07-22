/// <reference types='vitest' />

import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import { getPathAlias } from '../../utils/path-alias';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/theme',
  plugins: [angular()],
  resolve: { alias: getPathAlias() },
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
