# Nucleus

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Angular 22 monorepo with Nx 23, zoneless change detection ✨.

## Prerequisites

[Install bun](https://bun.sh/docs/installation)

## Quick Commands

```bash
# Dev server
bunx nx serve nucleus

# Build (Farsi locale)
bunx nx build --configuration=fa nucleus

# Test single file
bunx nx test nucleus -- --testPathPattern=component-name

# Test all libs with coverage
bun run test:coverage

# Lint changed files only
bun run lint  # runs biome on git-changed files

# E2E with UI
bunx nx run nucleus-e2e:e2e -- --ui

# Extract and merge i18n
bun run localize
```

## All Available Scripts

From `package.json`:

| Script | Description |
|--------|-------------|
| `bun run start` | Start dev server (`nx serve nucleus`) |
| `bun run build` | Build for production with Farsi locale |
| `bun run test` | Run all unit tests |
| `bun run test:coverage` | Run tests with coverage |
| `bun run lint` | Lint only changed files (via nx affected) |
| `bun run lint:all` | Lint all projects |
| `bun run lint:boundaries` | Verify architectural boundaries (sheriff) |
| `bun run format` | Format changed files (biome) |
| `bun run format:all` | Format all files |
| `bun run e2e` | Run E2E tests |
| `bun run e2e:ui` | Run E2E tests with Playwright UI |
| `bun run e2e:update-snapshots` | Update E2E snapshots |
| `bun run localize` | Extract and merge i18n locales |
| `bun run reset` | Reset Nx cache |
| `bun run circular:apps` | Check circular deps in apps |
| `bun run circular:libs` | Check circular deps in libs |

## Key Architecture

- **State**: NgRx store + effects, zoneless change detection with signals
- **SSR**: Enabled via `@angular/ssr`
- **Styling**: SCSS with `libs/ui/src/lib/ext/styles` in style preprocessor paths
- **i18n**: `en-US` (default) and `fa` (Persian) locales; build configs per locale

## Path Aliases

Defined in `tsconfig.base.json`:
- `@nucleus/common`, `@nucleus/core`, `@nucleus/ui`, `@nucleus/l10n`, `@nucleus/panel`, `@nucleus/theme`
- `@/*`, `@test-mocks`

## Testing

- **Unit**: Vitest v4 with `@analogjs/vitest-angular`; use `@test-mocks` for shared mocks
- **E2E**: Playwright (via `@nx/playwright`)
- Test setup in `utils/test-mocks.ts` provides `setupGlobalMocks()` for jsdom environment
- **Coverage**: Browser mode with `@vitest/coverage-v8`

## Linting

**Biome** for linting and formatting:
- Single quotes, 2-space indentation, 100-char line width
- `bun run lint` runs biome only on git-changed files
- Stylelint configured for SCSS (`stylelint-scss`)

## Local Registry

Verdaccio for local package testing:
```bash
bunx nx local-registry  # starts on port 4873
```

## Useful Links

- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [NgRx SignalStore](https://ngrx.io/guide/signalstore)