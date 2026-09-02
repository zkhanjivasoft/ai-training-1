# Planning Docs — Notes API

## Manual correction/addition made

While drafting `CLAUDE.md`, I caught and fixed a real inconsistency: I'd first
written the code style rule as "relative imports are extensionless," copying
the sibling TaskBoard server's convention without checking it against this
project's own `tsconfig.json`. But `notes-api`'s `tsconfig.json` uses
`moduleResolution: NodeNext` (needed so `npm start` can run the compiled
`dist/` output with plain `node`), and NodeNext requires explicit `.js`
extensions on relative imports — the opposite rule. I corrected the CLAUDE.md
rule to state the accurate requirement, fixed every relative import in
`src/` to match, and only then confirmed `npm run build` actually succeeded.
I also added a "Testing" section to CLAUDE.md that was missing from the first
draft (Vitest + supertest, mirroring the sibling TaskBoard server's pattern),
since a project meant for follow-up work needs a testing convention from day one.

---

## README.md

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

---

## CLAUDE.md

# Notes API

A small personal REST API for creating, listing, and searching plain-text notes.
See README.md for the full spec (data model, architecture, project structure).

## Tech stack summary

- Node.js >= 20, TypeScript (strict), Express 5
- `tsx` for dev (no build step needed to run locally), `tsc` for the production build
- In-memory store for v1 — no database yet

## Code style rules

- Use ES modules (`import`/`export`) everywhere — never `require`/`module.exports`. `package.json` sets `"type": "module"`.
- Async route handlers never wrap logic in try/catch: Express 5 auto-forwards a rejected async handler to error-handling middleware, so a route just does `res.json(await notesService.list(...))`.
- One file per layer per resource, named `<resource>.<layer>.ts` (`notes.routes.ts`, `notes.service.ts`, `notes.repository.ts`) — never combine two layers in one file.
- Relative imports use explicit `.js` extensions (`'./app.js'`, not `'./app'`) even though the source is `.ts` — `tsconfig.json` uses `moduleResolution: NodeNext`, and Node's own ESM loader requires the extension on the compiled output in `dist/`.

## Project conventions

- Routes only parse input and call a service; they must never import the repository directly.
- Only the repository layer touches the in-memory store — services and routes never reach into it.
- A service throws a plain `Error` with a clear message for an expected failure (e.g. "note not found"); routes translate that into an HTTP status in the error middleware, not inline in the route.
- IDs are generated as `note_<8 hex chars>` via `crypto.randomUUID()`, called from one place only (a small `lib/ids.ts` helper once one exists) — not scattered across services.
- No feature code goes into this scaffold yet — `routes/`, `services/`, and `repositories/` hold typed placeholders only, wired together enough to compile and boot, with the actual note CRUD logic added as a deliberate follow-up task.

## Testing (manual addition — see planning-docs.md)

- Vitest, co-located with the module under test (`notes.service.ts` -> `notes.service.test.ts`).
- Route tests drive the app in-process with `supertest` against a `createApp()` call, same as the sibling TaskBoard project at the repo root — never start a real listener in a test.

## Development commands

- `npm install` — install dependencies (run from inside `notes-api/`)
- `npm run dev` — start the dev server with live reload
- `npm run build` — type-check and emit to `dist/`
- `npm start` — run the compiled server
- `npm run typecheck` — type-check only, no emit
