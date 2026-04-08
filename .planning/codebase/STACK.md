# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript 5.x - All application code (React components, Next.js config, utilities, node typings)
- TSX - React component markup under `app/` and `components/`

**Secondary:**
- CSS - Global styles and Tailwind v4 directives in `app/globals.css`
- JSON - Static data fixtures (e.g. `data/globe.json` country polygon data consumed by the globe)

## Runtime

**Environment:**
- Node.js 18+ required by Next.js 16 (local dev previously observed on 22.x)
- Next.js 16.2.2 - App Router, React Server Components, font optimization

**Package Manager:**
- npm (inferred from `package-lock.json`)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.2 - Framework, App Router, RSC, build pipeline
- React 19.2.4 - UI library
- React DOM 19.2.4 - DOM renderer

**UI / Component Primitives:**
- @base-ui/react ^1.3.0 - Unstyled accessible primitives (used by `components/ui/button.tsx` via `@base-ui/react/button`)
- shadcn ^4.1.2 - shadcn/ui CLI tooling; generator config in `components.json`
- lucide-react ^1.7.0 - Icon set (used extensively in `components/workflow/nodes.tsx`)
- class-variance-authority ^0.7.1 - Variant API for styled components (`components/ui/button.tsx`)
- clsx ^2.1.1 - Conditional className helper (re-exported through `lib/utils.ts` `cn`)
- tailwind-merge ^3.5.0 - Tailwind class conflict resolution (used by `cn` in `lib/utils.ts`)

**3D / Visualization:**
- three ^0.183.2 - WebGL engine backing the globe
- three-globe ^2.45.2 - Hex-polygon globe with arcs/rings, wrapped in `components/ui/globe.tsx`
- @react-three/fiber ^9.5.0 - React renderer for three.js; `Canvas`, `extend`, `useThree` used in `components/ui/globe.tsx`
- @types/three ^0.183.1 - TS typings for three

**Workflow / Node Graph:**
- @xyflow/react ^12.10.2 - ReactFlow v12 node/edge primitives; custom node components defined in `components/workflow/nodes.tsx` (`AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode`) using `Handle`, `Position`, `NodeProps`

**Animation:**
- motion ^12.38.0 - Framer Motion successor package (installed; not yet imported in checked-in components)
- tw-animate-css ^1.4.0 - Tailwind plugin exposing animate.css keyframes

**Styling:**
- tailwindcss ^4 - Utility-first CSS, v4 engine
- @tailwindcss/postcss ^4 - PostCSS plugin wiring Tailwind v4
- PostCSS - Configured via `postcss.config.mjs`

**Font Loading:**
- `next/font/google` - Loads `Geist` and `Geist_Mono` in `app/layout.tsx`

## Key Dependencies

**Critical runtime:**
- `next@16.2.2`, `react@19.2.4`, `react-dom@19.2.4` - Framework + renderer
- `@xyflow/react@^12.10.2` - Powers the in-progress workflow graph UI
- `three@^0.183.2`, `three-globe@^2.45.2`, `@react-three/fiber@^9.5.0` - Powers the globe section
- `@base-ui/react@^1.3.0` - Foundation for shadcn-generated UI primitives
- `lucide-react@^1.7.0` - Iconography across workflow nodes

**Styling / utilities:**
- `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `tw-animate-css@^1.4.0`
- `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.5.0`

**Motion (reserved):**
- `motion@^12.38.0` - Installed; no imports yet in `app/` or `components/`

**Dev / Quality:**
- `typescript@^5`
- `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`, `@types/three@^0.183.1`
- `eslint@^9`, `eslint-config-next@16.2.2`
- `shadcn@^4.1.2` - CLI generator (not a runtime dep in practice)

## Configuration

**Environment:**
- No `.env*` files detected in repo root - App runs on defaults
- `next.config.ts` - Present but empty (`{}`); all Next.js defaults active
- `tsconfig.json` - `strict: true`, `target: ES2017`, `moduleResolution: bundler`, JSX `react-jsx`, path alias `@/* -> ./*`
- `components.json` - shadcn/ui generator config (aliases, style preset)

**Build:**
- `eslint.config.mjs` - Flat config extending `eslint-config-next`
- `postcss.config.mjs` - Loads `@tailwindcss/postcss`
- `tsconfig.tsbuildinfo` - Incremental build cache (committed in working tree)

**App entry points:**
- `app/layout.tsx` - Root layout; sets `<html lang="en">`, loads Geist fonts, metadata still defaults to "Create Next App"
- `app/page.tsx` - Marketing landing page; renders `DecodedTitle`, phases list, and `GlobeSection`
- `app/globals.css` - Tailwind v4 entry and CSS custom properties
- `app/favicon.ico` - Site icon (no `app/icon.png` present)

**Directories of note:**
- `components/` - Presentational React components
- `components/ui/` - shadcn-style primitives (`button.tsx`, `globe.tsx`)
- `components/workflow/` - ReactFlow custom node components (`nodes.tsx`)
- `data/` - Static JSON (e.g. `globe.json`)
- `lib/` - Shared helpers (`utils.ts` exports `cn`)
- `public/` - Static assets served by Next
- `app/fonts/` - Font assets directory

## Platform Requirements

**Development:**
- Node.js 18+ (Next.js 16 requirement)
- npm with `package-lock.json`
- Modern browser with WebGL2 (required for three.js globe) and ES2017+

**Production:**
- Any Next.js 16 compatible host (Vercel recommended)
- Build: `npm run build` (`next build`)
- Start: `npm start` (`next start`)
- Client-only 3D: `GlobeSection` imports `World` via `next/dynamic` with `ssr: false`, so the globe is rendered only in the browser

---

*Stack analysis: 2026-04-07*
