# Feature 002: Hide Finished Work (Completed Todos) From the Default View

## Status: In Progress
<!-- Update this as work progresses: Not Started | In Progress | In Review | Completed | Blocked -->

## Investigation Summary (read before implementing)

This request is **not yet implemented**, but the codebase already has most of the machinery it needs:

- `Todo.status` (`shared/src/types.ts`) is already `'open' | 'done'`, set via the existing
  `POST /api/todos/:id/complete` / `POST /api/todos/:id/reopen` actions
  (`server/src/services/todos.service.ts`).
- `todosService.list()` already accepts and applies a `status` filter
  (`server/src/services/todos.service.ts`, `if (query.status) todos = todos.filter(...)`), backed
  by `todoQuerySchema.status` (`server/src/schemas/todos.schema.ts`) and surfaced in the client via
  `TodoFilterBar`'s status `<select>` (`client/src/components/todos/TodoFilterBar.tsx`) and
  `TodoFiltersContext` (`client/src/context/TodoFiltersContext.tsx`).
- What is **missing**: nothing hides completed todos by default. `TodoFiltersContext`'s
  `DEFAULT_FILTERS` is `{ page: 1 }` — no `status` — so a fresh page load and "Clear" both show
  open **and** done todos mixed together. There is no `archived`/`hidden` field anywhere in
  `shared/src/types.ts`, `server/data/seed.json`'s todo shape, or any repository/service. There is
  no "Show completed" toggle. Grepping `client/src`, `server/src`, and `shared/src` for
  `hide|archiv` returns nothing.
- No client tests exist yet for `TodoFilterBar`, `TodoFiltersContext`, or `TodosPage` (only the
  tags slice — `TagForm.test.tsx`, `TagGrid.test.tsx`, `useTags.test.ts` — has client tests today).
  Server-side, `todos.service.test.ts` and `todos.routes.test.ts` explicitly note that filtering is
  untested (`// NOTE: ... Filtering, search, and pagination in todosService.list() do not have
  tests yet.`).

## Chosen Interpretation

**"Hide" = the default todo list view excludes `status: 'done'` todos automatically; the existing
status filter becomes the "unhide" mechanism (pick "Done" or "All statuses" to see finished work
again).** No new field, no `archived`/`hidden` boolean, no schema/migration/ADR.

Why this over an explicit `archived` flag distinct from `done`:
- The backend already fully encodes "is this todo finished" via `status`. A second `archived`
  boolean would create two competing "is this visible" concepts (`status === 'done'` vs
  `archived === true`) with unclear rules for what happens on reopen, in `stats.service.ts`, and
  in the activity feed — complexity with no behavioral gain over reusing `status`.
- Per PL-013/PL-015, a stored-shape change is a last resort, not a first move, and every existing
  `db.json` row would be missing the new field until `npm run reset-db` — avoidable here.
- Per PL-036, an `archived` flag would still not be an architectural fork (no new layer, no new
  `ApiErrorCode`, no envelope change) — but reusing `status` avoids even raising the question.
- Nothing in the request implies "finished but still open"-style states, or hiding for reasons
  other than completion — "hide finished work" maps directly onto the status the app already has.

Net effect: this feature is **entirely client-side**. No shared-type, schema, repository, service,
or route chunk is needed — routes/services/repository are already correct and untouched.

## Requirements

- [ ] On first load, and after "Clear", the todo list shows only `open` todos by default —
      completed (`done`) todos are hidden.
- [ ] The user can still see completed todos on demand: selecting "Done" in the existing status
      filter shows only finished todos; selecting "All statuses" shows both.
- [ ] Hiding a completed todo is purely a view concern — the todo record, its `completedAt`, and
      its activity log entries (`activity.service.ts`'s `created`/`completed`/`updated` entries)
      are completely unaffected. No data is deleted or mutated by this feature.
- [ ] Existing behavior for explicitly filtering by status (`?status=open` / `?status=done`) is
      unchanged — this feature only changes the *default* value of that filter and its
      discoverability.
- [ ] `npm run lint`, `npm run typecheck`, and `npm test` stay green; `server/data/seed.json` has
      no diff.

## Architecture Design

- No changes to `shared/src/types.ts`, `server/src/schemas/todos.schema.ts`,
  `server/src/repositories/todos.repository.ts`, `server/src/services/todos.service.ts`,
  `server/src/routes/todos.routes.ts`, or `server/data/seed.json` — all already support
  `status`-based filtering end to end.
- Client changes only:
  - `client/src/context/TodoFiltersContext.tsx` — change `DEFAULT_FILTERS` from `{ page: 1 }` to
    `{ page: 1, status: 'open' }`, so both the initial state and `resetFilters()` hide completed
    todos by default.
  - `client/src/components/todos/TodoFilterBar.tsx` — relabel the status `<select>`'s blank option
    from `All statuses` to make the hide/show relationship explicit (e.g. `All (incl. completed)`),
    since it is now the mechanism for revealing hidden work, not just a generic filter.
  - `client/src/components/todos/TodosPage.tsx` — update the header `subtitle` copy to mention
    that completed todos are hidden by default (e.g. "Everything on the board, filterable by list,
    tag, and status — completed todos are hidden by default").
- No new endpoint, no new query param, no `PageMeta`/envelope change — `TodoQuery.status` already
  exists in `shared/src/types.ts` and is unchanged.

## Implementation Chunks

### Chunk 1: Default the todo filters to hide completed todos
**Status:** Completed
**Review Status:** Changes Requested
**Type:** Frontend
**Dependencies:** None
**Files to create/modify:**
- `client/src/context/TodoFiltersContext.tsx`
**Tests required:** Yes — new `client/src/context/TodoFiltersContext.test.tsx`, co-located per
testing rules. Render a small harness component that calls `useTodoFilters()` inside
`TodoFiltersProvider` and assert:
  - initial `filters.status` is `'open'`
  - after `setFilter('status', undefined)` then `resetFilters()`, `filters.status` is back to
    `'open'` (not `undefined`)
  - `setFilter` for a non-status key still resets `page` to 1 (existing behavior, regression
    check)
**Acceptance criteria:**
- [x] `DEFAULT_FILTERS` is `{ page: 1, status: 'open' }`
- [x] `resetFilters()` returns to the new default (hides completed again)
- [x] `npm test -w client`, `npm run lint`, `npm run typecheck` green

### Chunk 2: Make the status filter read as the "show completed" control
**Status:** Not Started
**Review Status:** Not Reviewed
**Type:** Frontend
**Dependencies:** Chunk 1 must be completed (so the default the UI reflects is already `'open'`)
**Files to create/modify:**
- `client/src/components/todos/TodoFilterBar.tsx`
**Tests required:** Yes — new `client/src/components/todos/TodoFilterBar.test.tsx`, Testing
Library role/label queries per `.claude/rules/testing.md` and the pattern in
`client/src/components/tags/TagForm.test.tsx`. Render `TodoFilterBar` inside
`TodoFiltersProvider`, and assert:
  - the status `combobox` shows "Open" selected by default (reflects Chunk 1's default)
  - selecting the relabeled "All (incl. completed)" option calls through to
    `setFilter('status', undefined)` (assert via a wrapper that reads context state, or by
    checking the rendered `<select>` value updates)
  - selecting "Done" still works unchanged (existing behavior regression check)
**Acceptance criteria:**
- [ ] Blank status option's label communicates it reveals completed todos
- [ ] No change to the option `value`s (`''`, `'open'`, `'done'`) — only display label changes, so
      the query contract with `todoQuerySchema` is untouched
- [ ] `npm test -w client`, `npm run lint`, `npm run typecheck` green

### Chunk 3: Update TodosPage copy to state the default behavior
**Status:** Not Started
**Review Status:** Not Reviewed
**Type:** Frontend
**Dependencies:** Chunk 1 must be completed
**Files to create/modify:**
- `client/src/components/todos/TodosPage.tsx`
**Tests required:** No — copy-only change to a `PageHeader` prop string; covered incidentally by
any future `TodosPage` test, not worth a dedicated assertion per PL-011 (page chunk is composition
only).
**Acceptance criteria:**
- [ ] `subtitle` text mentions completed todos are hidden by default
- [ ] `npm run lint`, `npm run typecheck` green (no test suite to run for this chunk alone, but
      run `npm test -w client` to confirm nothing else broke)

## Testing Strategy

- Unit/component tests only — written alongside each chunk (PL-025: no trailing "write the tests"
  chunk), using Vitest + Testing Library, mocking nothing beyond what `TodoFilterBar` already needs
  (it takes `lists`/`tags`/`meta` as props and reads/writes filters via context — no `api` module
  to `vi.mock` for these two chunks since no network call is involved).
- No server tests needed — no server code changes. If a future chunk ever changes
  `todosService.list()`'s default status handling on the backend, it would need to extend
  `server/src/services/todos.service.test.ts` and `server/src/routes/todos.routes.test.ts` using
  `makeTestDb()`/`cleanup()` per PL-023 and the `todo_a`/`todo_c` fixture ids — but that is
  explicitly out of scope here since the default is applied client-side only (mirrors: two users
  hitting `GET /api/todos` directly, e.g. via curl or a future integration, still see all todos
  unless they pass `?status=`, which is correct — "hide" is a UI convenience, not an API contract
  change).
- Manual smoke check after all three chunks: `npm run dev`, load Todos tab, confirm completed
  fixture todos are hidden, confirm selecting "Done" or "All (incl. completed)" reveals them again,
  confirm "Clear" re-hides them.

## Database Changes

- None. No migration, no new collection, no field addition. `server/data/seed.json` needs no diff
  and must not be modified (enforced by the deny rule / `protect-seed.js` hook).

## API Changes

- None. `GET /api/todos` keeps its existing `status` query param, response envelope
  (`{ data: Todo[], meta: PageMeta }`), and error codes. No new endpoint, no modified endpoint
  behavior — only what the client sends by default changes.

## Integration Points

- `client/src/components/activity/ActivityFeed.tsx` (rendered alongside the grid in
  `TodosPage.tsx`) is unaffected — it is keyed off `todos` for refresh timing only and does not
  filter by status itself; verify visually during the manual smoke check that it still lists
  activity for hidden (completed) todos, since the activity log must stay intact per requirements.
- `server/src/services/stats.service.ts` is unaffected — it reads `todosRepository.findAll()`
  directly, not through the client's filtered view, so "hidden" completed todos still count
  correctly in `StatsSummary.done` / `completedThisWeek`.

## Rollback Plan

- This repo has no hosted deployment and no migration system (PL-044/PL-045/PL-046). Rollback is:
  revert the merge commit / PR for this feature on `main` (three small client-only files), or
  `git revert` the chunk commits.
- No data rollback is needed since no stored shape changed and `server/data/seed.json` has no
  diff. If local `db.json` was ever manually edited while testing this feature, `npm run reset-db`
  restores it from the seed as usual — not specific to this feature.
- No feature flag exists or is planned (PL-044) — reverting the commit is the only rollback lever.

## Documentation Updates

- None required. No new `docs/adr/` entry (not an architectural fork — no layer, envelope, or
  error-code change; PL-036 does not apply). No new `docs/nfr/` entry (no new cross-cutting rule).
  No new `docs/best-practices/` recipe (this is a small, one-off UI default change, not a
  repeatable "add X" procedure per PL-038).

## Success Criteria

- Loading the Todos page shows only open todos by default; no todo is deleted or otherwise
  mutated to achieve this.
- A user can reveal completed todos via the existing status filter with no learning curve beyond
  the relabeled option text.
- `npm run lint`, `npm run typecheck`, and `npm test` are green across all three chunks.
- `server/data/seed.json` has no diff.

## Progress Log
<!-- Executor and Reviewer agents should append updates here -->
| Date | Chunk | Action | Status | Notes |
|------|-------|--------|--------|-------|
| 2026-08-25 | 1 | Implemented | Completed | Changed `DEFAULT_FILTERS` to `{ page: 1, status: 'open' }` in `TodoFiltersContext.tsx`; added `TodoFiltersContext.test.tsx` covering default status, reset-after-clear, and the page-reset regression. `npm test -w client`, `npm run lint`, `npm run typecheck` all green (pre-existing unrelated lint errors in `docs/labs/snippets/hook-skeleton.js` confirmed present on `main` before this change). |
| 2026-08-25 | 1 | Reviewed | Changes Requested | Test-coverage gap: resetFilters() harness never asserts `priority` is cleared, so a partial-reset regression would go undetected. Non-blocking (warn), fix before Chunk 2/3 review. |
