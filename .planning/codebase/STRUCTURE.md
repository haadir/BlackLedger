# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
blackledger/
├── app/                              # Next.js App Router root
│   ├── layout.tsx                    # RootLayout — Geist fonts, globals.css
│   ├── page.tsx                      # Route `/` — landing page composition
│   ├── globals.css                   # Tailwind v4 + shadcn theme tokens
│   ├── favicon.ico
│   └── fonts/                        # .otf families on disk, NOT wired up
│       ├── GT-America/
│       ├── PPEditorialNew-Free for personal use/
│       └── pp-neue-montreal-cufonfonts/
├── components/
│   ├── decoded-title.tsx             # Client — scrambling <h1> "BLACK·LEDGER"
│   ├── globe-section.tsx             # Client — globe section shell + dynamic World import
│   ├── ui/                           # ShadCN-scaffolded primitives
│   │   ├── button.tsx                # CVA button (unused by current page)
│   │   └── globe.tsx                 # three.js / r3f `World` + `Globe` + `Rig`
│   └── workflow/
│       └── nodes.tsx                 # @xyflow/react node renderers (orphaned)
├── data/
│   └── globe.json                    # country hex polygon feature collection
├── lib/
│   └── utils.ts                      # `cn()` — clsx + tailwind-merge
├── public/                           # Next static assets
├── .planning/
│   └── codebase/                     # GSD codebase maps (this directory)
├── .claude/
│   └── settings.local.json
├── components.json                   # ShadCN config (style=base-nova, rsc, lucide)
├── eslint.config.mjs                 # flat-config ESLint (extends next)
├── next.config.ts                    # bare NextConfig
├── next-env.d.ts
├── postcss.config.mjs                # @tailwindcss/postcss
├── tsconfig.json                     # strict TS, `@/*` path alias
├── package.json                      # Next 16.2.2, React 19.2.4
└── package-lock.json
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router root — every route, the root layout, the global stylesheet
- Contains: `layout.tsx` (root HTML shell), `page.tsx` (the single `/` route), `globals.css`, `favicon.ico`, and a static `fonts/` tree
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**`app/fonts/`:**
- Purpose: On-disk `.otf` font families (GT-America trial, PP Editorial New, PP Neue Montreal)
- Note: NOT imported, NOT served via `@font-face`, NOT wired through `next/font/local`. They are dead assets at the moment. The app actively uses only `Geist` and `Geist_Mono` from `next/font/google`.

**`components/`:**
- Purpose: All React components — page sections and UI primitives
- Contains: Top-level page sections (`decoded-title.tsx`, `globe-section.tsx`), a ShadCN `ui/` subdirectory, and a `workflow/` subdirectory for ReactFlow node definitions
- Key files: `components/decoded-title.tsx`, `components/globe-section.tsx`

**`components/ui/`:**
- Purpose: ShadCN-scaffolded low-level primitives. Per `components.json` this is the `@/components/ui` alias target.
- Contains: `button.tsx` (CVA-based button variants), `globe.tsx` (self-contained three.js + `@react-three/fiber` `World` primitive exposing a typed `GlobeConfig` + `Position[]`)
- Key files: `components/ui/globe.tsx` (only file actively rendered by the page)

**`components/workflow/`:**
- Purpose: Custom ReactFlow (`@xyflow/react`) node components
- Contains: `nodes.tsx` — exports `AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode`
- Note: This file is not imported anywhere on disk. There is no sibling `workflow-section.tsx` or `workflow/index.ts`. Adding a ReactFlow surface later should import from `@/components/workflow/nodes`.

**`data/`:**
- Purpose: Static JSON data loaded at build/runtime
- Contains: `globe.json` — GeoJSON-shaped `{ features: [...] }` used by `components/ui/globe.tsx` as the hex polygon dataset
- Key files: `data/globe.json`

**`lib/`:**
- Purpose: Cross-cutting utilities (standard ShadCN convention)
- Contains: `utils.ts` exporting `cn()`
- Key files: `lib/utils.ts`

**`public/`:**
- Purpose: Static assets served at the site root (Next.js default)
- Currently empty of source-tracked files beyond whatever Next scaffolding placed here

**`.planning/codebase/`:**
- Purpose: GSD codebase mapping documents (this directory)
- Contains: `ARCHITECTURE.md`, `STRUCTURE.md`, and other maps when generated
- Generated: Yes, by `/gsd-map-codebase`. Committed: Yes.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, font CSS variables, global stylesheet
- `app/page.tsx`: The single `/` route — landing page composition

**Configuration:**
- `next.config.ts`: Bare `NextConfig` (no custom options)
- `tsconfig.json`: Strict TS, `@/*` → `./*` path alias, ES2017 target, bundler module resolution
- `eslint.config.mjs`: Flat ESLint config extending `next`
- `postcss.config.mjs`: `@tailwindcss/postcss` plugin only
- `components.json`: ShadCN config (`style: base-nova`, `rsc: true`, `iconLibrary: lucide`, aliases `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`)
- `package.json`: Scripts `dev` / `build` / `start` / `lint`; deps include `next@16.2.2`, `react@19.2.4`, `@xyflow/react`, `@react-three/fiber`, `three`, `three-globe`, `motion`, `@base-ui/react`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `shadcn`

**Core Logic:**
- `app/page.tsx`: Page composition + inline `PHASES` constant
- `components/decoded-title.tsx`: Client-only scramble animation for the hero title
- `components/globe-section.tsx`: Globe section copy + `globeConfig` + `sampleArcs` arrays + dynamic import of `World`
- `components/ui/globe.tsx`: `World` / `Globe` / `Rig` — three.js imperative setup against `ThreeGlobe`
- `components/workflow/nodes.tsx`: Orphaned ReactFlow node renderers

**Styling:**
- `app/globals.css`: Tailwind v4 `@import`, shadcn preset, `tw-animate-css`, `@theme inline` tokens, `:root`/`.dark` oklch palettes, `@layer base`

**Testing:**
- Not applicable. No test runner, no spec files, no `__tests__` directories.

## Naming Conventions

**Files:**
- React components: `kebab-case.tsx` (e.g. `decoded-title.tsx`, `globe-section.tsx`)
- Shared utilities: `kebab-case.ts` (e.g. `lib/utils.ts`)
- Next.js special files: Next's reserved names (`layout.tsx`, `page.tsx`, `globals.css`)
- Exception: `components/workflow/nodes.tsx` is plural/collective — multiple node exports bundled into one file rather than one file per node

**Directories:**
- All lowercase, kebab-case where multi-word (`components/ui`, `components/workflow`, `app/fonts`)

**Exports:**
- Page-level sections export a default React component whose name is PascalCase (`DecodedTitle`, `GlobeSection`, `Home`, `RootLayout`)
- UI primitives and multi-export files use named exports (`World`, `AgentNode`, `cn`, `Button`)

**Types:**
- Component-local types declared at the top of the file in PascalCase (`GlobeConfig`, `Position`, `AgentData`, `Prediction`)
- No shared `types/` directory

## Where to Add New Code

**New Page Section (landing page only):**
- Create `components/<section-name>.tsx` as a server component by default; add `"use client"` only if it needs browser APIs, refs, or event handlers
- Import and render from `app/page.tsx` inside `<main>`, following the existing `mt-24 sm:mt-32` / `mt-32 sm:mt-40` vertical rhythm
- Decorative background elements belong at the top of `app/page.tsx` with `aria-hidden` and `pointer-events-none`

**New Route:**
- Add `app/<segment>/page.tsx` (and optionally `layout.tsx` / `loading.tsx` / `error.tsx`). No route currently exists besides `/`.

**New ShadCN primitive:**
- Drop into `components/ui/<name>.tsx`
- Import `cn` from `@/lib/utils`
- Use `class-variance-authority` for variant-driven styling (see `components/ui/button.tsx` for the pattern)

**New three.js / WebGL surface:**
- Put the heavy R3F code under `components/ui/` (mirrors `globe.tsx`)
- Create a thin wrapper section component under `components/` that dynamically imports it with `next/dynamic` and `{ ssr: false }` — see `components/globe-section.tsx` for the exact pattern

**New ReactFlow node:**
- Add an exported function to `components/workflow/nodes.tsx`, following the `AgentNode` shape: file-local `XData` type, `NodeProps` arg, bordered card, `<Handle>` primitives at the bottom
- When the workflow canvas is eventually wired up, register nodes via `nodeTypes` in the consuming `workflow-section.tsx` (does not exist yet)

**Shared utility:**
- `lib/utils.ts` is the sole utility module. Add exports here rather than creating ad-hoc helper files.

**Static data:**
- JSON blobs live in `data/`, imported via the `@/data/...` alias (tsconfig has `resolveJsonModule: true`)

**Static public assets:**
- Images, icons, etc. go in `public/` and are referenced by root-relative URL (`/foo.png`)

**Path Aliases:**
- `@/*` maps to the project root (see `tsconfig.json`). Always prefer `@/components/...`, `@/lib/utils`, `@/data/globe.json` over relative paths.

## Special Directories

**`app/fonts/`:**
- Purpose: On-disk `.otf` families (GT-America, PP Editorial New, PP Neue Montreal)
- Generated: No. Committed: Yes (large binary footprint).
- Status: Unreferenced by any code. If a design iteration wants to actually use these, wire them through `next/font/local` inside `app/layout.tsx` and expose as CSS variables alongside the existing Geist vars.

**`.planning/`:**
- Purpose: GSD workflow artifacts
- Generated: Yes (by `/gsd-*` commands). Committed: Yes.

**`.claude/`:**
- Purpose: Claude Code local settings
- Generated: Yes. Committed: Partial — only `settings.local.json` is tracked.

**`public/`:**
- Purpose: Next.js static root
- Generated: No. Committed: Yes.

**`.next/` (not present in tree listing):**
- Purpose: Next.js build output
- Generated: Yes. Committed: No (gitignored).

**`node_modules/` (not present in tree listing):**
- Purpose: npm dependencies
- Generated: Yes. Committed: No (gitignored).

---

*Structure analysis: 2026-04-07*
