# Codebase Concerns

**Analysis Date:** 2026-04-07

## Tech Debt

**Orphaned React Flow Node Definitions:**
- Issue: `components/workflow/nodes.tsx` defines five custom React Flow node components (`AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode`) totaling ~190 lines, but nothing in the app renders them. There is no `WorkflowSection`, no `ReactFlow` provider, and no import of `@xyflow/react` anywhere outside this file. The actual workflow UI on the landing page is a plain `<ol>` driven by an inline `PHASES` array in `app/page.tsx` (lines 4-11).
- Files: `components/workflow/nodes.tsx`, `app/page.tsx`
- Impact: Dead code ships as part of the bundle if the file is ever imported. Confuses readers about the architectural direction (React Flow vs. static list). Pulls in heavy deps (`@xyflow/react`, `lucide-react`) that are otherwise unused.
- Fix approach: Either (a) delete `components/workflow/nodes.tsx` and remove `@xyflow/react`/`lucide-react` from `package.json`, or (b) build the intended `WorkflowSection` that actually uses these nodes and wire it into `app/page.tsx`. Decide before more node types accumulate.

**Hard-Coded Workflow Phases in Page Component:**
- Issue: The `PHASES` constant is defined inline at the top of `app/page.tsx` (lines 4-11). Node IDs, names, and descriptions are literal strings with no typing, no separation from JSX, and no reuse path.
- Files: `app/page.tsx`
- Impact: Any future surface that needs the same phase list (sidebar, docs, CLI, tests) will duplicate this array. Cannot localize or theme centrally.
- Fix approach: Extract to `lib/phases.ts` (or `data/phases.ts`) as a typed `const` with a `Phase` interface. Import from both the landing page and any future workflow component.

**Hard-Coded Globe Arc Data Inside View Component:**
- Issue: `components/globe-section.tsx` defines `sampleArcs` (16 entries) and the full `globeConfig` object inline as module-level constants (lines 11-52). Arc color is a single `const c = "#ffffff"` repeated on every entry.
- Files: `components/globe-section.tsx`
- Impact: Arcs cannot be updated without a code deploy. No way to drive them from a real data source ("2.4M sources monitored" copy is aspirational — the arcs are static fiction). Color is not themable.
- Fix approach: Move arc data to `data/arcs.json` or fetch from an API route. Move `globeConfig` to a shared config module. Derive the color palette from CSS variables rather than hard-coding hex values.

**Non-Deterministic `arcStroke` Inside a Data Setter:**
- Issue: `components/ui/globe.tsx` line 116 sets `.arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])`. `Math.random()` is evaluated on every re-render of the effect, so stroke widths flicker whenever the effect re-runs, and there is no seed for deterministic output.
- Files: `components/ui/globe.tsx`
- Impact: Visual flicker on re-renders; makes snapshot testing impossible; impossible to reproduce a specific visual state.
- Fix approach: Precompute stroke widths once per arc (e.g., derive from `d.order` or `arcAlt`) and pass them via the `Position` type.

**Effect Re-Initializes Globe on Every Render:**
- Issue: In `components/ui/globe.tsx`, `defaultProps` is a new object literal created on every render (lines 58-82), then listed in the dependency array of the globe setup `useEffect` (line 133). Because object identity changes each render, React re-runs the entire globe configuration — hex polygons, arcs, rings — on every parent re-render.
- Files: `components/ui/globe.tsx` (lines 58-82, 133)
- Impact: Unnecessary work on every render; potential memory churn inside `three-globe`; dropped frames. Also wastes the `useMemo` on `scene` and `camera` in `World`.
- Fix approach: Either wrap `defaultProps` in `useMemo` keyed on the individual `globeConfig` scalars, or destructure the scalar fields and list them explicitly in the dependency array. Remove `defaultProps` from the effect deps entirely; only list the values actually read.

**Duplicate Fog Setup:**
- Issue: `components/ui/globe.tsx` sets `scene.fog` in two places — once in `World` via `useMemo` (line 172) and again in `Rig` via `useEffect` (line 147). Both create fresh `Fog` instances with identical parameters.
- Files: `components/ui/globe.tsx`
- Impact: Wasted allocation; the `Rig` effect overwrites the memoized scene's fog, making the `useMemo` misleading.
- Fix approach: Set fog in exactly one place (prefer the `Canvas` scene definition) and delete the other.

**Unused UI Primitives:**
- Issue: `components/ui/button.tsx` is a fully-configured shadcn/base-ui button with five variants and seven sizes, but no caller imports it. It is the only consumer of `@base-ui/react` and `class-variance-authority` in the app.
- Files: `components/ui/button.tsx`
- Impact: Ships dead code and pulls two dependency trees (`@base-ui/react`, `class-variance-authority`) into the bundle for zero runtime benefit.
- Fix approach: Delete the file and remove both deps, or actually use `Button` in the page/components.

**Generic "Create Next App" Metadata:**
- Issue: `app/layout.tsx` lines 15-18 still ship the scaffold metadata: `title: "Create Next App"`, `description: "Generated by create next app"`. The rest of the site brands itself as "BlackLedger".
- Files: `app/layout.tsx`
- Impact: Browser tab, search results, OpenGraph previews, and social shares all advertise the wrong product name.
- Fix approach: Replace with BlackLedger-specific title, description, OpenGraph tags, and a favicon that isn't the Next.js default.

**Redundant CSS Theme for an All-Black Page:**
- Issue: `app/globals.css` imports shadcn's full theme (light + dark mode tokens, chart colors, sidebar tokens, 7 radius scales) spanning lines 7-118. The actual site is hand-styled with raw `zinc-*` Tailwind classes and a black background — none of the shadcn tokens are referenced by any component that is rendered.
- Files: `app/globals.css`, `components/ui/button.tsx` (only consumer)
- Impact: ~100 lines of unused CSS custom properties, plus the `tw-animate-css` and `shadcn/tailwind.css` imports, bloat the CSS payload. The only component that would use these tokens (`button.tsx`) is itself unused.
- Fix approach: If the shadcn ecosystem is not actually being adopted, strip the theme block, remove the `tw-animate-css` and `shadcn/tailwind.css` imports, and drop `shadcn` + `tw-animate-css` from `package.json`.

## Anti-Patterns

**Unsafe Type Coercion Through `unknown`:**
- Issue: Every node component in `components/workflow/nodes.tsx` does `const d = data as unknown as AgentData;` (lines 26, 48, 74, 102, 146). This double-cast defeats the whole point of typing `NodeProps` and silently hides shape mismatches.
- Files: `components/workflow/nodes.tsx`
- Impact: Runtime crashes if React Flow ever passes a node whose `data` does not match the assumed shape. Type system provides zero guarantee.
- Fix approach: Use React Flow's generic `NodeProps<AgentData>` form (supported in `@xyflow/react` v12), or add a runtime validator (zod) at the node boundary.

**Module-Scope Three.js Side Effect:**
- Issue: `extend({ ThreeGlobe })` runs at module import time in `components/ui/globe.tsx` (line 9). `next/dynamic` with `ssr: false` guards the import at the React level, but if this module is ever imported from a server component by mistake, `extend` executes on the server where Three.js has no DOM.
- Files: `components/ui/globe.tsx`
- Impact: Fragile — the `"use client"` directive and the dynamic import in `globe-section.tsx` are the only things keeping this from blowing up. Any direct server import would crash the build.
- Fix approach: Move `extend({ ThreeGlobe })` inside the `World` component or a `useEffect` so it only runs on the client.

## Next.js 16 Compatibility Review

**AGENTS.md explicitly warns "this is NOT the Next.js you know"** and directs readers to `node_modules/next/dist/docs/` before writing code. The following patterns in the current codebase should be audited against Next.js 16 breaking changes:

**`next/dynamic` with `ssr: false`:**
- Files: `components/globe-section.tsx` (lines 6-9)
- Concern: `next/dynamic({ ssr: false })` semantics changed across recent majors (Next.js 14/15 restricted it in Server Components). Verify it is still the idiomatic way to load a client-only Three.js module in 16, or migrate to the documented replacement.
- Action: Read `node_modules/next/dist/docs/` for the 16.x guidance on client-only components before making further changes.

**`metadata` export on root layout:**
- Files: `app/layout.tsx`
- Concern: The `export const metadata: Metadata = { ... }` API has been stable but has had subtle changes (viewport split, generateMetadata signatures). Verify the current shape still matches 16.x requirements.

**`next/font/google` import path:**
- Files: `app/layout.tsx`
- Concern: Earlier majors moved fonts from `@next/font` to `next/font`. Confirm `next/font/google` is still the correct path in 16.x and that no new CLI-based font setup has replaced it.

**`app/` directory defaults:**
- Files: `app/`
- Concern: Defaults around caching, dynamic rendering, and Partial Prerendering have shifted across 13→14→15→16. The app currently has no `export const dynamic`, no `revalidate`, and no caching hints — confirm this produces the intended rendering mode under 16.x.

- Impact: Silently-broken patterns may work in dev but fail at build time, or work today and break when any config is added.
- Fix approach: Before any phase that touches rendering/routing, spawn a quick read pass over `node_modules/next/dist/docs/` and record the 16.x-specific rules in `STACK.md` or a dedicated `NEXT16.md`.

## Accessibility Gaps

**Globe Has No Text Alternative or Reduced-Motion Handling:**
- Issue: `components/globe-section.tsx` renders a continuously auto-rotating Three.js canvas with no `aria-label`, no `role`, no static fallback, and no respect for `prefers-reduced-motion`. `autoRotate: true` and `autoRotateSpeed: 0.6` are hard-coded in `globeConfig` (lines 30-31).
- Files: `components/globe-section.tsx`, `components/ui/globe.tsx` (Rig component, lines 144-166)
- Impact: Screen readers announce nothing. Users with vestibular disorders have no way to stop the rotation. Users on low-power devices burn battery on decorative animation.
- Fix approach: Wrap the globe in a `<figure>` with a `<figcaption>` describing the visual. In `Rig`, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and disable `autoRotate` when true. Expose a visible pause toggle.

**Decorative Animation Without Motion Guards:**
- Issue: `components/decoded-title.tsx` runs a 55ms scramble interval plus staggered unlock timeouts (lines 26-57) with no `prefers-reduced-motion` check. The `DecodedTitle` does set a proper `aria-label="BLACK LEDGER"` (line 68), which is good, but the visual scramble still runs for users who opted out of animation.
- Files: `components/decoded-title.tsx`
- Impact: Motion-sensitive users see rapid flashing for ~2 seconds.
- Fix approach: Skip the scramble entirely and render the final `TARGET` when `prefers-reduced-motion: reduce` is set.

**Pulsing Status Indicator Without Motion Guards:**
- Issue: `app/page.tsx` line 38 uses `animate-pulse` on the "online" status dot. Same issue in `nodes.tsx` (multiple `animate-pulse` calls on Activity/Cpu icons).
- Files: `app/page.tsx`, `components/workflow/nodes.tsx`
- Impact: Minor — single small dot — but accumulates with the other unchecked animations.
- Fix approach: Configure Tailwind's motion-safe variants or add a global CSS rule that disables animations under `prefers-reduced-motion: reduce`.

**Low Contrast Text:**
- Issue: The design uses heavy `text-zinc-600`, `text-zinc-700`, `text-zinc-800` on a pure black background throughout `app/page.tsx` (phase descriptions line 77, phase numbers line 70, footer line 90, header line 36) and `components/globe-section.tsx` (lines 71, 83, 90). `zinc-700` on `#000` measures roughly 3.5:1 which fails WCAG AA for body text.
- Files: `app/page.tsx`, `components/globe-section.tsx`
- Impact: Hard-to-read copy for users with reduced vision; fails accessibility audits.
- Fix approach: Promote body-size text to at least `zinc-500` (≈5.7:1) on black, or add a user-toggleable high-contrast mode.

**No Mobile Click-to-Expand Pattern Yet (and no accessibility plan for when it exists):**
- Issue: The task brief mentions a "mobile click-to-expand stages" pattern that does not exist in the current code (`workflow-section.tsx` is absent). When that component is built, the pattern must expose expand/collapse as real buttons with `aria-expanded` and keyboard support, not clickable divs.
- Files: N/A (future)
- Impact: Easy to get wrong on first build; worth capturing now as a requirement.
- Fix approach: When the mobile stages UI is implemented, use `<button type="button" aria-expanded={open} aria-controls={panelId}>` and render the expandable panel with a matching `id`. Cover it with a keyboard-only manual test.

## Performance Concerns

**Dynamic Import of Globe Without a Loading Placeholder:**
- Issue: `components/globe-section.tsx` uses `next/dynamic(..., { ssr: false })` but passes no `loading` component (lines 6-9).
- Files: `components/globe-section.tsx`
- Impact: On first paint the aspect-square container is empty until Three.js, `three-globe`, and the country GeoJSON all download and execute. No skeleton or reserved visual state.
- Fix approach: Pass `loading: () => <GlobeSkeleton />` to `dynamic()`.

**Country GeoJSON Shipped as JSON Import:**
- Issue: `components/ui/globe.tsx` line 7 imports `@/data/globe.json` directly, so the entire country polygon dataset is inlined into the client bundle. No code-splitting beyond the `dynamic()` wrapper.
- Files: `components/ui/globe.tsx`, `data/globe.json`
- Impact: Large JSON blob bloats the globe chunk. First-load cost on slow networks is significant.
- Fix approach: Fetch the JSON at runtime via `fetch('/globe.json')` from a static file in `public/`, and cache it in IndexedDB or via HTTP caching headers. Also consider a lower-resolution polygon set.

**`.arcDashInitialGap((d) => (d as Position).order)` etc. Recreated on Every Effect Run:**
- Issue: Because the setup `useEffect` in `components/ui/globe.tsx` re-runs on every render (see the `defaultProps` identity bug above), every `.arcStartLat`, `.arcColor`, `.ringsData` setter is re-invoked, re-allocating Three.js geometry.
- Files: `components/ui/globe.tsx`
- Impact: GPU thrash; dropped frames on lower-end devices.
- Fix approach: Fix the effect dependency first (see Tech Debt). Then audit the setup block for idempotency.

## Fragile Areas

**`@/data/globe.json` Type Assertion:**
- Files: `components/ui/globe.tsx` line 100 (`(countries as { features: object[] }).features`)
- Why fragile: The JSON is typed as `object[]` features, then passed to `three-globe` which expects GeoJSON Polygon/MultiPolygon features. If the file's schema changes, TypeScript will not catch it.
- Safe modification: Define a GeoJSON feature type (or import from `@types/geojson`) and assert against that.
- Test coverage: None.

**Inline Style Masks on Decorative Divs:**
- Files: `app/page.tsx` lines 21-26, `components/globe-section.tsx` lines 62-67
- Why fragile: Backgrounds depend on `maskImage` / `WebkitMaskImage` with hand-tuned percentages. Any change to container sizing cascades into visible seams between the page grid and the globe backdrop.
- Safe modification: Extract the mask gradients into CSS custom properties so both the page grid and the globe backdrop share the same stop values. Visually regression test on small + large viewports together.
- Test coverage: None.

**DecodedTitle Hydration Assumptions:**
- Files: `components/decoded-title.tsx`
- Why fragile: The SSR/client match is achieved by rendering `#` placeholders on the server and only scrambling inside `useEffect` (comment on line 14-15). Any future change that moves state initialization out of the lazy initializer will reintroduce a hydration mismatch because `randomChar()` is non-deterministic.
- Safe modification: Keep `useState` lazy initializers deterministic. Never call `randomChar()` in render.
- Test coverage: None.

## Security Considerations

**`metadata.description` Leaks Scaffolding Origin:**
- Risk: Low, but "Generated by create next app" signals that the project has not had a security review and reveals the framework to passive scanners. Combine with a known Next.js CVE window and an attacker has a free fingerprint.
- Files: `app/layout.tsx`
- Current mitigation: None.
- Recommendations: Replace metadata before any public deploy. Add security headers (CSP, X-Frame-Options, Referrer-Policy) via `next.config.ts` `headers()`.

**Empty `next.config.ts`:**
- Risk: No security headers, no image remote patterns, no CSP. If the globe ever loads map tiles or the page embeds third-party content, there is no defensive posture.
- Files: `next.config.ts`
- Current mitigation: None.
- Recommendations: Populate `headers()` with at least `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and a baseline CSP before shipping.

**No Secrets Management Documentation:**
- Risk: No `.env.example` exists. Future contributors cannot tell whether env vars are expected.
- Files: project root
- Current mitigation: `.gitignore` excludes `.env*` (standard Next scaffold).
- Recommendations: Add `.env.example` as soon as the first env var is introduced (e.g., when the globe starts pulling real news data).

## Missing Critical Features

**Zero Testing Infrastructure:**
- Problem: No test runner, no test files, no `test` script in `package.json`. Not even a placeholder Vitest or Jest config.
- Blocks: Cannot regression-test the decoded title hydration contract, the globe effect, the phase list, or any accessibility fix. Every change is unverified.
- Priority: **High.** This is a polished marketing/landing codebase with several non-trivial visual components; the lack of any automated guardrail is the biggest single risk.
- Fix approach: Add Vitest + `@testing-library/react` + `jsdom`. First tests to write:
  1. `DecodedTitle` renders the final `TARGET` string after timers flush.
  2. `GlobeSection` renders the descriptive copy and mounts the `World` dynamic.
  3. `PHASES` array exposes exactly 6 phases in the expected order.
  Also add Playwright for the eventual mobile expand-stages interaction.

**No Error Boundaries:**
- Problem: Three.js/`three-globe` can throw at runtime (WebGL context loss, out-of-memory on low-end devices). There is no `error.tsx` in `app/` and no React error boundary around `<World />`.
- Blocks: A crash in the globe takes down the entire landing page.
- Priority: Medium-High. Add `app/error.tsx` (Next.js 16 route error boundary) and a component-level boundary around `GlobeSection`.

**No `loading.tsx` / Suspense Fallback:**
- Problem: The globe chunk has no visible loading state beyond a black box.
- Blocks: Poor perceived performance on first paint.
- Priority: Medium.

**No Favicon/OG Assets Beyond Scaffold:**
- Problem: `app/favicon.ico` is still the default Next.js icon. No OpenGraph image, no Twitter card metadata.
- Blocks: Social sharing looks unbranded.
- Priority: Medium.

## Duplication

**Repeated `font-mono text-xs uppercase tracking-[0.2em]` (and variants) Everywhere:**
- Issue: The classes `font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-6xx` appear in `app/page.tsx` (header line 36, workflow label line 58, footer line 90) and `components/globe-section.tsx` (section label line 71, bullet list line 90). Each call-site tunes the tracking and text color slightly differently.
- Files: `app/page.tsx`, `components/globe-section.tsx`
- Impact: Visual drift between sections (tracking is `0.25em` in some places, `0.2em` or `0.3em` in others); hard to rebrand.
- Fix approach: Define a `<Eyebrow>` or `<Label>` primitive in `components/ui/` and use it for every small-caps label.

**Handle Styling Duplicated Per Node:**
- Issue: Every node in `components/workflow/nodes.tsx` repeats `className="h-3 w-3 border-2 border-{color}-300 bg-{color}-500"` on both handles with only the color token varying (lines 41-42, 66-67, 95-96, 139-140, 188).
- Files: `components/workflow/nodes.tsx`
- Impact: Adding a new color variant means five edits. Harder to keep accent colors in sync.
- Fix approach: Create a `<NodeHandle color="purple" type="source" />` wrapper that builds the class list once.

**Card Chrome Duplicated Per Node:**
- Issue: Every node in `nodes.tsx` repeats the same structure: `min-w-[...] rounded-lg border-2 border-{c}-500/50 bg-black shadow-lg shadow-{c}-500/20` wrapper + header strip + body. Only the icon, title, color, and body content change.
- Files: `components/workflow/nodes.tsx`
- Impact: ~190 lines for what could be ~60. Every cosmetic change (e.g., border radius) has to be made five times.
- Fix approach: Extract a `<NodeCard color="purple" icon={Bot} kind="Agent">` component and pass children for the body.

## Hardcoded Values That Should Be Config

- `GLYPHS` and `TARGET` in `components/decoded-title.tsx` lines 5-6 — should be props so the component is reusable.
- `sampleArcs` and `globeConfig` in `components/globe-section.tsx` lines 11-52 — see Tech Debt above.
- Phase list in `app/page.tsx` lines 4-11 — see Tech Debt above.
- Camera radius `300`, camera Y `80`, angle speed multiplier `0.0015` in `components/ui/globe.tsx` lines 153-158 — magic numbers with no comment.
- `"v0.0.1 · 2026.04"` in `app/page.tsx` line 41 — version label hard-coded in JSX; should come from `package.json` at build time.
- Marketing numbers `"2.4M sources monitored"`, `"sub-second classification"` in `components/globe-section.tsx` lines 91-93 — should at minimum live in a content module (`content/landing.ts`) so copy edits don't require touching component files.

## Large Files That Should Be Split

**`components/workflow/nodes.tsx` (~190 lines, 9 KB):**
- Why split: Five independent node components plus six type definitions in one file. The `PredictionNode` alone is ~45 lines of JSX.
- Suggested split:
  - `components/workflow/nodes/agent-node.tsx`
  - `components/workflow/nodes/api-node.tsx`
  - `components/workflow/nodes/grok-node.tsx`
  - `components/workflow/nodes/signal-node.tsx`
  - `components/workflow/nodes/prediction-node.tsx`
  - `components/workflow/nodes/types.ts`
  - `components/workflow/nodes/node-card.tsx` (shared chrome — see Duplication)
  - `components/workflow/nodes/index.ts` (barrel)
- Only worth doing if the file is actually going to be used; otherwise delete it (see Tech Debt).

**`components/ui/globe.tsx` (~200 lines, 6 KB):**
- Why split: Three concerns mixed — type definitions, the `Globe` renderer, the `Rig` camera controller, and the `World` Canvas wrapper. Hard to unit test in isolation.
- Suggested split:
  - `components/ui/globe/types.ts` (`GlobeConfig`, `Position`)
  - `components/ui/globe/globe-mesh.tsx` (the `Globe` component and its data setup)
  - `components/ui/globe/rig.tsx`
  - `components/ui/globe/world.tsx` (the exported `World` wrapper)
  - `components/ui/globe/index.ts`

**`components/globe-section.tsx` (~105 lines):**
- Why split: Static data (arcs + config) is inlined with layout JSX. Extract the data to `data/arcs.ts` and the config to `components/ui/globe/config.ts`.

## Components Doing Too Much

**`app/page.tsx`:**
- Does: grid background, vignette, header, title section, workflow list, globe section, footer — all inline.
- Should: compose sub-components. `<GridBackground />`, `<SiteHeader />`, `<TitleSection />`, `<WorkflowSection />`, `<SiteFooter />`. The file should end up ~30 lines of layout.
- Impact: As the page grows, `page.tsx` becomes a god component. The missing `WorkflowSection` (referenced in the task brief) should be the first extraction.

**`components/ui/globe.tsx` `Globe` inner component:**
- Does: material tuning, hex polygon config, arc config, ring config, and dependency tracking — all in one 80-line `useEffect`.
- Should: split into `useGlobeMaterial`, `useHexPolygons`, `useArcs`, `useRings` custom hooks. Makes the effect auditable and testable in isolation.

## Scaling Limits

**Single Landing Page, No Routing Strategy:**
- Current capacity: Fine for a one-pager.
- Limit: No layouts beyond root, no route groups, no server actions. Adding auth, dashboards, or admin views will require a large refactor.
- Scaling path: Introduce route groups (`app/(marketing)/`, `app/(app)/`) before the second route is added so marketing and app shells diverge cleanly.

**No Data Layer:**
- Current capacity: All data is static literals baked into components.
- Limit: The marketing copy already claims real-time ingestion ("2.4M sources monitored") that does not exist. First real data integration will need a data-fetching convention from scratch.
- Scaling path: Pick a pattern now — server components + `fetch` with tagged revalidation is the Next.js 16 default — and document it in `ARCHITECTURE.md`.

## Test Coverage Gaps

**Everything. Specifically:**

- **`DecodedTitle` hydration:** No test verifies the SSR/client render match. A future edit that breaks the deterministic initial state will only show up as a hydration warning in the browser console.
  - Files: `components/decoded-title.tsx`
  - Priority: High.

- **`GlobeSection` dynamic import:** No test verifies the loading boundary or that the component renders without the actual `World` chunk (which cannot run in jsdom).
  - Files: `components/globe-section.tsx`
  - Priority: Medium — requires mocking `next/dynamic`.

- **Globe effect idempotency:** No test catches the `defaultProps`-causes-re-init bug described in Tech Debt.
  - Files: `components/ui/globe.tsx`
  - Priority: High.

- **Phase list invariants:** No test asserts `PHASES.length === 6` or that IDs are sequential.
  - Files: `app/page.tsx`
  - Priority: Low, but trivial to add.

- **Accessibility:** No `axe`/`jest-axe` integration. No keyboard navigation test. No `prefers-reduced-motion` test.
  - Files: all interactive components
  - Priority: High.

- **Visual regression:** No Playwright/Percy/Chromatic setup. Every visual tweak is vibes-based.
  - Files: all components
  - Priority: Medium.

---

*Concerns audit: 2026-04-07*
