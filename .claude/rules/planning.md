---
paths:
  - 'features/**'
---

```hypr-meta
domain: planning
base_commit: dc608e0d0ddde95c779e1bc7c4acb744a3747daf
generated_at: 2026-08-24
plugin_version: 1.1.0
next_id: 51
```

```rule
id: PL-001
severity: warn
scope: **/*
statement: Plan any new entity/resource feature as the 10-step vertical slice from docs/best-practices/adding-a-resource.md, in that dependency order (shared types → zod schema → repository → service → routes+mount → server tests → api module → hook → components → client tests); do not invent an alternative breakdown.
example: docs/best-practices/adding-a-resource.md:8
check:
```

```rule
id: PL-002
severity: error
scope: **/*
statement: Scope every implementation chunk to ONE layer of the route → service → repository → store flow; never plan a chunk that spans routes and repositories, and never plan business rules outside a services/ chunk or db/store.ts access outside a repositories/ chunk.
example: docs/architecture.md:22
check:
```

```rule
id: PL-003
severity: warn
scope: **/*
statement: Name the concrete tags-slice file each chunk copies the shape of (tags.schema.ts, tags.repository.ts, tags.service.ts, tags.routes.ts, useTags.ts, components/tags/*) instead of describing the code abstractly — the tags vertical slice is the reference implementation on both tiers.
example: docs/best-practices/adding-a-resource.md:4
check:
```

```rule
id: PL-004
severity: warn
scope: **/*
statement: Write the feature's acceptance criteria as a checkbox list following the feature_request template's three sections (What and why / Acceptance criteria / Notes), and use Notes to state the API shape, the affected layers, and the explicit out-of-scope items.
example: .github/ISSUE_TEMPLATE/feature_request.md:11
check:
```

```rule
id: PL-005
severity: error
scope: **/*
statement: Make the shared contract the first chunk: add or extend the entity, query, and meta types in shared/src/types.ts before any server or client work, since both tiers import them from @taskboard/shared as TS source — never plan a chunk that redeclares a domain type locally on either tier.
example: docs/best-practices/adding-a-resource.md:10
check:
```

```rule
id: PL-006
severity: warn
scope: **/*
statement: Sequence the complete server slice (schema → repository → service → routes → server tests) before the first client chunk, so client api/hook/component work is always built against live endpoints rather than a planned contract.
example: docs/best-practices/adding-a-resource.md:27
check:
```

```rule
id: PL-007
severity: error
scope: **/*
statement: For each planned endpoint, specify the `{ data, meta? }` payload type, whether it carries PageMeta, and which typed error codes it can return (VALIDATION_ERROR / NOT_FOUND / CONFLICT / RATE_LIMITED / UPSTREAM_ERROR); a plan may not introduce a bespoke response shape or a new ApiErrorCode without an accompanying ADR.
example: docs/adr/0001-shared-api-response-envelope.md:22
check:
```

```rule
id: PL-008
severity: error
scope: **/*
statement: Plan client data access as exactly two chunks per resource before any component chunk — `client/src/api/<resource>Api.ts` built on `request()` from api/http.ts, then `client/src/hooks/use<Resource>.ts` returning `{ <items>, loading, error, refetch, ...mutators }` whose mutators call the api module then refetch; never plan fetch or envelope handling inside a component.
example: client/src/hooks/useTags.ts:50
check:
```

```rule
id: PL-009
severity: warn
scope: **/*
statement: Plan request-body types as a pair: the `Create<X>Input` / `Update<X>Input` interfaces in the client api module and the matching `create<X>Schema` / `update<X>Schema` zod schemas in server/src/schemas/, and list both in the same chunk's acceptance criteria so they cannot drift.
example: client/src/api/tagsApi.ts:4
check:
```

```rule
id: PL-010
severity: error
scope: **/*
statement: There is no router library — plan a new page as three edits, not a route: a `<Resource>Page` component in `client/src/components/<resource>/`, a new key in the `TabKey` union and `TABS` array in components/layout/NavTabs.tsx, and a `tab === '<key>' && <ResourcePage />` line in App.tsx. Never plan URLs, paths, or react-router for client navigation.
example: client/src/components/layout/NavTabs.tsx:3
check:
```

```rule
id: PL-011
severity: warn
scope: **/*
statement: Plan the `<Resource>Page` chunk as composition only — `PageHeader` (title/subtitle/actions) + `<Resource>Grid` + an optional `<Resource>Form` inside `ui/Modal` — with all data and mutators destructured from the single resource hook; no data fetching, filtering, or business logic belongs in the page chunk.
example: client/src/components/tags/TagsPage.tsx:9
check:
```

```rule
id: PL-012
severity: error
scope: **/*
statement: Plan one Express router file per resource mounted at its own `/api/<resource>` prefix in server/src/routes/index.ts; sub-paths and actions (e.g. `/summary`, `/:id/complete`) are planned inside the owning resource's router, never as a new top-level mount.
example: server/src/routes/index.ts:12
check:
```

```rule
id: PL-013
severity: error
scope: **/*
statement: `ensureDb()` copies the seed only when `server/data/db.json` is absent, so a plan that adds a field or a collection leaves existing rows without it — any chunk that changes a stored shape must either declare the new field optional in `shared/src/types.ts` or list `npm run reset-db` as an explicit step in that same chunk.
example: server/src/db/store.ts:28
check:
```

```rule
id: PL-014
severity: error
scope: **/*
statement: When a feature introduces a new top-level collection, make "add the array to the `Db` interface in `server/src/db/store.ts`" an explicit step in the plan — repositories read and write only the keys declared there, so an unlisted collection cannot be persisted.
example: server/src/db/store.ts:6
check:
```

```rule
id: PL-015
severity: warn
scope: **/*
statement: Never plan a migration file or a data-backfill script — TaskBoard has no migration system and no schema versioning; a stored-shape change is an edit to `shared/src/types.ts` plus the `Db` interface, nothing more.
example: scripts/reset-db.mjs:12
check:
```

```rule
id: PL-016
severity: warn
scope: **/*
statement: Give every new entity its own persistence chunk for `server/src/repositories/<resource>.repository.ts` exposing `findAll`/`findById`/`insert`/`update`/`remove`.
example: docs/best-practices/adding-a-resource.md:15
check:
```

```rule
id: PL-017
severity: error
scope: **/*
statement: Plan all business rules for a resource into one `server/src/services/<resource>.service.ts` chunk — route and repository chunks in the plan carry no uniqueness, cascade, or reference logic.
example: server/src/services/tags.service.ts:8
check:
```

```rule
id: PL-018
severity: warn
scope: **/*
statement: The service chunk exports a single `<resource>Service` object literal named after the resource, matching `tagsService` in `server/src/services/tags.service.ts`.
example: server/src/services/tags.service.ts:8
check:
```

```rule
id: PL-019
severity: warn
scope: **/*
statement: Name the specific typed error from `server/src/lib/errors.ts` for each failure path in the service chunk's acceptance criteria — unknown foreign ids are `ValidationError`, missing entities `NotFoundError`, in-use or duplicate entities `ConflictError` — rather than describing failures as generic HTTP statuses.
example: server/src/services/todos.service.ts:30
check:
```

```rule
id: PL-020
severity: warn
scope: **/*
statement: For any feature that creates, changes, or deletes a todo, plan the matching `activityService.record(todo, <action>)` call inside the service method, plus the new verb added to the `ActivityAction` union in `shared/src/types.ts` if needed — services are the only layer that records activity, so an unplanned call means a silently incomplete activity feed.
example: server/src/services/todos.service.ts:87
check:
```

```rule
id: PL-021
severity: error
scope: **/*
statement: Plan a third-party integration as two files — `server/src/clients/<provider>Client.ts` for the raw call plus a wrapping service — and never plan a route, hook, or component that imports from `clients/` directly.
example: docs/nfr/0001-external-api-error-handling.md:47
check:
```

```rule
id: PL-022
severity: error
scope: **/*
statement: State the NFR-0001 failure mapping explicitly in the wrapping service's chunk — upstream 404 to `NotFoundError`, 429 to `RateLimitedError` with retry seconds, any 5xx or network failure to `UpstreamError` (502) — so the provider's own status text never reaches the client.
example: server/src/services/inspiration.service.ts:16
check:
```

```rule
id: PL-023
severity: error
scope: server/src/**/*
statement: A feature plan that adds server work must name `makeTestDb()` (beforeEach) + `cleanup()` (afterEach) and the fixture ids it will assert on (`list_a`, `tag_a`/`tag_unused`, `todo_a`/`todo_c`) as part of the chunk's test plan — never plan assertions against `server/data/seed.json` counts or contents.
example: server/src/routes/tags.routes.test.ts:11
check:
```

```rule
id: PL-024
severity: warn
scope: **/*
statement: For every endpoint a chunk adds or changes, the plan must enumerate the error-path cases alongside the happy path — 404 `NOT_FOUND`, 409 `CONFLICT`, 400 `VALIDATION_ERROR` with `details` — stated as envelope assertions on `res.body.error.code`, mirroring `tags.routes.test.ts`.
example: server/src/routes/tags.routes.test.ts:25
check:
```

```rule
id: PL-025
severity: warn
scope: **/*
statement: Plan tests inside the same chunk as the layer they cover (repository, then service happy + error paths, then routes via supertest) — the tags slice is built "tests as you go", so never schedule a single trailing "write the tests" chunk at the end of a feature.
example: docs/best-practices/adding-a-resource.md:24
check:
```

```rule
id: PL-026
severity: warn
scope: client/src/**/*
statement: A client chunk's test plan must commit to the four Grid states (loading spinner via `role="status"`, error via `role="alert"` + Retry, empty state, data) plus the resource hook tested with a `vi.mock`'d api module — the `useTags`/`TagGrid` pair is the required coverage shape for a new resource.
example: client/src/components/tags/TagGrid.test.tsx:21
check:
```

```rule
id: PL-027
severity: error
scope: **/*
statement: This app has no authentication, authorization, users, or roles — every endpoint is open by design — so the only input trust boundary a plan may rely on is a zod schema parsed with `parseWith` at the route; every new or changed request body and query string needs a schema in the plan, and plans must not invent auth middleware, guards, or session handling.
example: server/src/schemas/todos.schema.ts:5
check:
```

```rule
id: PL-028
severity: warn
scope: **/*
statement: Name each planned schema in `server/src/schemas/<resource>.schema.ts` from the fixed set `create<Entity>Schema` / `update<Entity>Schema` / `<entity>QuerySchema` so the plan's schema chunk and the route chunk cannot drift.
example: server/src/schemas/todos.schema.ts:5
check:
```

```rule
id: PL-029
severity: error
scope: **/*
statement: When a feature needs new baseline data, plan the data change as "mutate through the API or `server/data/db.json`, then `npm run reset-db`" and, if the seed itself must grow, as a separate PR flagged to the instructor — editing `server/data/seed.json` is blocked by a deny rule in `.claude/settings.json` and the `protect-seed.js` PreToolUse hook, so a plan step that edits it cannot execute. Every chunk's done-criterion includes `seed.json` having no diff.
example: .claude/hooks/protect-seed.js:23
check:
```

```rule
id: PL-030
severity: warn
scope: **/*
statement: Because the store reads the whole JSON file on every request and services filter in memory, any plan for a listable resource must specify `page`/`pageSize` (`z.coerce.number()` defaults 1/20, max 100) in its query schema and a `meta: { total, page, pageSize }` envelope — do not plan client-side slicing, indexes, caches, or performance budgets, none of which exist here.
example: server/src/services/todos.service.ts:57
check:
```

```rule
id: PL-031
severity: warn
scope: **/*
statement: Plan every new runtime setting as one entry in `server/src/config.ts` with an inline `process.env.<NAME> ?? <literal default>`; the plan must NOT introduce a `.env`, `.env.example`, Dockerfile, or compose file — this repo has none and `npm install && npm run reset-db && npm run dev` must stay a zero-config start.
example: server/src/config.ts:7
check:
```

```rule
id: PL-032
severity: warn
scope: **/*
statement: When a planned setting names a path or data location, plan it as a lazy getter on the `config` object (like `dataDir`/`logLevel`) rather than a value computed at import time, so tests can override it through `process.env` — `makeTestDb()` reassigns `DATA_DIR` after the module is loaded.
example: server/src/config.ts:9
check:
```

```rule
id: PL-033
severity: error
scope: **/*
statement: Never plan a feature that requires a credential, API key, or token: this repo needs no secrets, CI (`.github/workflows/ci.yml`) passes no env vars or secrets, and external dependencies are planned as in-process simulations (`server/src/clients/inspirationClient.ts`) so lint/typecheck/tests pass on a clean checkout with no configuration.
example: server/src/clients/inspirationClient.ts:12
check:
```

```rule
id: PL-034
severity: warn
scope: **/*
statement: Do not plan any client-side configuration (no Vite env var, no API base-URL setting): client API paths stay origin-relative and reach the server through the existing `/api` → `http://localhost:3001` proxy in `client/vite.config.ts`, so a new endpoint needs no config change at all.
example: client/vite.config.ts:11
check:
```

```rule
id: PL-035
severity: warn
scope: **/*
statement: A plan for an outbound third-party integration must include a client-side chunk rendering an inline error state with a retry action (copy `client/src/components/inspiration/InspirationWidget.tsx`) — upstream failure is planned-for routine behavior, never an unhandled state that blanks the page.
example: docs/nfr/0001-external-api-error-handling.md:39
check:
```

```rule
id: PL-036
severity: warn
scope: **/*
statement: When a feature plan makes an architectural choice — a new layer boundary, a change to the request flow route->service->repository->store, or a new/renamed `ApiErrorCode` or change to the shared response envelope — the plan must list an ADR as a deliverable: a new `docs/adr/NNNN-<slug>.md` written from `docs/adr/template.md` with its Status/Date/Deciders header and the Context / Decision / Consequences sections, naming the files the decision lives in. The PR checklist gates on it.
example: .github/pull_request_template.md:18
check:
```

```rule
id: PL-037
severity: warn
scope: **/*
statement: When a feature plan introduces a rule that applies regardless of feature (logging, external-API failure handling, database-access boundaries, performance budgets, security expectations), the plan must produce a `docs/nfr/NNNN-<slug>.md` in the form of NFR-0001 — "The rule" / "Why" / "How to comply" / "How compliance is checked" — never bury the cross-cutting rule inside the feature's own notes.
example: docs/nfr/0001-external-api-error-handling.md:42
check:
```

```rule
id: PL-038
severity: info
scope: **/*
statement: When a feature plan ends up defining a repeatable multi-file procedure other developers will follow again (the shape of "add X"), the plan must produce a recipe in `docs/best-practices/` written as an ordered, dependency-ordered checklist that names a file to copy the shape of at each step — copy the form of `docs/best-practices/adding-a-resource.md`.
example: docs/best-practices/adding-a-resource.md:8
check:
```

```rule
id: PL-039
severity: warn
scope: **/*
statement: Any plan that adds a doc under `docs/` must also add a row to the "Reference docs — read on demand" table in CLAUDE.md stating the trigger ("When you are…") and the doc to read; a doc with no trigger row is unreachable because only CLAUDE.md is always in context.
example: CLAUDE.md:44
check:
```

```rule
id: PL-040
severity: error
scope: **/*
statement: A plan that renames or removes a value in the shared `ApiErrorCode` union must treat it as a breaking client change: schedule the coordinated `client/src/api/http.ts` update in the same plan and require a new ADR superseding ADR-0001 — the code list is append-only in practice.
example: docs/adr/0001-shared-api-response-envelope.md:41
check:
```

```rule
id: PL-041
severity: error
scope: **/*
statement: Define "done" for every chunk as green CI, and CI is exactly `npm run lint`, `npm run typecheck`, `npm test` — plan those three commands as the final verification step of each chunk (run locally first, since the same three run on every PR and push to main and are the only merge gate).
example: .github/workflows/ci.yml:18
check:
```

```rule
id: PL-042
severity: warn
scope: **/*
statement: Plan delivery as one branch named `feat/<slug>` or `fix/<slug>` per feature with Conventional Commits messages; choose the `feat/` vs `fix/` prefix from the issue type in the plan rather than leaving branch naming to implementation time.
example: CLAUDE.md:63
check:
```

```rule
id: PL-043
severity: warn
scope: **/*
statement: Every plan must name the GitHub issue it closes and state that the PR body follows `.github/pull_request_template.md` — Summary, `Closes #N`, "How was this tested?", and the checklist (three commands green, tests added/updated, conventions followed, ADR added if an architectural decision was involved).
example: .github/pull_request_template.md:7
check:
```

```rule
id: PL-044
severity: warn
scope: **/*
statement: Do not add release-engineering steps to a plan — this repo has no hosted deployment, no environments, no version tags or release pipeline, and no feature-flag mechanism; the delivery step of every plan ends at "merged to main with green CI".
example: CLAUDE.md:62
check:
```

```rule
id: PL-045
severity: warn
scope: **/*
statement: For any chunk that mutates persisted data, state the recovery step as `npm run reset-db`, which restores `server/data/db.json` from the canonical seed — this is the only rollback mechanism in the repo, so plans must not invent backup or snapshot steps.
example: scripts/reset-db.mjs:12
check:
```

```rule
id: PL-046
severity: info
scope: **/*
statement: Treat `server/data/db.json` as generated and gitignored in plans: never plan to commit it, ship it as a fixture, or add a step that recreates it on error — a missing `db.json` is not a bug, it is one `npm run reset-db` away.
example: .gitignore:9
check:
```

```rule
id: PL-047
severity: warn
scope: **/*
statement: Scope the observability section of a plan to the built-in logger (`server/src/lib/logger.ts`) — this project has no APM, metrics, tracing, or error-reporting service, so plans must not add a monitoring dependency or a metrics/alerting step.
example: server/src/lib/logger.ts:22
check:
```

```rule
id: PL-048
severity: warn
scope: **/*
statement: For each state-changing service method a plan introduces, specify one log line of the form `logger.info('<file-basename>', '<verb> <entity>', { id })` — logging lives in the service layer only, and bare `console.*` in `server/src` fails lint.
example: server/src/services/tags.service.ts:26
check:
```

```rule
id: PL-049
severity: info
scope: **/*
statement: Do not plan per-route request logging or timing: `requestLogger` already logs method, URL, status, and `durationMs` for every request, so a plan adding a route inherits request-level observability with no work.
example: server/src/middleware/requestLogger.ts:7
check:
```

```rule
id: PL-050
severity: warn
scope: **/*
statement: Do not plan error logging inside new routes or services for expected failures: `errorHandler` already logs every thrown `AppError` (warn for 4xx, error for 5xx) plus unhandled errors, so the plan's error-visibility step is simply "throw the typed error from `server/src/lib/errors.ts`".
example: server/src/middleware/errorHandler.ts:14
check:
```
