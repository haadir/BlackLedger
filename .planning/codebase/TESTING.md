# Testing Patterns

**Analysis Date:** 2026-04-07

## Current State: No Test Framework

**There is no automated testing set up in this project.** This is an honest baseline, not an oversight to paper over.

Verified against `package.json` (2026-04-07):

- No `jest`, `vitest`, `@testing-library/*`, `playwright`, `@playwright/test`, `cypress`, `@cypress/*`, `mocha`, `chai`, `ava`, `node:test` runner config, `happy-dom`, or `jsdom` in `dependencies` or `devDependencies`
- No `test`, `test:*`, `e2e`, or `coverage` script in `package.json` — the only scripts are:
  ```json
  "dev":   "next dev",
  "build": "next build",
  "start": "next start",
  "lint":  "eslint"
  ```
- No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, `cypress.config.*`, or `__tests__/` directory in the repo
- No `*.test.ts(x)` or `*.spec.ts(x)` files committed

## What Counts as "Verification" Today

Until a test runner is added, these are the only guardrails:

1. **TypeScript strict mode** (`tsconfig.json` — `"strict": true`). Type errors surface during `next build` and in the editor.
2. **ESLint with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`** (`eslint.config.mjs`). Run:
   ```bash
   npm run lint
   ```
3. **Production build** as a smoke test:
   ```bash
   npm run build
   ```
   Catches type errors, missing imports, invalid Server/Client Component boundaries, and bad `next/dynamic` usage.
4. **Manual in-browser verification** via `npm run dev` on `http://localhost:3000`. This is currently the primary way to validate:
   - `DecodedTitle` scramble animation and SSR hydration match (`components/decoded-title.tsx`)
   - `GlobeSection` three.js/`three-globe` rendering and `next/dynamic` `{ ssr: false }` boundary (`components/globe-section.tsx`, `components/ui/globe.tsx`)
   - `@xyflow/react` node rendering (`components/workflow/nodes.tsx`)
   - Tailwind v4 class output and theme tokens

## Pre-Merge Checklist (Until Tests Exist)

Run these locally before committing any non-trivial change:

```bash
npm run lint      # ESLint (Next core web vitals + TS rules)
npm run build     # Full type-check + Next.js production build
npm run dev       # Visual smoke test in the browser
```

A change is not "done" until all three pass.

## When Adding a Test Framework

If and when tests are introduced, the recommended shape for this stack (Next.js 16 App Router, React 19, Tailwind v4) is:

**Unit / component tests — Vitest + React Testing Library**
- `vitest` + `@vitejs/plugin-react` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` (or `happy-dom`)
- Colocate tests next to source: `components/decoded-title.test.tsx` alongside `components/decoded-title.tsx`
- Add scripts: `"test": "vitest"`, `"test:run": "vitest run"`, `"test:coverage": "vitest run --coverage"`
- Mock `next/dynamic` and any `three`/`@react-three/fiber` imports — they do not render in `jsdom`. Prefer testing logic-only components (`DecodedTitle` text output, `PHASES` rendering in `app/page.tsx`) and leave WebGL surfaces for E2E.

**End-to-end tests — Playwright**
- `@playwright/test`
- `playwright.config.ts` at the repo root
- `e2e/` directory for specs
- Add scripts: `"e2e": "playwright test"`, `"e2e:ui": "playwright test --ui"`
- Use E2E to cover the things unit tests cannot: globe rendering, scramble animation progressing to final text, `next/dynamic` `{ ssr: false }` boundary, and hydration with no console errors

**Things to specifically test when the framework lands:**

| Target | File | Why |
|--------|------|-----|
| SSR/CSR hydration match | `components/decoded-title.tsx` | Deterministic initial state is load-bearing — any drift re-introduces a hydration warning |
| `next/dynamic` `{ ssr: false }` | `components/globe-section.tsx` | Regression here crashes the server with `window is not defined` |
| `useEffect` cleanup | `components/decoded-title.tsx`, `components/ui/globe.tsx` (`Rig`) | Timers (`setInterval`, `setTimeout`) and `requestAnimationFrame` must all be cleared on unmount — easy to break silently |
| `cn()` class merging | `lib/utils.ts` | Trivially unit-testable; covers the `clsx` + `tailwind-merge` contract |
| `buttonVariants` | `components/ui/button.tsx` | Snapshot the class strings for each `variant`/`size` combo |
| Route renders without error | `app/page.tsx` | Smoke test via Playwright — load `/`, assert no console errors, assert `BLACK·LEDGER` appears after scramble settles |

## Coverage

No coverage tooling is configured and no target is enforced. Do not claim a coverage number in PRs until the tooling lands.

---

*Testing analysis: 2026-04-07*
