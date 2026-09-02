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
