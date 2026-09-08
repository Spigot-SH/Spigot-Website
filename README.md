# Spigot Website & UI

The frontend application and API marketplace for Spigot — Next.js 16 App Router, React 19, Tailwind CSS 4, and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Set up local environment
cp .env.example .env.local

# Run development server (runs on http://localhost:5173)
npm run dev
```

## Connecting to the Backend

The frontend communicates with the Spigot Express backend by proxying `/api` and `/x402` requests through Next.js rewrites defined in `next.config.ts`.

By default, it proxies to `http://127.0.0.1:4402`. To point to a different backend (e.g. staging or production), set `BACKEND_ORIGIN` in `.env.local`:

```env
BACKEND_ORIGIN=http://127.0.0.1:4402
```

## Available Scripts

- `npm run dev`: Start development server on port 5173
- `npm run build`: Build production Next.js application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint checks
- `npm run typecheck`: Run TypeScript compiler type checking
- `npm run designsystem:llm`: Regenerate design system Markdown mirror
- `npm run verify`: Format check, lint, typecheck, and build

## Design System

Design tokens and primitives are documented in:

- `ui.md`: Component tokens, patterns, and guidelines
- `taste.md`: Design intent and visual rationale
- `geist-notes.md`: Conventions adopted from Geist
- `designsystem-plan.md`: Component inventory and status
- `designsystem-gap.md`: Design system boundaries and non-goals
