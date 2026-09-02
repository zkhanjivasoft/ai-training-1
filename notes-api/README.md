# Notes API

A small personal project: a REST API to create, list, and search plain-text notes.

## Overview

Notes API is a single-user backend service for capturing quick plain-text notes.
There's no rich formatting, no attachments, and no collaboration — just a title,
a body, and the ability to find a note again later by searching its text. It's
intentionally minimal: a personal scratchpad accessible over HTTP, not a full
note-taking product.

## Tech stack

- Node.js (>= 20) with TypeScript (strict mode)
- Express 5 for the HTTP layer
- `tsx` for running TypeScript directly in development (no separate transpile step in dev)
- Plain `tsc` for the production build (emits to `dist/`)
- No database in v1 — notes are held in an in-memory store (see Data model)

## Architecture pattern

Layered, request-flow architecture, same shape regardless of feature count:

```
route -> service -> repository -> store
```

- **routes/** — HTTP layer only: parse the request, call the service, shape the response. No business rules.
- **services/** — owns validation and business rules (e.g. rejecting an empty title).
- **repositories/** — the only layer allowed to touch the in-memory store.
- **store** — a module-level array wrapped by the repository; swappable for a real database later without touching routes or services.

This mirrors a common Express pattern: keeping HTTP concerns, business rules, and
persistence in separate layers so any one of them can be replaced independently
(e.g. swapping the in-memory store for SQLite later touches only `repositories/`).

## Data model

```ts
interface Note {
  id: string; // e.g. "note_9f2c1a7b"
  title: string; // 1-120 chars
  body: string; // plain text, 1-10,000 chars
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

Notes are stored in memory for v1: they do **not** persist across a server
restart. Swapping in a real datastore (SQLite or a JSON file, matching the
project's own conventions) is expected as a follow-up, not part of this scaffold.

## Project structure

```
notes-api/
  src/
    index.ts               # boots the HTTP server (app.listen)
    app.ts                 # builds and returns the Express app (no listening)
    routes/
      notes.routes.ts      # GET /notes, GET /notes/:id, POST /notes, GET /notes?q=
    services/
      notes.service.ts     # validation + business rules
    repositories/
      notes.repository.ts  # in-memory CRUD over the notes array
    types.ts                # shared Note type
  package.json
  tsconfig.json
  .gitignore
  README.md
  CLAUDE.md
```

## Available scripts

Run from inside `notes-api/`:

- `npm install` — install dependencies
- `npm run dev` — run the API with `tsx watch` for live reload
- `npm run build` — compile TypeScript to `dist/` with `tsc`
- `npm start` — run the compiled server from `dist/index.js`
- `npm run typecheck` — type-check without emitting (`tsc --noEmit`)

## API surface (planned, not yet implemented)

| Method | Path         | Description                              |
| ------ | ------------ | ----------------------------------------- |
| GET    | `/notes`     | List all notes, optionally `?q=<text>` to search title/body |
| GET    | `/notes/:id` | Get a single note by id                   |
| POST   | `/notes`     | Create a note from `{ title, body }`      |

This scaffold does not implement these routes yet — see CLAUDE.md for the plan
to add them as a follow-up.
