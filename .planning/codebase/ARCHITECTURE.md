# Architecture

**Analysis Date:** 2026-04-06

## Pattern Overview

**Overall:** Next.js App Router with Server Components and Static Site Generation

**Key Characteristics:**
- Modular page-based routing using App Router (Next.js 16.2.2)
- React 19 server-side rendering and client-side interactivity
- Single-page entry point with root layout wrapper
- CSS-first styling using Tailwind CSS v4 with PostCSS integration
- TypeScript for type safety across all source files
- Minimal initial complexity - single home page with foundational structure

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `app/`
- Contains: React components, page routes, layout definitions
- Depends on: React, Next.js framework utilities (Image, Metadata)
- Used by: Browser client, server-side renderer

**Layout Layer:**
- Purpose: Provide consistent HTML structure and typography across all pages
- Location: `app/layout.tsx`
- Contains: Root layout component with metadata, font configuration, base styling classes
- Depends on: Next.js Metadata API, Google fonts (Geist Sans, Geist Mono)
- Used by: All pages in the app directory

**Styling Layer:**
- Purpose: Define design tokens, CSS variables, and theme configuration
- Location: `app/globals.css`, `postcss.config.mjs`
- Contains: Tailwind CSS directives, CSS custom properties, dark mode support
- Depends on: Tailwind CSS v4, PostCSS
- Used by: All React components through className attributes

**Static Assets:**
- Purpose: Serve public resources (images, icons, SVGs)
- Location: `public/`
- Contains: SVG files (next.svg, vercel.svg, globe.svg, file.svg, window.svg), favicon.ico
- Depends on: File system, HTTP serving
- Used by: Page components through Next.js Image optimization and HTML references

## Data Flow

**Page Render Flow:**

1. Browser requests `/` (or any route)
2. Next.js App Router matches route to `app/page.tsx`
3. `app/layout.tsx` wraps the page component with root metadata and font definitions
4. React Server Component renders components to HTML
5. CSS classes resolve through Tailwind CSS and globals.css
6. HTML with inlined styles delivered to browser
7. Hydration occurs if client-side interactivity needed
8. Browser renders fully-styled page

**Styling Resolution:**

1. Tailwind CSS v4 processes `@import "tailwindcss"` directive in globals.css
2. CSS custom properties defined in `:root` (--background, --foreground)
3. @theme directive maps Tailwind variables to custom properties
4. Dark mode media query activates with `prefers-color-scheme: dark`
5. Component className attributes reference Tailwind utilities
6. PostCSS plugin system processes and optimizes CSS

**State Management:**

- No global state management library detected
- Page components are server-side rendered (no useState by default)
- Client-side interactivity limited to static template (Image component with priority optimization)
- Data flows from top-level layout → page → components

## Key Abstractions

**Root Layout Component:**
- Purpose: Wraps all pages with consistent HTML structure, metadata, and typography
- Examples: `app/layout.tsx`
- Pattern: Server component with Readonly children prop type annotation
- Exports: Metadata object for SEO, default RootLayout component

**Page Components:**
- Purpose: Represent individual routes and render page-specific content
- Examples: `app/page.tsx`
- Pattern: Default export function component with internal JSX structure
- Styling: Responsive Tailwind classes (sm: breakpoint, flex layouts)

**Image Optimization:**
- Purpose: Serve optimized image assets with automatic format/size selection
- Pattern: Next.js Image component from "next/image" with width, height, priority props
- Used for: Logo images, brand assets with proper alt text

**Font Loading:**
- Purpose: Load Google fonts with subset optimization
- Pattern: geist API from "next/font/google" with variable naming
- Used for: Sans-serif and monospace typography throughout the app

## Entry Points

**Server Entry Point:**
- Location: `app/layout.tsx`
- Triggers: Initial page load, navigation within app
- Responsibilities: Define root HTML structure, configure metadata, load fonts, apply global classes

**Client Entry Point:**
- Location: `app/page.tsx`
- Triggers: Route `/` requested
- Responsibilities: Render home page hero content, links to deployment and documentation

**Build Entry Point:**
- Location: `next.config.ts`
- Triggers: Build process (`npm run build`)
- Responsibilities: Configure Next.js build behavior (currently empty, using defaults)

## Error Handling

**Strategy:** Implicit error handling through Next.js defaults

**Patterns:**
- No custom error boundaries or error pages defined
- Relies on Next.js automatic error.tsx support (not present in codebase)
- Image component includes alt text for accessibility
- No form validation or input error handling in current pages

## Cross-Cutting Concerns

**Logging:** Not implemented - no logging framework detected

**Validation:** Not implemented - no form validation framework

**Authentication:** Not implemented - no auth library detected

**Dark Mode:** Implemented via CSS media query `prefers-color-scheme: dark` with CSS custom property overrides

**Responsive Design:** Implemented via Tailwind responsive prefixes (sm:, md:) for mobile-first design

**Type Safety:** Enabled globally via TypeScript with strict mode and React 19 type definitions

---

*Architecture analysis: 2026-04-06*
