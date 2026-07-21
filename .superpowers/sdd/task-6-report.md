# Task 6: Update tsconfig.spec.json Files

**Status**: DONE
**Commits**: a56d686
**Date**: 2026-07-21

## Changes

Updated 7 tsconfig.spec.json files:

| File | types | module | target |
|------|-------|--------|--------|
| libs/common/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| libs/l10n/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| libs/ui/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| libs/core/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| libs/panel/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| libs/theme/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |
| apps/nucleus/tsconfig.spec.json | jest → vitest/globals | commonjs → ESNext | es2016 → ESNext |

## Notes

- Root tsconfig.spec.json does not exist — skipped.
- All other files follow the same structure; only types array and module/target changed.
- `include` still references `jest.config.ts` — will be cleaned up in a later task.
