# Technology Stack

**Analysis Date:** 2026-04-06

## Languages

**Primary:**
- TypeScript 5.x - Used for all application code including React components, Next.js configuration, and utilities
- JavaScript (JSX/TSX) - React component markup via Next.js App Router

**Secondary:**
- CSS - Global styles and Tailwind CSS directives in `app/globals.css`

## Runtime

**Environment:**
- Node.js 22.22.2 (current environment)
- Next.js 16.2.2 - Full-stack React framework with server components, API routes, and deployment optimization

**Package Manager:**
- npm 10.9.7
- Lockfile: package-lock.json (present)

## Frameworks

**Core:**
- Next.js 16.2.2 - React framework with App Router, server-side rendering, static generation, and API routes
- React 19.2.4 - UI library for component-based development
- React DOM 19.2.4 - Bindings for rendering React components to the browser

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework with PostCSS integration
- PostCSS - CSS transformation tool (configured via `postcss.config.mjs`)

**Font Loading:**
- Google Fonts API - Integrated via Next.js Font Optimization (`next/font/google`)
  - Fonts loaded: Geist, Geist_Mono

## Key Dependencies

**Critical:**
- next@16.2.2 - Full-stack framework; handles routing, server components, build optimization, image optimization
- react@19.2.4 - Core UI library required for all component development
- react-dom@19.2.4 - DOM rendering engine for React

**Styling & Appearance:**
- @tailwindcss/postcss@^4 - PostCSS plugin for Tailwind CSS processing
- tailwindcss@^4 - Utility-first CSS framework for rapid UI development

**Development & Quality:**
- TypeScript@^5 - Static type checking and ES2017+ to ES5 transpilation
- @types/node@^20 - Type definitions for Node.js APIs
- @types/react@^19 - Type definitions for React 19
- @types/react-dom@^19 - Type definitions for React DOM 19
- ESLint@^9 - JavaScript/TypeScript linting
- eslint-config-next@16.2.2 - Next.js-specific ESLint configuration with Web Vitals rules and TypeScript support

## Configuration

**Environment:**
- No .env files detected - Configuration is hardcoded or uses Next.js defaults
- Next.js configuration: `next.config.ts` (currently minimal/empty, uses all Next.js defaults)
- TypeScript configuration: `tsconfig.json` with strict mode enabled, ES2017 target, bundler module resolution

**Build:**
- ESLint configuration: `eslint.config.mjs` - Uses Next.js core Web Vitals and TypeScript presets
- PostCSS configuration: `postcss.config.mjs` - Loads Tailwind CSS v4 plugin
- TypeScript compiler: `tsconfig.json` - Strict mode enabled, path aliases configured (`@/*` maps to project root)

**Features Enabled:**
- TypeScript strict mode enabled
- JSX transformation via React 19 JSX runtime
- Module resolution: bundler (Next.js-optimized)
- Incremental compilation enabled
- Skip library type checking enabled for faster builds

## Platform Requirements

**Development:**
- Node.js 18+ (tested with 22.22.2)
- npm 7+ (tested with 10.9.7)
- Modern browser with ES2017 support minimum

**Production:**
- Deployment target: Vercel (recommended in README and template)
- Alternative: Any Node.js 18+ compatible hosting (Next.js self-hosting supported)
- Build output: `.next/` directory containing optimized bundles and server functions
- Static assets: `public/` directory for static files

---

*Stack analysis: 2026-04-06*
