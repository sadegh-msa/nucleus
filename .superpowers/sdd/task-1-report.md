# Task 1: Install Vitest Dependencies

**Status**: DONE
**Commit**: 7d33c8821a31095b7aff4ddb33722b8e41a92ad6

## Summary

Installed vitest v4.1.10 and removed all jest dependencies. Updated root test script to `vitest run`.

## What was done

1. Installed: `vitest@4.1.10`, `@nx/vitest@23.1.0`, `@analogjs/vitest-angular@2.6.3`, `@vitest/coverage-v8@4.1.10`
2. Removed: `@nx/jest`, `jest`, `jest-preset-angular`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`
3. Changed `"test": "jest"` → `"test": "vitest run"` in root package.json

## Test summary

Verified `vitest --version` returns `vitest/4.1.10`. Lockfile synced. No test suites run yet (vitest config not created — that's a later task).

## Concerns

- `bun remove` didn't update package.json automatically; had to manually edit devDependencies to remove stale entries
- The `@nx/jest` plugin reference in nx.json or workspace config may still need cleanup in a later task
