# ROOF CALCULATOR — Project Conventions

## Stack
- Next.js 16+ (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- Supabase (PostgreSQL + Auth + Storage)
- Vercel (deployment)
- pnpm (package manager)

## Code Style
- Strict TypeScript (no `any`)
- Zod for all runtime validation
- Server Actions for mutations, client-side for reads where appropriate
- Components: PascalCase files, one component per file
- Utilities: camelCase files in lib/

## Architecture Decisions
- Calculator state managed via useReducer in useCalculator hook
- Roof SVGs are inline React components (no external images)
- All prices in RON (Romanian Lei), ex-VAT
- Waste percentage is user-adjustable (default 10%)
- Shareable offers via /offer/[id] route

## Database
- Supabase with RLS enabled on all tables
- UUIDs for all primary keys
- Timestamps in UTC

## Naming
- Romanian-facing strings: hardcoded Romanian (prepare for i18n)
- Code: English only
- Branch strategy: main (production), feature/* for development

## Testing Strategy (for later phases)
- Vitest for unit tests on calculation functions
- Playwright for E2E on the wizard flow
