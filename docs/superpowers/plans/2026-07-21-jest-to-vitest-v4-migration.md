# Jest → Vitest v4 Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all 7 projects from Jest 30 + jest-preset-angular to Vitest v4 with @analogjs/vitest-angular for Angular zoneless support.

**Architecture:** Replace Jest executor with @nx/vitest:test, swap jest-preset-angular for @analogjs/vitest-angular, convert jest.* APIs to vi.* APIs, and update tsconfig types. Tests remain co-located with source files.

**Tech Stack:** Vitest v4, @analogjs/vitest-angular, @nx/vitest, @vitest/coverage-v8, Vite 6+

## Global Constraints

- Vitest v4 requires Vite 6+ and Node 20+
- Use globals mode: `describe`/``it`/`expect` available globally, `vi` imported per-file
- Use `@analogjs/vitest-angular` with `{ zoneless: true }` for Angular zoneless support
- NO `angular()` plugin in vitest config (causes ESM CJS/ESM mismatch)
- Each vitest.config.ts needs `root: __dirname` for correct path resolution
- Each vitest.config.ts needs `resolve.alias` for monorepo path aliases (`@nucleus/*`, `@test-mocks`)
- Timer APIs: `vi.useFakeTimers()`, `vi.useRealTimers()`, `vi.advanceTimersByTime()`

---

## File Structure

**Create:**
- `vitest.config.ts` (root workspace config)
- `libs/common/vitest.config.ts`
- `libs/l10n/vitest.config.ts`
- `libs/ui/vitest.config.ts`
- `libs/core/vitest.config.ts`
- `libs/panel/vitest.config.ts`
- `libs/theme/vitest.config.ts`
- `apps/nucleus/vitest.config.ts`
- `libs/common/src/test-setup.ts` (replace jest-preset-angular setup)
- `libs/l10n/src/test-setup.ts`
- `libs/ui/src/test-setup.ts`
- `libs/core/src/test-setup.ts`
- `libs/panel/src/test-setup.ts`
- `libs/theme/src/test-setup.ts`
- `apps/nucleus/src/test-setup.ts`

**Modify (jest API → vi API):**
- 17 spec files with jest.fn/spyOn/Mock/etc.

**Delete (after migration):**
- `jest.config.ts` (root)
- `jest.preset.js`
- All per-project `jest.config.ts` files
- `@nx/jest`, `jest`, `jest-preset-angular`, `jest-environment-jsdom`, `ts-jest`, `@types/jest` from package.json

---

### Task 1: Install Vitest Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install vitest and related packages**

```bash
bun add -D vitest @nx/vitest @analogjs/vitest-angular @vitest/coverage-v8
```

- [ ] **Step 2: Remove jest dependencies**

```bash
bun remove @nx/jest jest jest-preset-angular jest-environment-jsdom ts-jest @types/jest
```

- [ ] **Step 3: Update root test script**

In `package.json`, change:
```json
"test": "jest"
```
to:
```json
"test": "vitest run"
```

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: install vitest v4 and remove jest dependencies"
```

---

### Task 2: Create Root Vitest Config

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create root vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add root vitest config"
```

---

### Task 3: Create Test Setup Files

**Files:**
- Modify: `libs/common/src/test-setup.ts`
- Modify: `libs/l10n/src/test-setup.ts`
- Modify: `libs/ui/src/test-setup.ts`
- Modify: `libs/core/src/test-setup.ts`
- Modify: `libs/panel/src/test-setup.ts`
- Modify: `libs/theme/src/test-setup.ts`
- Modify: `apps/nucleus/src/test-setup.ts`

- [ ] **Step 1: Update libs/common/src/test-setup.ts**

Replace the entire content with:
```typescript
import '@analogjs/vitest-angular/setup-testbed';

Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      importKey: vi.fn().mockResolvedValue({}),
      encrypt: vi.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
        const bytes = new Uint8Array(data);
        let binary = '';
        bytes.forEach((b: number) => {
          binary += String.fromCharCode(b);
        });
        return new TextEncoder().encode(btoa(binary));
      }),
      decrypt: vi.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
        const base64Str = new TextDecoder().decode(data);
        const binary = atob(base64Str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }),
    },
    getRandomValues: (arr: any) => arr,
  },
  writable: true,
});
```

- [ ] **Step 2: Create test setup for other projects**

Each project's `src/test-setup.ts` should contain:
```typescript
import '@analogjs/vitest-angular/setup-testbed';
```

(Projects that don't need crypto mocking get a minimal setup.)

- [ ] **Step 3: Update utils/test-mocks.ts**

Replace `jest.fn()` with `vi.fn()`:
```typescript
export function setupGlobalMocks() {
  // ... existing code with jest.fn() replaced by vi.fn()
}
```

- [ ] **Step 4: Commit**

```bash
git add libs/common/src/test-setup.ts libs/l10n/src/test-setup.ts libs/ui/src/test-setup.ts libs/core/src/test-setup.ts libs/panel/src/test-setup.ts libs/theme/src/test-setup.ts apps/nucleus/src/test-setup.ts utils/test-mocks.ts
git commit -m "chore: update test setup files for vitest"
```

---

### Task 4: Create Per-Project Vitest Configs

**Files:**
- Create: `libs/common/vitest.config.ts`
- Create: `libs/l10n/vitest.config.ts`
- Create: `libs/ui/vitest.config.ts`
- Create: `libs/core/vitest.config.ts`
- Create: `libs/panel/vitest.config.ts`
- Create: `libs/theme/vitest.config.ts`
- Create: `apps/nucleus/vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts for libs/common**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@nucleus/common': path.resolve(__dirname, 'src/index.ts'),
      '@nucleus/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@nucleus/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      '@nucleus/l10n': path.resolve(__dirname, '../l10n/src/index.ts'),
      '@nucleus/panel': path.resolve(__dirname, '../panel/src/index.ts'),
      '@nucleus/theme': path.resolve(__dirname, '../theme/src/index.ts'),
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
```

- [ ] **Step 2: Create vitest.config.ts for other projects**

Repeat the pattern for each project, adjusting aliases and paths.

- [ ] **Step 3: Commit**

```bash
git add libs/common/vitest.config.ts libs/l10n/vitest.config.ts libs/ui/vitest.config.ts libs/core/vitest.config.ts libs/panel/vitest.config.ts libs/theme/vitest.config.ts apps/nucleus/vitest.config.ts
git commit -m "chore: add vitest config for each project"
```

---

### Task 5: Update Project.json Executors

**Files:**
- Modify: `libs/common/project.json`
- Modify: `libs/l10n/project.json`
- Modify: `libs/ui/project.json`
- Modify: `libs/core/project.json`
- Modify: `libs/panel/project.json`
- Modify: `libs/theme/project.json`
- Modify: `apps/nucleus/project.json`

- [ ] **Step 1: Update test executor in each project.json**

Replace:
```json
"test": {
  "executor": "@nx/jest:jest",
  "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
  "options": {
    "jestConfig": "libs/common/jest.config.ts"
  }
}
```

With:
```json
"test": {
  "executor": "@nx/vitest:vitest",
  "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
  "options": {
    "config": "libs/common/vitest.config.ts"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add libs/common/project.json libs/l10n/project.json libs/ui/project.json libs/core/project.json libs/panel/project.json libs/theme/project.json apps/nucleus/project.json
git commit -m "chore: switch test executors to @nx/vitest"
```

---

### Task 6: Update tsconfig.spec.json Files

**Files:**
- Modify: `tsconfig.spec.json` (root)
- Modify: `libs/common/tsconfig.spec.json`
- Modify: `libs/l10n/tsconfig.spec.json`
- Modify: `libs/ui/tsconfig.spec.json`
- Modify: `libs/core/tsconfig.spec.json`
- Modify: `libs/panel/tsconfig.spec.json`
- Modify: `libs/theme/tsconfig.spec.json`
- Modify: `apps/nucleus/tsconfig.spec.json`

- [ ] **Step 1: Update types in tsconfig.spec.json**

In each `tsconfig.spec.json`, replace:
```json
"types": ["jest", "node", "jsdom", "@angular/localize"]
```

With:
```json
"types": ["vitest/globals", "node", "jsdom", "@angular/localize"]
```

Also change `module` from `"commonjs"` to `"ESNext"` and `target` to `"ESNext"`.

- [ ] **Step 2: Commit**

```bash
git add tsconfig.spec.json libs/*/tsconfig.spec.json apps/*/tsconfig.spec.json
git commit -m "chore: update tsconfig.spec.json for vitest"
```

---

### Task 7: Migrate Jest APIs to Vitest APIs

**Files:**
- 17 spec files (listed above)

- [ ] **Step 1: Replace jest.fn() with vi.fn()**

In all 17 files, replace:
- `jest.fn()` → `vi.fn()`
- `jest.spyOn()` → `vi.spyOn()`
- `jest.Mock` type → `Mock` from vitest
- `jest.useFakeTimers()` → `vi.useFakeTimers()`
- `jest.useRealTimers()` → `vi.useRealTimers()`
- `jest.advanceTimersByTime()` → `vi.advanceTimersByTime()`
- `jest.restoreAllMocks()` → `vi.restoreAllMocks()`
- `jest.clearAllMocks()` → `vi.clearAllMocks()`
- `jest.requireActual()` → `vi.requireActual()`

- [ ] **Step 2: Add vi import where needed**

Add `import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';` at the top of files that use these APIs (or rely on globals mode).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: migrate jest APIs to vitest APIs"
```

---

### Task 8: Delete Jest Config Files

**Files:**
- Delete: `jest.config.ts` (root)
- Delete: `jest.preset.js`
- Delete: `libs/common/jest.config.ts`
- Delete: `libs/l10n/jest.config.ts`
- Delete: `libs/ui/jest.config.ts`
- Delete: `libs/core/jest.config.ts`
- Delete: `libs/panel/jest.config.ts`
- Delete: `libs/theme/jest.config.ts`
- Delete: `apps/nucleus/jest.config.ts`

- [ ] **Step 1: Remove all jest config files**

```bash
git rm jest.config.ts jest.preset.js
git rm libs/common/jest.config.ts libs/l10n/jest.config.ts libs/ui/jest.config.ts libs/core/jest.config.ts libs/panel/jest.config.ts libs/theme/jest.config.ts
git rm apps/nucleus/jest.config.ts
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove jest config files"
```

---

### Task 9: Test Migration

**Files:** None (verification only)

- [ ] **Step 1: Run tests for libs/common**

```bash
bunx nx test common
```

Expected: Tests pass (or pre-existing failures only).

- [ ] **Step 2: Run tests for all projects**

```bash
bunx nx run-many --target=test --all
```

Expected: All tests pass (or pre-existing failures only).

- [ ] **Step 3: Fix any remaining failures**

If tests fail due to missing imports or API mismatches, fix them.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: resolve vitest migration issues"
```

---

### Task 10: Update Documentation

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Update AGENTS.md testing section**

Change:
```
- **Unit**: Jest with `jest-preset-angular`; use `@test-mocks` for shared mocks
```

To:
```
- **Unit**: Vitest v4 with `@analogjs/vitest-angular`; use `@test-mocks` for shared mocks
```

- [ ] **Step 2: Update test commands in AGENTS.md**

Change:
```bash
# Test single file
bunx nx test nucleus -- --testPathPattern=component-name
```

To:
```bash
# Test single file
bunx nx test nucleus -- --testPathPattern=component-name
```

(Vitest supports the same `--testPathPattern` flag.)

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md for vitest migration"
```
