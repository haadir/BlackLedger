# External Integrations

**Analysis Date:** 2026-04-06

## APIs & External Services

**Font Services:**
- Google Fonts API - Provides Geist and Geist_Mono font families
  - SDK/Client: Integrated via `next/font/google`
  - Configuration: Fonts loaded with Latin subset in `app/layout.tsx`
  - Auth: Public API, no credentials required

**Template & Deployment:**
- Vercel Platform - Deployment and hosting (referenced in template but not yet integrated)
  - Documentation: Links in `app/page.tsx` for Vercel deployment
  - SDK/Client: Not installed; referenced for future deployment

## Data Storage

**Databases:**
- Not detected - No database client or ORM installed
- Status: Not yet integrated into project

**File Storage:**
- Local filesystem only - Static assets served from `public/` directory via Next.js
- No cloud storage services detected

**Caching:**
- Next.js built-in caching
  - Static page generation cache via App Router
  - No external cache service (Redis, Memcached) detected

## Authentication & Identity

**Auth Provider:**
- Not implemented - No authentication framework detected
- Status: Authentication not yet integrated

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service (Sentry, Rollbar, etc.) installed

**Logs:**
- Console-based only (default Node.js/browser console)
- No centralized logging service configured

## CI/CD & Deployment

**Hosting:**
- Vercel Platform (recommended, not yet configured)
  - Alternative: Self-hosted on any Node.js 18+ server
  - Build command: `npm run build` (via Next.js CLI)
  - Start command: `npm start` (via Next.js CLI)

**CI Pipeline:**
- Not detected - No CI/CD configuration found
- Status: Not yet configured

## Environment Configuration

**Required env vars:**
- None currently required - Project runs with defaults
- Future requirements: Will depend on database, API, and auth integrations

**Secrets location:**
- `.env` file - Not created yet (reserved for future use)
- `.env.local` - Not created yet (would override .env in development)
- Pattern: Standard Next.js environment variable loading from root-level .env files

## Webhooks & Callbacks

**Incoming:**
- None detected - No API routes for webhooks implemented

**Outgoing:**
- None detected - No external webhook calls in codebase

## External Dependencies Status

**Current State:**
- Minimal external integrations - Project is in initial Next.js template state
- All external connectivity is read-only (fonts via Google Fonts API only)
- No transactional or stateful external services configured

**Ready for Integration:**
- Database: No ORM installed; suggest Prisma, Drizzle, or native database clients
- Authentication: No auth library installed; suggest NextAuth.js, Clerk, or Auth0
- API calls: Can be added via fetch() or axios in API routes (`app/api/`) or server components
- File uploads: Next.js Server Actions and API routes support file handling

---

*Integration audit: 2026-04-06*
