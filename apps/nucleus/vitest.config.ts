import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@nucleus/common': path.resolve(__dirname, '../../libs/common/src/index.ts'),
      '@nucleus/core': path.resolve(__dirname, '../../libs/core/src/index.ts'),
      '@nucleus/core/auth': path.resolve(__dirname, '../../libs/core/src/lib/ext/auth/index.ts'),
      '@nucleus/core/crud': path.resolve(__dirname, '../../libs/core/src/lib/ext/crud/index.ts'),
      '@nucleus/core/store': path.resolve(__dirname, '../../libs/core/src/lib/ext/store/index.ts'),
      '@nucleus/ui': path.resolve(__dirname, '../../libs/ui/src/index.ts'),
      '@nucleus/l10n': path.resolve(__dirname, '../../libs/l10n/src/index.ts'),
      '@nucleus/panel': path.resolve(__dirname, '../../libs/panel/src/index.ts'),
      '@nucleus/theme': path.resolve(__dirname, '../../libs/theme/src/index.ts'),
      '@test-mocks': path.resolve(__dirname, '../../utils/test-mocks.ts'),
    },
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
