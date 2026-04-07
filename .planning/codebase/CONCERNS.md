# Codebase Concerns

**Analysis Date:** 2026-04-06

## Tech Debt

**Boilerplate-Heavy Initial State:**
- Issue: Project is a fresh Create Next App scaffold with placeholder content. `app/page.tsx` contains only template UI with no business logic, and `app/layout.tsx` has generic configuration.
- Files: `app/page.tsx`, `app/layout.tsx`
- Impact: No actual features implemented; development starts from scratch with generic template. All content refers to Next.js documentation links rather than application-specific functionality.
- Fix approach: Replace placeholder content with actual business logic and domain-specific components as features are developed.

**Unused/Extraneous Dependencies:**
- Issue: Package manager reports 5 extraneous packages that should not be present: `@emnapi/core@1.9.2`, `@emnapi/runtime@1.9.2`, `@emnapi/wasi-threads@1.2.1`, `@napi-rs/wasm-runtime@0.2.12`, `@tybys/wasm-util@0.10.1`
- Files: `package.json`, `package-lock.json`
- Impact: Increases node_modules size, build time, and attack surface. These WASM/native binding packages serve no clear purpose in a Next.js frontend application and should be cleaned up.
- Fix approach: Run `npm prune` or manually remove extraneous packages from `package-lock.json` and reinstall dependencies with `npm ci`.

**Empty Configuration Files:**
- Issue: `next.config.ts` is essentially empty with only a comment placeholder. Configuration is deferred to future implementation.
- Files: `next.config.ts`
- Impact: No customization or optimization applied. As features are added, this file will need to be populated with proper configuration (image optimization, rewrites, redirects, etc.).
- Fix approach: Configure Next.js options as needed per feature requirements (compression, headers, middleware, etc.).

## Dependencies at Risk

**Next.js Version 16.2.2 (Bleeding Edge):**
- Risk: Version 16.x is a very recent major version with potential for undocumented breaking changes. The project instructions in `AGENTS.md` explicitly warn: "This is NOT the Next.js you know - APIs, conventions, and file structure may all differ from your training data."
- Impact: Standard Next.js knowledge may not apply. Features may behave unexpectedly. Documentation may be incomplete or in flux.
- Migration plan: If issues arise with version 16, consider pinning to a stable LTS version (e.g., 15.x). Thoroughly test all features against release notes and official documentation in `node_modules/next/dist/docs/`.

**React 19.2.4 (Recent Major Version):**
- Risk: React 19 is a recent major version released in late 2024. Some third-party libraries may have compatibility issues or may not yet support React 19's new features (use, async components, etc.).
- Impact: Potential conflicts with ecosystem libraries if added later. May require workarounds or specific version constraints.
- Migration plan: Before adding new dependencies, verify React 19 compatibility. Test thoroughly with new integrations.

## Missing Critical Features

**No Testing Infrastructure:**
- Problem: No test framework configured. No test files exist.
- Blocks: Cannot verify code quality, catch regressions, or ensure reliability as features are added.
- Priority: High - Should be implemented early (Jest or Vitest + @testing-library/react recommended for Next.js/React projects).

**No Authentication/Authorization:**
- Problem: No auth system in place (no session management, user model, or access control).
- Blocks: Building any multi-user or protected features.
- Priority: High if multi-user functionality is required; Low if this is a single-user/public application.

**No API Routes or Backend:**
- Problem: No API route handlers in `app/api/`. No database integration or backend logic.
- Blocks: Cannot persist data, cannot implement business logic, cannot integrate with external services.
- Priority: High for most applications.

**No Error Handling or Error Boundaries:**
- Problem: No error boundary components, no centralized error handling, no 404/error pages beyond defaults.
- Blocks: Production reliability is at risk. Users will see console errors and unhandled exceptions.
- Priority: High - Implement custom error pages and error boundaries before deployment.

**No Environment Configuration:**
- Problem: `.env.example` or `.env.local.example` not present. No documented required environment variables.
- Blocks: Collaborators cannot set up the project without guessing what configuration is needed.
- Priority: Medium - Should be documented as features are added.

## Fragile Areas

**Tailwind CSS with Inline Theme:**
- Files: `app/globals.css`, `postcss.config.mjs`
- Why fragile: CSS uses inline theme configuration with `@theme inline` which is a Tailwind v4 feature. The font variables are defined at build time from `layout.tsx` but CSS is imported directly. Any changes to font loading or theme structure could break styling.
- Safe modification: Update both `layout.tsx` and `globals.css` together. Test color schemes and font rendering in light/dark modes.
- Test coverage: No automated testing of CSS/styling exists.

**Hard-Coded External Links:**
- Files: `app/page.tsx` (lines 22-34, 40, 55)
- Why fragile: Template links to Vercel, Next.js docs, and templates are hard-coded with utm parameters. If project pivots away from Vercel or Next.js marketing, these become misleading.
- Safe modification: Replace links with application-specific navigation once content is finalized.
- Test coverage: No link validation or E2E tests exist.

**TypeScript Target Mismatch:**
- Files: `tsconfig.json` (line 3)
- Why fragile: Target is set to `ES2017` (7 years old) while dependencies use modern APIs. This may cause transpilation overhead or compatibility issues with newer React/Next.js features.
- Safe modification: Update target to `ES2020` or `ES2022` based on actual browser support requirements.
- Test coverage: No build size or compatibility testing in place.

## Scaling Limits

**Single-Page Application Pattern:**
- Current capacity: Suitable for small to medium applications with modest traffic.
- Limit: As features grow, lack of API routes and data persistence will become limiting. File-based routing may become hard to manage at scale.
- Scaling path: Implement API routes in `app/api/`, add database integration, consider separating backend as microservice if needed.

**No Caching Strategy:**
- Current capacity: Every page load performs full render. No static generation or incremental static regeneration configured.
- Limit: Will struggle under load without caching. CDN headers not configured.
- Scaling path: Add `revalidate` directives, implement static/dynamic route strategy, configure Next.js Image Optimization, add cache headers in middleware.

## Security Considerations

**External Link Security:**
- Risk: Multiple external links in `app/page.tsx` use `target="_blank"` with `rel="noopener noreferrer"` correctly configured (lines 41-42, 56-57), but links point to third-party sites (Vercel, Next.js docs).
- Files: `app/page.tsx`
- Current mitigation: Proper rel attributes are set.
- Recommendations: Once application is deployed, remove or replace these marketing links. Ensure all external links are validated and intentional.

**No CSRF/Security Headers Protection:**
- Risk: No middleware or configuration for security headers (Content-Security-Policy, X-Frame-Options, etc.).
- Files: `next.config.ts` (empty)
- Current mitigation: None.
- Recommendations: Implement security headers in `next.config.ts` headers configuration or middleware. Add rate limiting if API routes are added.

**No Input Validation:**
- Risk: No form handling or input validation framework present. When API routes or forms are added, must implement proper validation to prevent injection attacks.
- Files: None yet (future concern).
- Current mitigation: None (not applicable yet).
- Recommendations: Use a validation library (zod, yup) when accepting user input. Sanitize and validate server-side.

**No Secrets Management:**
- Risk: `.env` files are in `.gitignore` (correct), but no documented way to manage secrets. If API keys or credentials are needed, they must be added to `.env.local` (not committed).
- Files: `.gitignore`
- Current mitigation: Environment files are ignored.
- Recommendations: Create `.env.example` documenting required env vars. Never commit `.env.local`, `.env.production.local`, etc. Use platform-specific secret management (Vercel Environment Variables, GitHub Secrets, etc.) for production.

## Test Coverage Gaps

**Zero Test Coverage:**
- What's not tested: Entire application. No unit, integration, or E2E tests exist.
- Files: No test files present
- Risk: All code changes are unverified. Components may break unexpectedly. Regressions will go undetected.
- Priority: Critical - Implement testing strategy before adding business logic.

**No Component Tests:**
- What's not tested: React components have no tests. `app/page.tsx` and `app/layout.tsx` are untested.
- Files: `app/page.tsx`, `app/layout.tsx`
- Risk: UI changes could break or regress silently.
- Priority: High - Add component tests using @testing-library/react.

**No E2E Tests:**
- What's not tested: No end-to-end workflow testing exists.
- Files: None
- Risk: Integration between components and features is unverified. Cannot catch cross-feature breakage.
- Priority: Medium-High - Add E2E tests for critical user flows once features exist.

---

*Concerns audit: 2026-04-06*
