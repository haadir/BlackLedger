# Coding Conventions

**Analysis Date:** 2026-04-06

## Naming Patterns

**Files:**
- React components use PascalCase: `layout.tsx`, `page.tsx`
- Configuration files use kebab-case with extensions: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`
- Type definition files follow TypeScript convention: `next-env.d.ts`

**Functions:**
- React components use PascalCase: `Home()`, `RootLayout()`
- Configuration objects use camelCase: `geistSans`, `geistMono`, `eslintConfig`
- No arrow function convention enforced; examples show mixed usage

**Variables:**
- Constants use camelCase: `geistSans`, `geistMono`, `metadata`
- Destructured parameters in components: `{ children }`, `Readonly<{ children: React.ReactNode }>`

**Types:**
- Imported types use PascalCase: `Metadata`, `NextConfig`
- Type aliases declared with `type` keyword: `type Metadata`, `type NextConfig`
- React component prop types declared inline: `Readonly<{ children: React.ReactNode }>`

## Code Style

**Formatting:**
- Indent: 2 spaces (observed in `tsconfig.json`, config files, and source)
- Line length: No specific limit enforced; examples show lines up to 120+ characters
- Semicolons: Always present at end of statements
- Quotes: Double quotes for strings in JSX attributes and imports

**Linting:**
- ESLint: Version 9 with flat config format
- Config file: `eslint.config.mjs` (new flat config, not `.eslintrc`)
- Extends: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignored paths: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

## Import Organization

**Order:**
1. Third-party imports (Next.js, React, external packages): `import Image from "next/image"`, `import type { Metadata } from "next"`
2. Relative imports (project files): `import "./globals.css"`
3. Type imports appear inline: `import type { Metadata } from "next"`

**Path Aliases:**
- Base alias configured: `@/*` → `./` (points to project root)
- Allows importing from root: `@/components`, `@/app`, etc.
- Not yet used in existing code; all imports are absolute (`next/...`) or relative (`./...`)

## Error Handling

**Patterns:**
- No explicit error handling patterns found in current codebase
- Code is presentational (no API calls or async operations)
- No try-catch blocks, error boundaries, or error states observed

## Logging

**Framework:** Not used - no logging present in code

**Patterns:**
- No console logs, warn, or error statements in production code
- Codebase does not require logging at current stage

## Comments

**When to Comment:**
- No comments in source files
- Comments appear only in configuration files as explanatory notes

**JSDoc/TSDoc:**
- Not used in current codebase
- React components and functions have no documentation comments

## Function Design

**Size:** Functions are small and focused
- `Home()`: 62 lines (includes JSX)
- `RootLayout()`: 13 lines
- Configuration functions: 4-7 lines

**Parameters:**
- React components destructure props: `({ children })`, `({ children }: Readonly<{ children: React.ReactNode }>)`
- Functions use destructuring for cleaner code

**Return Values:**
- React components return JSX elements
- Configuration objects return typed objects: `NextConfig`, `Metadata`

## Module Design

**Exports:**
- Default exports for page components: `export default function Home()`, `export default function RootLayout()`
- Named exports for configuration metadata: `export const metadata: Metadata = {...}`
- Type exports use `export type` syntax

**Barrel Files:**
- Not used in current codebase
- No index.ts files re-exporting from directories
- Direct imports from source files

## TypeScript Configuration

**Compiler Options:**
- `strict: true` - Full type checking enabled
- `noEmit: true` - Type checking only, no JavaScript output (Next.js handles compilation)
- `jsx: "react-jsx"` - React 17+ JSX transform
- `moduleResolution: "bundler"` - Node.js style resolution with bundler enhancements
- `target: "ES2017"` - ECMAScript target level

**Include Patterns:**
- `**/*.ts`, `**/*.tsx`, `**/*.mts` - All TypeScript files included
- Next.js type definitions included: `.next/types/**/*.ts`, `.next/dev/types/**/*.ts`

## Tailwind CSS

**Styling Approach:**
- Utility-first CSS with Tailwind v4
- Classes applied directly to JSX elements: `className="flex flex-col flex-1 items-center justify-center bg-zinc-50"`
- Dark mode supported via `dark:` prefix: `dark:bg-black`, `dark:text-zinc-50`
- Responsive design with breakpoints: `sm:`, `md:` prefixes

**CSS Variables:**
- Custom theme variables defined in `globals.css`: `--background`, `--foreground`
- Font variables defined: `--font-geist-sans`, `--font-geist-mono`
- CSS theme defined with `@theme inline` for Tailwind integration

---

*Convention analysis: 2026-04-06*
