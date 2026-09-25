---
name: onboard
description: Walks a new developer through orienting in this repo — the TaskBoard monorepo (client/server/shared) plus the sibling notes-api project. Use when a new team member is joining this project, when asked to "onboard" someone or "walk me through the codebase", or when a fresh Claude Code session needs a guided first tour instead of open-ended exploration.
---

# Onboarding this repo

Work through these steps in order. Don't skip the checkpoint — confirm understanding
before moving on, since later steps assume it.

## Step 1 — First-time setup and a green baseline

Run, from the repo root:
```
npm install
npm run reset-db
npm test
npm run lint
npm run typecheck
```
`npm run reset-db` restores `server/data/db.json` from the guarded `server/data/seed.json`
— this is the only way `db.json` should ever be touched (never edit it directly, and
never touch `seed.json` at all — it's protected by a deny rule and a PreToolUse hook).
Confirm `npm test`/`lint`/`typecheck` are green *before* you make any change — that's your
baseline for "did I break something."

## Step 2 — Boot it and read the tags vertical slice

Run `npm run dev` (client on :5173, server on :3001, Vite proxies `/api` to the server).
Then read, in order, the **tags** resource end to end — it's the reference
implementation every other resource copies:
- `server/src/schemas/tags.schema.ts` → `repositories/tags.repository.ts` →
  `services/tags.service.ts` → `routes/tags.routes.ts` (the route → service → repository →
  store request flow)
- `client/src/components/tags/{TagsPage,TagGrid,TagCard,TagForm}.tsx` (the
  Page → Grid → Card → Form UI pattern)

## Step 3 — Know the sibling project

`notes-api/` is a separate, self-contained project living inside this same repo — it has
its own `package.json`, its own `CLAUDE.md`, and its own conventions (e.g. it requires
explicit `.js` extensions on relative imports, unlike `server/`'s extensionless imports —
these are two different, both-correct conventions that don't mix). It is **not** part of
the root npm workspaces; run its scripts from inside `notes-api/` directly.

## Checkpoint

Before we go further: **if you needed to add validation for a new field on a todo, which
layer would own that logic — routes, services, or repositories — and why?**

Wait for the developer's answer. The correct shape of the answer is: routes only parse
input with zod and respond; **services** own all business rules and validation
(including cross-entity reference checks like "does this listId exist"); repositories only
persist and never throw. If their answer puts validation in routes or repositories,
point them at `server/src/services/tags.service.ts` and `CLAUDE.md`'s architecture
section before continuing — don't move on until this lands, since nearly every other
convention in this repo assumes it.

## Step 4 — Where to look next

- A cross-cutting rule or an architectural decision: `docs/nfr/` and `docs/adr/`.
- A recipe for adding a whole new resource: `docs/best-practices/adding-a-resource.md`.
- This repo's guardrails and the reasoning behind each one: the "Guardrails" section of
  the root `CLAUDE.md`.
