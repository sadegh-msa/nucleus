import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [angular()],
  resolve: {
    alias: [
      { find: /^@nucleus\/core\/auth$/, replacement: path.resolve(__dirname, '../../libs/core/src/lib/ext/auth/index.ts') },
      { find: /^@nucleus\/core\/crud$/, replacement: path.resolve(__dirname, '../../libs/core/src/lib/ext/crud/index.ts') },
      { find: /^@nucleus\/core\/store$/, replacement: path.resolve(__dirname, '../../libs/core/src/lib/ext/store/index.ts') },
      { find: '@nucleus/common', replacement: path.resolve(__dirname, '../../libs/common/src/index.ts') },
      { find: '@nucleus/core', replacement: path.resolve(__dirname, '../../libs/core/src/index.ts') },
      { find: '@nucleus/ui', replacement: path.resolve(__dirname, '../../libs/ui/src/index.ts') },
      { find: '@nucleus/l10n', replacement: path.resolve(__dirname, '../../libs/l10n/src/index.ts') },
      { find: '@nucleus/panel', replacement: path.resolve(__dirname, '../../libs/panel/src/index.ts') },
      { find: '@nucleus/theme', replacement: path.resolve(__dirname, '../../libs/theme/src/index.ts') },
      { find: '@test-mocks', replacement: path.resolve(__dirname, '../../utils/test-mocks.ts') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
