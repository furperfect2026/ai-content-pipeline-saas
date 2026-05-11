# Aura Pipeline AI

Premium AI social media content pipeline SaaS built as a standalone React, TypeScript, Vite, Tailwind, Node API, Supabase-ready, Gemini-integrated project.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Features

- Email/password signup, login, logout, session persistence, protected dashboard routes.
- Supabase Auth support when env vars are configured, with a secure local JWT backend fallback for development.
- Brand workspaces with tone, audience, colors, description, links, and logo placeholder.
- Server-side Gemini text generation with reusable prompt templates and mock mode when `GEMINI_API_KEY` is missing.
- AI poster/image generation endpoint with Gemini image support and SVG mock fallback.
- Content library with search, filters, copy, status updates, regenerate-ready workflow, and delete.
- Visual scheduler with calendar/list views and draggable-style cards.
- Analytics dashboard with charts, collaboration mock UI, and JSON/Markdown/PDF-text export buttons.
- Supabase migration for profiles, workspaces, generated content, generated images, scheduled posts, prompt templates, and team members.

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4, shadcn-style local UI primitives
- Framer Motion, lucide-react, Recharts, Sonner
- Node.js, Express, Zod, JWT, bcrypt
- Supabase Auth/schema support
- Google Gemini REST API called only from the backend

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.
API runs on `http://localhost:4000`.

## Environment

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
DATABASE_URL=
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
VITE_API_URL=http://localhost:4000
```

If Supabase values are missing, the app uses the local JWT backend and stores development data in `server/data/db.json`.
If `GEMINI_API_KEY` is missing, AI endpoints return high-quality mock responses so the whole product can be demonstrated end to end.

## Supabase

Run the migration in:

```text
supabase/migrations/20260511223000_aura_pipeline_schema.sql
```

The migration enables RLS and creates the required product tables.

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/workspaces`
- `POST /api/workspaces`
- `PUT /api/workspaces/:id`
- `DELETE /api/workspaces/:id`
- `POST /api/ai/generate-text`
- `POST /api/ai/generate-image`
- `GET /api/content`
- `POST /api/content`
- `PUT /api/content/:id`
- `DELETE /api/content/:id`
- `POST /api/schedule`
- `GET /api/schedule`
- `PUT /api/schedule/:id`
- `DELETE /api/schedule/:id`
- `POST /api/export/pdf`
- `POST /api/export/markdown`
- `POST /api/export/json`

## Verification

```bash
npm run lint
npm run build
```

## Free Deployment

The app can deploy as one free Render web service. Express serves both `/api/*` and the built React app from `dist`.

1. Push this repo to GitHub.
2. Go to [Render](https://render.com), choose **New > Blueprint**, and connect this repository.
3. Render will read `render.yaml`.
4. Keep the free plan selected.
5. Add optional secrets:
   - `GEMINI_API_KEY` for real Gemini generation.
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for Supabase Auth/database.
6. Deploy.

Without Gemini and Supabase keys, the deployed app still works in mock AI mode with local JWT auth. For persistent production data, configure Supabase.

## Git

This folder is standalone and ready to initialize as its own repository:

```bash
git init
git add .
git commit -m "Initial Aura Pipeline AI SaaS"
```
