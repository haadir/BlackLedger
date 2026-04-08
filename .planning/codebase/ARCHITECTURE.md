# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Single-page Next.js 16 App Router marketing site. Server component shell with selective client-component islands for interactivity (decoded title scramble, three.js globe). No API routes, no database, no backend. Pure presentational composition.

**Key Characteristics:**
- App Router with a single route (`/`) rendering `app/page.tsx` as a Server Component
- Client components marked with `"use client"` are mounted as islands inside the server-rendered page
- Heavy WebGL/three.js payload (`components/ui/globe.tsx`) loaded via `next/dynamic` with `ssr: false` to keep it out of the server render path
- ShadCN-style component conventions (`components.json`, `@/components/ui/*`, `cn()` util, CSS variable theme tokens) even though most of the page uses raw Tailwind utilities directly
- Tailwind v4 (`@import "tailwindcss"` in `app/globals.css`) — no `tailwind.config.js`; theme tokens live in CSS via `@theme inline`

## Layers

**App Shell (Server):**
- Purpose: Root HTML document, font loading, global CSS
- Location: `app/layout.tsx`
- Contains: `RootLayout` server component, Geist Sans + Geist Mono via `next/font/google`, global stylesheet import
- Depends on: `app/globals.css`, `next/font/google`
- Used by: Next.js App Router (implicit)

**Page (Server):**
- Purpose: Landing page composition — header, decoded title, workflow phase list, globe section, footer
- Location: `app/page.tsx`
- Contains: `Home` default export (server component), inline `PHASES` constant driving the workflow `<ol>`, full-bleed background grid/vignette divs, imports client islands
- Depends on: `@/components/decoded-title`, `@/components/globe-section`
- Used by: App Router at route `/`

**Client Islands:**
- Purpose: Interactive/animated UI that requires browser APIs (timers, WebGL, refs)
- Location: `components/decoded-title.tsx`, `components/globe-section.tsx`, `components/ui/globe.tsx`
- Contains: Three `"use client"` components
- Depends on: React 19 hooks, `@react-three/fiber`, `three`, `three-globe`, `@/data/globe.json`
- Used by: `app/page.tsx` (directly imports `DecodedTitle`, `GlobeSection`); `GlobeSection` lazy-imports `World` from `components/ui/globe.tsx`

**UI Primitives (ShadCN layer):**
- Purpose: Reusable low-level UI primitives scaffolded by ShadCN CLI
- Location: `components/ui/`
- Contains: `button.tsx` (currently unused by the page), `globe.tsx` (the three.js World primitive — consumed by `globe-section.tsx`)
- Depends on: `@/lib/utils` (`cn` helper), `class-variance-authority`, `@react-three/fiber`, `three`, `three-globe`
- Used by: `components/globe-section.tsx`

**Orphaned / Unwired Components:**
- Purpose: ReactFlow custom node definitions authored for a workflow canvas feature, but not currently imported anywhere in the render tree
- Location: `components/workflow/nodes.tsx`
- Contains: `AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode` — each a `"use client"` React component rendering a styled card with `@xyflow/react` `Handle`/`Position` source+target handles
- Depends on: `@xyflow/react`, `lucide-react`
- Used by: Nothing on disk. No `components/workflow-section.tsx` exists and `app/page.tsx` does not import any ReactFlow surface. The dependency `@xyflow/react` is declared in `package.json` but is only consumed by this file.

**Utilities:**
- Purpose: Shared helpers
- Location: `lib/utils.ts`
- Contains: `cn()` — `clsx` + `tailwind-merge` wrapper (standard ShadCN util)
- Depends on: `clsx`, `tailwind-merge`
- Used by: `components/ui/*` per ShadCN convention (`button.tsx` imports it)

**Static Data:**
- Purpose: GeoJSON-like country polygon data for globe hex rendering
- Location: `data/globe.json`
- Contains: `{ features: [...] }` feature collection
- Used by: `components/ui/globe.tsx` (imported via `@/data/globe.json`, fed to `ThreeGlobe.hexPolygonsData`)

## Data Flow

**Initial Page Render:**

1. Next.js App Router resolves route `/` → renders `app/layout.tsx` (server)
2. `RootLayout` injects Geist font CSS variables, imports `globals.css`, renders `<body>`
3. `app/page.tsx` `Home` renders as a server component, producing the header, `DecodedTitle` placeholder markup (deterministic initial `####·######`), the `PHASES` list as a static `<ol>`, and the `GlobeSection` shell
4. HTML streams to the client with grid background, vignette, and phase list fully rendered
5. Client hydration mounts `DecodedTitle`: `useEffect` starts a 55ms `setInterval` scramble loop plus per-character unlock `setTimeout`s (`350 + i*160` ms), progressively locking the title
6. Client hydration mounts `GlobeSection`: it `next/dynamic`-imports `components/ui/globe.tsx` with `ssr: false`; once the chunk resolves, `World` mounts a `<Canvas>` from `@react-three/fiber`, constructs a `Scene` + `PerspectiveCamera`, and `Globe` initializes `ThreeGlobe` with hex polygons from `@/data/globe.json` and the `sampleArcs` array
7. The `Rig` child drives camera orbit via `requestAnimationFrame`, computing `x/z` from a growing angle at `0.0015 * speed` radians/frame

**State Management:**
- No global state. No Context, Redux, Zustand, or similar.
- `DecodedTitle` holds two local `useState` arrays (`chars`, `locked`) and a `useRef` mirror of `locked` so the scramble interval can read the latest mask without re-subscribing
- `GlobeSection` holds no state — `globeConfig` and `sampleArcs` are module-level constants
- `components/ui/globe.tsx` `Globe` uses a `useRef<ThreeGlobe | null>` and a single `useEffect` keyed on `[data, defaultProps]` that wires hex polygons, arcs, and rings imperatively onto the three-globe instance

## Key Abstractions

**Client Island:**
- Purpose: A `"use client"`-marked component embedded in an otherwise server-rendered tree
- Examples: `components/decoded-title.tsx`, `components/globe-section.tsx`, `components/ui/globe.tsx`, `components/workflow/nodes.tsx`
- Pattern: Top-of-file `"use client"` directive; browser APIs (`setInterval`, `requestAnimationFrame`, WebGL) only touched inside `useEffect`

**Dynamic-Import Boundary:**
- Purpose: Keep heavy, SSR-incompatible code (three.js, WebGL) out of the initial server render and initial JS bundle
- Example: `components/globe-section.tsx` uses `dynamic(() => import("@/components/ui/globe").then(m => m.World), { ssr: false })`
- Pattern: Declare the dynamic import at module top-level, bind the resolved component to a local name, and use it like a normal component

**ShadCN-style primitive:**
- Purpose: Presentational primitive living under `components/ui/`, imported via the `@/` path alias
- Examples: `components/ui/button.tsx`, `components/ui/globe.tsx`
- Pattern: Either `class-variance-authority` + `cn()` for variant-driven DOM elements (`button.tsx`) or a self-contained WebGL/R3F surface exposing a typed config object (`globe.tsx`)

**ReactFlow Node Component (orphaned):**
- Purpose: Custom node renderer compatible with `@xyflow/react`'s `nodeTypes` map
- Examples: `AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode` in `components/workflow/nodes.tsx`
- Pattern: `function XNode({ data }: NodeProps)` → casts `data` through `unknown` to a file-local type, renders a bordered card with a colored header, ends with `<Handle type="target" position={Position.Left} />` and (except terminal `PredictionNode`) `<Handle type="source" position={Position.Right} />`

## Entry Points

**Next.js Route `/`:**
- Location: `app/page.tsx`
- Triggers: Any HTTP GET to `/`
- Responsibilities: Render the full landing page — background layers, header, decoded title, workflow phase list, globe section, footer

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every route under `app/` (only one exists)
- Responsibilities: Emit `<html>`/`<body>`, bind Geist font CSS variables, import global stylesheet, set default `metadata`

**Build / Dev:**
- Location: `package.json` scripts
- Triggers: `next dev` (development), `next build` + `next start` (production), `eslint` (lint)
- Responsibilities: Next.js 16.2.2 handles bundling, RSC, route resolution. `next.config.ts` is a bare `NextConfig` with no custom options.

## Error Handling

**Strategy:** None implemented. No `error.tsx`, `not-found.tsx`, or `global-error.tsx` under `app/`. No try/catch around the three.js or dynamic import paths. Failures in the lazy-loaded globe chunk surface via Next.js defaults.

**Patterns:**
- `DecodedTitle` defends against hydration mismatch by seeding deterministic initial `chars`/`locked` state (placeholder `#` glyphs) and only starting the real scramble inside `useEffect`
- `components/ui/globe.tsx` guards the imperative `useEffect` with `if (!globeRef.current) return`
- Type safety on `@xyflow/react` node data is bypassed with `as unknown as XData` casts in `components/workflow/nodes.tsx`

## Cross-Cutting Concerns

**Logging:** None. No logger, no `console.*` calls in source.

**Validation:** None. No schema library (Zod/Valibot/Yup) present.

**Authentication:** None. No auth provider, middleware, or protected routes.

**Styling:**
- Tailwind v4 via `@import "tailwindcss"` in `app/globals.css`; configured through a CSS `@theme inline { ... }` block rather than a JS config file
- ShadCN theme variables (`--background`, `--primary`, `--sidebar-*`, chart tokens) defined as `oklch(...)` in `:root` and `.dark` — mostly unused by the current page, which hard-codes `bg-black` + `text-zinc-*` + `border-zinc-*`
- `tw-animate-css` and `shadcn/tailwind.css` imported for animation utilities and the ShadCN preset
- Fonts: Geist Sans + Geist Mono loaded by `next/font/google` and exposed as `--font-geist-sans` / `--font-geist-mono`; the design leans on `font-mono` throughout

**Unwired Font Assets:**
- `app/fonts/GT-America/`, `app/fonts/PPEditorialNew-Free for personal use/`, `app/fonts/pp-neue-montreal-cufonfonts/` contain `.otf` families on disk but are NOT wired into `layout.tsx` or any `@font-face` declaration — static assets only.

**Accessibility:**
- `aria-hidden` on purely decorative background layers in `app/page.tsx`
- `aria-label="BLACK LEDGER"` on the scrambling `<h1>` so screen readers get the stable target string

**Responsiveness:**
- Tailwind `sm:` breakpoints scale padding, title size, and workflow row layout
- No explicit mobile-only variant of the globe or workflow list — the phase list reflows via `flex-col sm:flex-row` and the globe scales with `max-w-[1100px] aspect-square`

---

*Architecture analysis: 2026-04-07*
