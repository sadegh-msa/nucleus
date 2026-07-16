<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `bunx nx build`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Project Overview

Angular 22 monorepo with Nx 23, using zoneless change detection and PrimeNG with Aura theme.

## Quick Commands

```bash
# Dev server
bunx nx serve nucleus

# Build (Farsi locale)
bunx nx build --configuration=fa nucleus

# Test single file
bunx nx test nucleus -- --testPathPattern=component-name

# Lint changed files only
bun run lint  # runs biome on git-changed files

# E2E with UI
bunx nx run nucleus-e2e:e2e -- --ui

# Extract and merge i18n
bun run localize
```

## Key Architecture

- **State**: NgRx store + effects, zoneless change detection
- **SSR**: Enabled via `@angular/ssr`
- **UI**: PrimeNG 19 with Aura theme, PrimeFlex for utilities
- **Styling**: SCSS with `libs/ui/src/lib/ext/styles` included in style preprocessor paths
- **i18n**: `en-US` (default) and `fa` (Persian) locales; build configs per locale in `apps/nucleus/project.json`

## Library Prefixes

| Library | Prefix | Purpose |
|---------|--------|---------|
| common | `nu` | Shared utilities |
| core | `nu` | Auth, guards, interceptors |
| ui | `ui` | UI component library |
| l10n | `lib` | Localization |
| panel | `nu` | Panel components |
| theme | `nu` | Theme/styling assets |

## Imports

Path aliases defined in `tsconfig.base.json`:
- `@nucleus/common`, `@nucleus/core`, `@nucleus/ui`, `@nucleus/l10n`, `@nucleus/panel`, `@nucleus/theme`
- `@libs/*`, `@styles/*`, `@test-mocks`

## Testing

- **Unit**: Jest with `jest-preset-angular`; use `@test-mocks` for shared mocks
- **E2E**: Playwright (via `@nx/playwright`)
- Test setup in `utils/test-mocks.ts` provides `setupGlobalMocks()` for jsdom environment

## Linting

**Biome** (not ESLint) for linting and formatting:
- Single quotes, 2-space indentation, 100-char line width
- `bun run lint` runs biome only on git-changed files
- Stylelint configured for SCSS (`stylelint-scss`)

## Local Registry

Verdaccio for local package testing:
```bash
bunx nx local-registry  # starts on port 4873
```
