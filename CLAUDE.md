# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

flex_project is a sample ATS (Applicant Tracking System) for full-cycle candidate tracking, including retention and cost metrics.

## Architecture

npm workspaces monorepo with two independent apps that communicate over HTTP:

- `server/` — Express + TypeScript API. Entry point `src/index.ts` boots the app defined in `src/app.ts`; routes live in `src/routes/`. Data access goes through Prisma (`prisma/schema.prisma`, client instantiated in `src/lib/prisma.ts`) against PostgreSQL.
- `web/` — Next.js (App Router, TypeScript) frontend. Pages live in `src/app/`. `src/lib/api.ts` is the fetch wrapper for calling the server API, configured via `NEXT_PUBLIC_API_URL`.

The two apps are deployed and run separately — `web` never imports from `server` or talks to Postgres directly, it only calls the API over HTTP.

## Commands

Run from the repo root unless noted.

```
npm install                # installs deps for both workspaces
npm run dev:server         # start server in watch mode (tsx), reads server/.env
npm run dev:web            # start Next.js dev server, reads web/.env
npm run build:server       # tsc build of server -> server/dist
npm run build:web          # next build
```

Database (run from `server/`, requires `DATABASE_URL` in `server/.env`):

```
npm run prisma:generate --workspace server   # regenerate Prisma client after schema changes
npm run prisma:migrate --workspace server    # create/apply a dev migration
```

Env setup: copy `server/.env.example` to `server/.env` and `web/.env.example` to `web/.env` before running dev servers.

No test runner or lint config is set up yet — add one before writing tests and update this section with the actual commands (including how to run a single test).
