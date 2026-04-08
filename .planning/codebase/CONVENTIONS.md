# Coding Conventions

**Analysis Date:** 2026-04-07

## Project Shape

Next.js 16.2.2 App Router marketing/landing site. React 19, TypeScript 5 strict mode, Tailwind CSS v4, shadcn (`base-nova` style) over Base UI primitives. No backend, no API routes yet — all code is either a Server Component, a `"use client"` leaf, or a shared helper in `lib/`.

**Note:** Next.js 16 is recent and has breaking changes vs. older App Router. Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before writing new Next-specific code.

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` — `decoded-title.tsx`, `globe-section.tsx`, `workflow-section.tsx`
- UI primitives under `components/ui/`: `kebab-case.tsx` — `button.tsx`, `globe.tsx`
- Feature subfolders group related files: `components/workflow/nodes.tsx`
- Route files use Next conventions: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Config: dotted or camelCase per tool — `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`

**React Components:**
- `PascalCase` functions, default-exported for page-level/feature components (`DecodedTitle`, `GlobeSection`, `Home`, `RootLayout`)
- Named exports for primitive/reusable UI (`Button`, `buttonVariants`, `World`) and for multi-component files (`AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode` in `components/workflow/nodes.tsx`)
- Acronyms stay uppercase in component names: `APINode`

**Types:**
- `PascalCase` — `GlobeConfig`, `Position`, `WorldProps`, `AgentData`, `Prediction`
- Prefer `type` aliases over `interface` (see `components/ui/globe.tsx`, `components/workflow/nodes.tsx`)
- Props types colocated above the component that uses them

**Variables/Functions:**
- `camelCase` for locals and functions: `randomChar`, `globeConfig`, `sampleArcs`, `lockedRef`
- `SCREAMING_SNAKE_CASE` for module-level constants meant as fixed data: `GLYPHS`, `TARGET` in `components/decoded-title.tsx`, `PHASES` in `app/page.tsx`

## TypeScript

**Strict mode enabled** (`tsconfig.json`):
- `"strict": true`, `"noEmit": true`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`
- Path alias: `@/*` → project root (import as `@/components/...`, `@/lib/utils`, `@/data/globe.json`)
- `resolveJsonModule: true` — JSON imported directly (see `import countries from "@/data/globe.json"`)

**Type patterns:**
- Props typed inline or via a local `type XxxProps = { ... }` above the component
- Optional config fields marked with `?`, defaults merged via spread: see `defaultProps` assembly in `components/ui/globe.tsx` (line 58)
- External data cast with `as unknown as LocalType` when library generics are too loose: `data as unknown as AgentData` in `components/workflow/nodes.tsx`
- Module augmentation for third-party JSX intrinsics lives next to its consumer: `declare module "@react-three/fiber"` in `components/ui/globe.tsx` (line 11)
- `Readonly<{ children: React.ReactNode }>` for layout children (`app/layout.tsx`)

## Linting & Formatting

**ESLint** (`eslint.config.mjs`): flat config using `defineConfig`, extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Ignores `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.

**Run:** `npm run lint` (executes bare `eslint`).

**Formatter:** No Prettier/Biome config present. Rely on editor defaults + ESLint. Observed conventions:
- 2-space indent
- Double quotes for JSX attribute and string literals in `.ts`/`.tsx`
- Trailing commas on multi-line literals
- Semicolons required

## Import Organization

Observed order across files:

1. External packages (`react`, `next/*`, `@base-ui/react/*`, `@react-three/fiber`, `three`, `lucide-react`, `@xyflow/react`, `class-variance-authority`, `clsx`, `tailwind-merge`)
2. Blank line
3. Internal `@/` aliased imports (`@/components/...`, `@/lib/utils`, `@/data/...`)

Type-only imports use `import type { ... }` or inline `type` specifier:
- `import type { GlobeConfig, Position } from "@/components/ui/globe"` (`components/globe-section.tsx`)
- `import { Canvas, extend, useThree, type ThreeElement } from "@react-three/fiber"` (`components/ui/globe.tsx`)

## Server vs Client Components

**Default is Server Component.** A file is a client component only when it opens with `"use client";` on line 1. Examples:
- Client: `components/decoded-title.tsx`, `components/globe-section.tsx`, `components/ui/globe.tsx`, `components/workflow/nodes.tsx`
- Server: `app/layout.tsx`, `app/page.tsx` — `app/page.tsx` composes client leaves without itself being client

**Rule:** Push `"use client"` to the lowest leaf that actually needs browser APIs, hooks, or event handlers. `app/page.tsx` stays a Server Component and imports `DecodedTitle` and `GlobeSection` as client leaves.

## Dynamic Imports for SSR-Incompatible Libraries

Three.js / WebGL code cannot render on the server. Pattern used in `components/globe-section.tsx` (lines 6-9):

```tsx
"use client";
import dynamic from "next/dynamic";
import type { GlobeConfig, Position } from "@/components/ui/globe";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false }
);
```

Key points:
- The wrapper (`globe-section.tsx`) is itself `"use client"` so `next/dynamic` with `ssr: false` is legal
- Types are imported statically with `import type` so they do not pull the runtime module into the server bundle
- Use `.then((m) => m.Named)` for named exports

Apply this pattern for any future WebGL, canvas, audio, or `window`-dependent library (three, `three-globe`, `@react-three/fiber`, future GSAP, etc.).

## Hooks & Animation Patterns

**SSR-safe initial state.** `components/decoded-title.tsx` deliberately seeds `useState` with a deterministic value so SSR markup matches the client's first paint, then starts real animation inside `useEffect`:

```tsx
const [chars, setChars] = useState<string[]>(() =>
  TARGET.split("").map((c) => (c === "·" ? "·" : "#"))
);
useEffect(() => {
  const scramble = setInterval(/* ... */, 55);
  return () => clearInterval(scramble);
}, []);
```

**Rules:**
- Never call `Math.random()`, `Date.now()`, or touch `window` during render — only inside `useEffect`
- Lazy init `useState(() => ...)` for computed defaults
- Always return a cleanup function from `useEffect` that clears every `setInterval`, `setTimeout`, and `requestAnimationFrame` you created
- Collect per-index timer handles in an array and clear them all in cleanup (see `unlocks` array in `decoded-title.tsx` lines 32, 62)

**`useRef` + `useEffect` for mutable values read inside timers.** `decoded-title.tsx` mirrors `locked` state into `lockedRef` so the interval callback reads fresh values without re-subscribing:

```tsx
const lockedRef = useRef(locked);
lockedRef.current = locked;
```

**Imperative three.js via refs.** `components/ui/globe.tsx`:
- `const globeRef = useRef<ThreeGlobe | null>(null)`
- Configure the instance inside `useEffect` (lines 84-133), reading/mutating `globeRef.current`
- Use `useMemo` for expensive scene objects constructed once: `const scene = useMemo(() => new Scene(), [])`
- Animation loops use `requestAnimationFrame` with a captured `raf` handle and `cancelAnimationFrame` in cleanup (see `Rig` component lines 149-164)

**Animation libraries available:** `motion` (v12, Framer Motion's new package) and `tw-animate-css`. No GSAP currently in dependencies — if added, follow the same `useEffect` + ref + cleanup pattern and wrap it in a client leaf loaded via `next/dynamic` if it touches `window` at module scope.

## Tailwind CSS v4 Conventions

**v4 setup** — no `tailwind.config.js`. Configuration lives in `app/globals.css`:
- `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`
- `@custom-variant dark (&:is(.dark *))` for dark mode
- `@theme inline { ... }` block maps design tokens to CSS variables
- `:root` and `.dark` define `oklch(...)` color tokens
- `@layer base { ... }` applies global defaults via `@apply`

**Shadcn tokens in use:** `bg-background`, `text-foreground`, `border-border`, `ring-ring`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `bg-destructive`, etc. Prefer these over raw color utilities when building UI primitives.

**Raw palette allowed for marketing surfaces.** `app/page.tsx` and `components/globe-section.tsx` use `bg-black`, `text-zinc-300`, `text-emerald-400`, etc. directly — that is fine for bespoke visual sections. Reach for design tokens when building reusable components in `components/ui/`.

**Utility-first, long class strings.** Classes are written inline on the JSX element. No `@apply` in component files. Example shape from `app/page.tsx` line 15:

```tsx
className="relative min-h-screen w-full overflow-hidden bg-black font-mono text-zinc-300 selection:bg-zinc-200 selection:text-black"
```

**Class composition.** Use `cn()` from `@/lib/utils` (which wraps `clsx` + `tailwind-merge`) whenever classes are conditional or when merging a user-provided `className` prop:

```tsx
import { cn } from "@/lib/utils";
className={cn(buttonVariants({ variant, size, className }))}
```

**Variants.** Use `class-variance-authority` (`cva`) for primitives with multiple visual variants. Canonical example: `components/ui/button.tsx` — single `buttonVariants` definition, `variant` and `size` enums, `defaultVariants`, `VariantProps<typeof buttonVariants>` pulled into the component's prop type.

**Arbitrary values** used freely for bespoke design: `text-[11px]`, `tracking-[0.25em]`, `opacity-[0.07]`, `bg-[radial-gradient(...)]`, `max-w-[1100px]`. Prefer tokens first, escape hatch second.

**Inline `style={}`** is reserved for CSS features Tailwind cannot express cleanly — `backgroundImage` gradients combined with `backgroundSize`, `maskImage` declarations, `WebkitMaskImage` prefixes. See `app/page.tsx` lines 20-26 and `components/globe-section.tsx` lines 62-67.

**Accessibility decorations.** Non-semantic visual layers get `aria-hidden` and `pointer-events-none` (grid backgrounds, vignettes, mask overlays in `app/page.tsx` and `globe-section.tsx`).

**Data attributes as hooks.** Primitives expose `data-slot="button"` so parents can target them via `in-data-[slot=button-group]:...` and `has-data-[icon=inline-end]:...` selectors (see `components/ui/button.tsx`).

## File Organization

```
app/
  layout.tsx          Server. Loads fonts, globals.css, wraps <html>/<body>.
  page.tsx            Server. Home route, composes client leaves.
  globals.css         Tailwind v4 config + theme tokens.
  fonts/              Local font assets.
components/
  decoded-title.tsx   Client. Top-level feature component.
  globe-section.tsx   Client. Wraps dynamic(World) with marketing copy.
  workflow-section.tsx Client. (uncommitted, see git status)
  ui/                 Shadcn/Base UI primitives. cva + cn pattern.
    button.tsx
    globe.tsx         three.js / react-three-fiber World primitive.
  workflow/           Feature-specific reusable parts.
    nodes.tsx         Custom @xyflow/react node components.
lib/
  utils.ts            cn() helper only.
data/
  globe.json          Static world geometry for the globe.
public/               Static assets served at /.
```

**Where to add new code:**

| New thing | Goes in |
|-----------|---------|
| Shadcn primitive / generic UI | `components/ui/<name>.tsx` |
| Marketing section on the home page | `components/<name>-section.tsx` |
| Feature sub-component (grouped with siblings) | `components/<feature>/<name>.tsx` |
| Pure helper / formatter | `lib/<name>.ts` |
| Static JSON dataset | `data/<name>.json` |
| New route | `app/<segment>/page.tsx` |
| Global CSS / theme token | `app/globals.css` inside existing `@theme inline` block |
| Browser-only third-party lib wrapper | Client leaf using `next/dynamic` with `{ ssr: false }` |

## Error Handling

No error boundaries, `error.tsx`, or `not-found.tsx` routes exist yet. Add them via App Router conventions when the app grows beyond the current landing page. Defensive null-checks in effects follow the pattern `if (!globeRef.current) return;` (`components/ui/globe.tsx` line 85).

## Logging

No logging framework. Do not add `console.log` to committed code; ESLint's `next/core-web-vitals` preset will warn.

## Comments

Sparse and purposeful. Used for:
- Non-obvious SSR concerns: `// Deterministic initial state so SSR + first client render match.` (`decoded-title.tsx` line 14)
- Visual intent that classes cannot express: `{/* grid background */}`, `{/* vignette */}`, `{/* radial vignette so the globe edges dissolve into pure black */}`
- Type-augmentation justification: `// silence unused warnings for re-exported three primitives consumed by JSX intrinsics` (`globe.tsx` line 202)

No JSDoc. Prefer TypeScript types to describe shape.

## Module Design

- **One default export per feature component file**, named exports for primitives and multi-component modules
- **No barrel (`index.ts`) files** — import directly from the file (`@/components/ui/button`, `@/components/workflow/nodes`)
- **Props types colocated** above the component, not in a separate `types.ts`
- **Constants live at module scope** above the component (`GLYPHS`, `TARGET`, `globeConfig`, `sampleArcs`, `PHASES`) when they are static and do not depend on props

---

*Convention analysis: 2026-04-07*
