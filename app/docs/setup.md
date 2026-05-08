# Leadflow AI Setup

This project is a Next.js app with Tailwind CSS, local PostgreSQL, and packages ready for CSV parsing, OpenAI calls, validation, and database access.

## Local Environment

1. Copy `.env.example` to `.env`.
2. Add your `OPENAI_API_KEY`.
3. Start Postgres:

```bash
pnpm db:up
```

4. Start Next.js:

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

## Installed Stack

- Next.js App Router
- Tailwind CSS v4
- PostgreSQL via Docker Compose
- `openai` for OpenAI API calls
- `pg` for PostgreSQL connections
- `papaparse` for CSV parsing
- `zod` for request and response validation

## Suggested Implementation Boundaries

- CSV upload UI: `src/app/page.tsx` or a dedicated route later
- API routes: `src/app/api/.../route.ts`
- Database helpers: `src/lib/db`
- OpenAI helpers: `src/lib/openai`
- Validation schemas: `src/lib/validation`
- Shared lead types: `src/lib/types`

No lead-processing logic has been implemented yet.
