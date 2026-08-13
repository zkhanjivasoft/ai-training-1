# ADR-0002: Repository only store access

- **Status:** Accepted
- **Date:** 2026-08-13
- **Deciders:** TaskBoard maintainers

## Context

`db.json` is read and written wholesale through `readDb`/`writeDb` in
`server/src/db/store.ts` — plain file I/O with no schema or access control of
its own. That makes it easy for a route or service to import `store.ts`
directly as a shortcut, bypassing the repository layer. Written preventively,
before any such bypass happened, to keep the route → service → repository →
store flow intact as more resources are added.

## Decision

Only `server/src/repositories/` may import `server/src/db/store.ts` (plus the
one-time `ensureDb()` call at boot in `index.ts`). Routes and services never
call `readDb`/`writeDb` directly — they go through a repository function.

## Consequences

- Persistence can change (e.g. swap the JSON file for something else) by
  touching only `repositories/`.
- Every resource needs a repository, even for simple persistence — some of
  these are thin wrappers around `readDb`/`writeDb`.
- No automated enforcement yet; this relies on code review and this doc. A
  follow-up would be an eslint `no-restricted-imports` rule for `server/src`.
