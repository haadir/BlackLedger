# Codebase Structure

**Analysis Date:** 2026-04-06

## Directory Layout

```
/Users/haadirazzak/Desktop/blackledger/
├── app/                    # Next.js App Router - page routes and layouts
├── public/                 # Static assets served directly without processing
├── node_modules/           # Dependencies (not committed)
├── .next/                  # Build output and cache (generated)
├── .planning/              # GSD planning documents and analysis
├── .git/                   # Git repository metadata
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Locked dependency versions
├── tsconfig.json           # TypeScript compiler configuration
├── next.config.ts          # Next.js build configuration
├── eslint.config.mjs       # ESLint rules and configuration
├── postcss.config.mjs      # PostCSS plugin configuration
├── README.md               # Project documentation
├── AGENTS.md               # Agent instructions for Claude
├── CLAUDE.md               # Claude project instructions
├── .gitignore              # Git ignore rules
└── next-env.d.ts          # Next.js generated TypeScript definitions
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router directory containing all pages, layouts, and routes
- Contains: React Server Components, page exports, layout definitions, global styles
- Key files: `layout.tsx` (root layout), `page.tsx` (home page), `globals.css` (styles)

**`public/`:**
- Purpose: Static assets delivered as-is without processing through the build pipeline
- Contains: SVG images, icon files, favicon
- Key files: `next.svg`, `vercel.svg`, favicon.ico, and brand/UI SVGs

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Contains: All third-party packages listed in package.json
- Key packages: next, react, react-dom, tailwindcss, typescript, eslint

**`.next/`:**
- Purpose: Next.js build artifacts, cache, and generated files
- Contains: Compiled pages, static optimizations, dev server cache
- Generated: Yes (not committed to git)
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD analysis documents for codebase architecture and conventions
- Contains: ARCHITECTURE.md, STRUCTURE.md, and other analysis documents
- Generated: By GSD agents during analysis
- Committed: Yes

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout component - wraps all pages with HTML structure, metadata, fonts
- `app/page.tsx`: Home page component - renders `/` route
- `next.config.ts`: Next.js configuration - build and runtime settings

**Configuration:**
- `tsconfig.json`: TypeScript compiler options, path aliases, included files
- `eslint.config.mjs`: ESLint rules using flat config format with Next.js presets
- `postcss.config.mjs`: PostCSS plugins (Tailwind CSS integration)
- `package.json`: Dependencies, scripts (dev, build, start, lint), project metadata

**Styling:**
- `app/globals.css`: Global CSS with Tailwind directives, CSS custom properties, dark mode
- `postcss.config.mjs`: PostCSS configuration for CSS processing

**Types & Definitions:**
- `next-env.d.ts`: Auto-generated Next.js TypeScript definitions

**Assets:**
- `public/next.svg`: Next.js logo
- `public/vercel.svg`: Vercel logo
- `public/favicon.ico`: Page favicon
- `public/globe.svg`, `public/file.svg`, `public/window.svg`: UI/brand SVGs

## Naming Conventions

**Files:**
- `layout.tsx`: Root layout component following Next.js naming
- `page.tsx`: Route page component following Next.js naming
- `globals.css`: Global styles file - lowercase with .css extension
- `*.config.ts` or `*.config.mjs`: Configuration files with config in filename
- `*.d.ts`: TypeScript definition files (generated or ambient)

**Directories:**
- `app/`: Lowercase directory following Next.js convention
- `public/`: Lowercase directory for static assets
- `.next/`, `.git/`, `.planning/`: Lowercase with leading dot for tool output/metadata

**TypeScript/React:**
- Component files use `.tsx` extension (React + TypeScript)
- Non-component files use `.ts` extension
- Exported components use PascalCase (RootLayout, Home)
- CSS classes use lowercase with hyphens via Tailwind utilities

## Where to Add New Code

**New Feature/Page:**
- Primary code: `app/[feature-name]/page.tsx` (create new directory in app/)
- Layout (if needed): `app/[feature-name]/layout.tsx`
- Tests: Co-locate with `[feature-name].test.tsx` (testing framework not yet configured)
- Styles: Use Tailwind classes inline or create `app/[feature-name]/styles.css`

**New Component/Module:**
- Implementation: Create `app/components/[ComponentName].tsx` (new directory to add)
- Server Component: Default - no special marking needed
- Client Component: Add `'use client'` directive at top if interactivity required
- Types: Co-locate types in same file or create `app/components/[ComponentName].types.ts`

**Utilities/Helpers:**
- Shared helpers: Create `lib/` directory: `lib/[utility].ts`
- Export pattern: Use named exports for utilities, default export for config/wrappers
- Types: Keep in same file or co-locate in `lib/types/`

**Styling:**
- Global styles: Modify `app/globals.css`
- Component styles: Use Tailwind classes in className attributes
- CSS Modules (if needed): Create `[name].module.css` co-located with component
- Theme variables: Add to `:root` or media queries in globals.css

**Configuration:**
- Build settings: Modify `next.config.ts`
- Type checking: Modify `tsconfig.json` paths or compilerOptions
- Linting: Modify `eslint.config.mjs`
- PostCSS: Modify `postcss.config.mjs`

## Special Directories

**`.next/`:**
- Purpose: Next.js build cache and compiled output
- Generated: Yes (created by build process)
- Committed: No (in .gitignore)
- Contents: Compiled pages, static files, dev server cache, build logs

**`node_modules/`:**
- Purpose: Installed npm packages
- Generated: Yes (created by npm install)
- Committed: No (in .gitignore)
- Management: Use package-lock.json for version control, not node_modules

**`.planning/`:**
- Purpose: GSD analysis documents and planning artifacts
- Generated: Yes (by GSD agents)
- Committed: Yes (tracked in git)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, etc.

**`public/`:**
- Purpose: Static assets served directly by Next.js without processing
- Generated: No (manually added)
- Committed: Yes
- Access: Via `/filename` in HTML/JSX (Next.js automatically optimizes)

---

*Structure analysis: 2026-04-06*
