# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**Font Services:**
- Google Fonts (via `next/font/google`)
  - SDK/Client: `next/font/google` in `app/layout.tsx`
  - Fonts: `Geist`, `Geist_Mono` (Latin subset)
  - Auth: None (public, fetched at build time)

**News / Market Data (aspirational, not wired):**
- Copy in `components/globe-section.tsx` describes ingesting "wires, filings, market microstructure, and geopolitical chatter" and references a Grok model in `components/workflow/nodes.tsx` (`GrokNode`).
- Status: UI-only. No SDKs, API clients, or network calls for these services exist in the codebase.

## Data Storage

**Databases:**
- Not detected - No ORM, driver, or connection client installed

**File Storage:**
- Local filesystem only
  - `public/` - Static assets served by Next.js
  - `data/globe.json` - Country polygon feature collection consumed by `components/ui/globe.tsx` via `hexPolygonsData`

**Caching:**
- Next.js built-in (App Router RSC/data cache)
- No external cache service

## Authentication & Identity

**Auth Provider:**
- Not implemented - No auth library, middleware, or session handling present
- `components/ui/button.tsx` wraps `@base-ui/react/button` but there is no login flow

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry/Rollbar/etc.)

**Logs:**
- Default console only; no structured logger

**Analytics:**
- Not detected; no `@vercel/analytics` or similar

## CI/CD & Deployment

**Hosting:**
- No deployment config committed (no `vercel.json`, no Dockerfile, no GitHub Actions workflows)
- Next.js defaults target Vercel or any Node 18+ host

**CI Pipeline:**
- None detected in repo (`.github/` not present)

## Environment Configuration

**Required env vars:**
- None. App runs with zero environment configuration.

**Secrets location:**
- No `.env*` files exist in repo root
- No secret stores referenced

## Webhooks & Callbacks

**Incoming:**
- None - No route handlers under `app/api/` (directory does not exist)

**Outgoing:**
- None - No `fetch`/SDK calls to external services in checked-in source

## Client-Side External Assets

**WebGL / 3D:**
- `three-globe` loads hex polygon geometry from local `data/globe.json`; no remote tile or map provider is contacted
- `@react-three/fiber` `Canvas` runs entirely client-side; `GlobeSection` uses `next/dynamic(..., { ssr: false })` to skip SSR

**Workflow Graph:**
- `@xyflow/react` node components in `components/workflow/nodes.tsx` are pure presentational cards (`AgentNode`, `APINode`, `GrokNode`, `SignalNode`, `PredictionNode`). Statuses, latencies, and predictions come from props - no live data source is wired.

## External Dependencies Status

**Current State:**
- Marketing / landing surface only. The sole live external dependency is Google Fonts fetched by Next.js at build time.
- All 3D, workflow, and "signal" UIs are driven by in-repo static data or component props.

**Ready for Integration:**
- Database: choose ORM (Prisma, Drizzle) and add a driver
- Auth: NextAuth.js / Clerk / Auth0 etc.
- Data ingest: implement under `app/api/**/route.ts` (directory not yet created)
- Telemetry: add Sentry and/or Vercel Analytics

---

*Integration audit: 2026-04-07*
