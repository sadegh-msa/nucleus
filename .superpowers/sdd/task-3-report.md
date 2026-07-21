## Task 3: Create Test Setup Files

**Status**: DONE
**Commits**: `0fb0493`
**Test summary**: Updated all 7 test-setup.ts files (common, l10n, ui, core, panel, theme, nucleus) from jest-preset-angular to @analogjs/vitest-angular/setup-testbed, and replaced 4 `jest.fn()` calls with `vi.fn()` in utils/test-mocks.ts.
**Concerns**: libs/ui had extra mocks (CSS, $localize) and libs/core had $localize — these were dropped per the task spec. If tests in ui or core relied on those globals, they may need explicit mocks added back per-test or in a future setup iteration.
