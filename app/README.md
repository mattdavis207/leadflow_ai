# Leadflow AI

Leadflow AI is a full-stack lead intake and analysis dashboard. It imports customer lead data from CSV, saves the raw leads to PostgreSQL, and uses the OpenAI API to generate structured sales intelligence such as summary, urgency, category, sentiment, suggested reply, and next action.

## Demo

### Product Walkthrough Video

<video src="public/demo/Demo_Video_Leadflow_AI.mp4" controls width="100%">
  Your browser does not support the video tag.
</video>

[Watch the demo video](public/demo/Demo_Video_Leadflow_AI.mp4)

### Screenshots

Place screenshots in `public/screenshots/` and update the paths below.

#### CSV Import

![CSV import screen](public/screenshots/import.png)

#### Leads Dashboard

![Dashboard table](public/screenshots/dashboard.png)

#### Lead Detail Before Analysis

![Lead detail pending analysis](public/screenshots/lead-detail-pending.png)

#### Lead Detail With AI Analysis

![Lead detail analyzed](public/screenshots/lead-detail-analyzed.png)

## Core Features

- CSV upload and parsing for lead rows.
- Runtime validation with Zod before backend processing.
- PostgreSQL persistence for imported leads.
- Dashboard table with sorting, filtering, pagination, column visibility, and row actions.
- Bulk analysis for all pending leads.
- Single-lead analysis from the dashboard actions menu or lead detail page.
- OpenAI structured output for predictable AI-generated fields.
- Lead detail pages with raw lead data and AI analysis cards.
- Loading states and disabled buttons to prevent duplicate analysis clicks.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table
- PostgreSQL
- Docker Compose
- node-postgres (`pg`)
- OpenAI API
- Zod
- Papa Parse

## Application Flow

```text
CSV upload
  -> parse rows in browser
  -> POST /api/import
  -> validate request body with Zod
  -> save leads to PostgreSQL with Pending analysis status

Dashboard
  -> GET /api/leads
  -> render joined lead + analysis rows
  -> filter, sort, paginate, view details

AI analysis
  -> POST /api/analyze for bulk pending leads
  -> POST /api/analyze/[id] for one lead
  -> fetch pending lead data from PostgreSQL
  -> send chunks to OpenAI
  -> save structured analysis to leads_analysis
  -> update lead status to Complete
```

## Data Model

The app keeps raw lead data and AI-generated analysis separate.

```text
leads
  lead_id
  fname
  lname
  email
  company
  message
  source
  created_at
  analysis_status

leads_analysis
  analysis_id
  lead_id
  summary
  category
  urgency
  sentiment
  suggested_reply
  next_action
  raw_json
  created_at
```

Dashboard data is read with a left join so pending leads still appear even before analysis exists.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create an environment file:

```bash
cp .env.example .env
```

Set your OpenAI API key:

```env
OPENAI_API_KEY="your_api_key_here"
OPENAI_MODEL="gpt-5-mini"
```

Start PostgreSQL:

```bash
pnpm db:up
```

Reset and initialize the database schema/procedures:

```bash
pnpm db:reset
```

Start the app:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Useful Scripts

```bash
pnpm dev        # Start Next.js locally
pnpm build      # Build for production
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript checks
pnpm db:up      # Start local PostgreSQL
pnpm db:down    # Stop local PostgreSQL
pnpm db:logs    # Tail PostgreSQL logs
pnpm db:reset   # Drop/recreate schema and database routines
```

## API Routes

```text
POST /api/import
  Save parsed CSV rows to PostgreSQL.

GET /api/leads
  Return all leads with optional analysis fields.

GET /api/leads/[id]
  Return one lead with optional analysis fields.

POST /api/analyze
  Analyze all pending leads in chunks.

POST /api/analyze/[id]
  Analyze a single pending lead.
```

## Portfolio Notes

This project demonstrates:

- Full-stack TypeScript development with Next.js.
- Relational data modeling with PostgreSQL.
- Server-side API route design.
- CSV ingestion and validation.
- AI integration using structured model output.
- Dashboard UI with advanced table interactions.
- Practical async UI states for long-running AI actions.
