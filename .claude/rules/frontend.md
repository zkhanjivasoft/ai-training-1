---
paths:
  - 'client/**'
  - 'shared/src/**/*.ts'
  - 'eslint.config.js'
---

```hypr-meta
domain: frontend
base_commit: dc608e0d0ddde95c779e1bc7c4acb744a3747daf
generated_at: 2026-08-24
plugin_version: 1.1.0
next_id: 68
```

```rule
id: FE-001
severity: warn
scope: client/src/components/*/*.tsx
statement: Inside a feature folder, name components by their Page -> Grid -> Card (+ Form) role: `<Resource>sPage` (plural) for the page, and `<Resource>Grid` / `<Resource>Card` / `<Resource>Form` (singular entity name) for the collection, item, and create form — as in `TagsPage`/`TagGrid`/`TagCard`/`TagForm`. Do not invent alternative role words (List, Item, Editor, Panel).
example: client/src/components/tags/TagGrid.tsx:16
check:
```

```rule
id: FE-002
severity: info
scope: client/src/**/*.tsx
statement: Declare every component as a hoisted `export function Name(props) { ... }` returning JSX — never an arrow-function const and never `React.FC`.
example: client/src/components/ui/Button.tsx:11
check:
```

```rule
id: FE-003
severity: warn
scope: client/src/components/*/*Page.tsx
statement: In the `<Resource>sPage` + Grid/Card/Form vertical slice (tags, todos, lists), the Page is the component that calls the resource hook and passes `{items}`, `loading`, `error`, `onRetry={refetch}` and mutator callbacks down; Grid/Card/Form stay presentational and never call a data hook or an api module themselves. Self-contained sidebar widgets are the deliberate exception.
example: client/src/components/tags/TagsPage.tsx:10
check:
```

```rule
id: FE-004
severity: warn
scope: client/src/components/**/*.tsx
statement: Export exactly one component per file, named after the file. A helper component used only by that file stays in the same file but unexported — as `TodosPageContent` does inside `TodosPage.tsx` so the exported `TodosPage` can wrap it in `TodoFiltersProvider`.
example: client/src/components/todos/TodosPage.tsx:24
check:
```

```rule
id: FE-005
severity: warn
scope: client/src/components/*/*.tsx
statement: Put a resource's components in one flat feature folder `client/src/components/<resource-plural>/` (tags, todos, lists, stats, activity, inspiration) — every `.tsx` and `.module.css` for the feature sits directly in that folder, with no nested subfolders.
example: client/src/components/tags/TagCard.tsx:1
check:
```

```rule
id: FE-006
severity: warn
scope: client/src/**/*.module.css
statement: Co-locate each component's CSS Module beside its `.tsx` and name it `<ComponentName>.module.css` (`TagCard.tsx` -> `TagCard.module.css`). Never create a shared/aggregate stylesheet for a feature folder; a component that needs no styles simply has no module file (e.g. `TagsPage.tsx`, `ListsPage.tsx`). There is no CSS framework and no global stylesheet other than `client/src/index.css`.
example: client/src/components/tags/TagCard.module.css:1
check:
```

```rule
id: FE-007
severity: warn
scope: client/src/components/**/*.tsx
statement: Reuse the shared primitives in `client/src/components/ui/` (`Button`, `Modal`, `Badge`, `EmptyState`, `Spinner`) and the app-chrome components in `client/src/components/layout/` (`PageHeader`, `NavTabs`) instead of re-implementing them inside a feature folder; a new generic primitive belongs in `ui/`, not in the feature that first needs it.
example: client/src/components/tags/TagGrid.tsx:2
check:
```

```rule
id: FE-008
severity: info
scope: client/src/**/*.tsx
statement: Do not add barrel files (`index.ts`/`index.tsx`) under `client/src`; import each component from its full relative path (`./components/tags/TagsPage`). The only barrel in the repo is `shared/src/index.ts`.
example: client/src/App.tsx:5
check:
```

```rule
id: FE-009
severity: warn
scope: client/src/**/*.tsx
statement: Use named exports exclusively in `client/src` — components, hooks, api modules and types are all `export function` / `export const` / `export interface`; there is no `export default` anywhere, including `App.tsx` (`main.tsx` imports `{ App }`).
example: client/src/App.tsx:9
check:
```

```rule
id: FE-010
severity: info
scope: client/src/**/*.tsx
statement: Import the CSS Module last, after every other import, as `import styles from './<ComponentName>.module.css'` — always bound to the name `styles`.
example: client/src/components/tags/TagGrid.tsx:6
check:
```

```rule
id: FE-011
severity: info
scope: client/src/components/**/*.tsx
statement: Order imports in fixed groups with no blank lines between them: `react` -> `type` imports from `@taskboard/shared` -> `../../hooks` / `../../context` / `../../api` -> `../ui/*` -> `../layout/*` -> other feature folders -> same-folder siblings (`./X`) -> the `.module.css`.
example: client/src/components/todos/TodosPage.tsx:1
check:
```

```rule
id: FE-012
severity: info
scope: client/src/**/*.ts
statement: When one module supplies both values and types, use a single import with inline `type` modifiers (`import { tagsApi, type CreateTagInput, type UpdateTagInput } from '../api/tagsApi'`) rather than a second `import type` statement for the same path.
example: client/src/hooks/useTags.ts:3
check:
```

```rule
id: FE-013
severity: info
scope: client/src/components/**/*.tsx
statement: Export a type that belongs to a single component from that component's own file rather than a shared types module — `NavTabs.tsx` exports `TabKey` and consumers import it alongside the component (`import { NavTabs, type TabKey } from './components/layout/NavTabs'`). There is no `client/src/types.ts`.
example: client/src/components/layout/NavTabs.tsx:3
check:
```

```rule
id: FE-014
severity: warn
scope: client/src/**/*.module.css
statement: Never write a color literal (hex, `rgb()`, `rgba()`, or a CSS color keyword) in a CSS Module — reference the design tokens declared in the `:root` block of `client/src/index.css` (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-primary-hover`, `--color-danger`, `--color-success`, `--color-warning`, `--tone-{low,medium,high,neutral}` and their `-text` pairs) via `var(...)`; a color the tokens do not cover is added to that `:root` block first.
example: client/src/components/tags/TagCard.module.css:2
check:
```

```rule
id: FE-015
severity: info
scope: client/src/**/*.module.css
statement: Express padding, margin, and flex `gap` with the spacing scale tokens `var(--space-1)`..`var(--space-6)` (4/8/12/16/24/32px) and corner rounding with `var(--radius)` / elevation with `var(--shadow)`; raw px is reserved for values off the scale such as `font-size`, fixed icon dimensions, and border widths.
example: client/src/components/todos/TodoCard.module.css:4
check:
```

```rule
id: FE-016
severity: info
scope: client/src/components/**/*.tsx
statement: Drive variant and state styling by composing a base class with a modifier class keyed off the prop value in a template literal — styles.badge plus styles[tone] for an always-present variant, and a ternary that yields styles.card alone or styles.card plus styles.done for an optional state class. No `classnames`/`clsx` helper exists in this project and conditional classes are never built by string concatenation of literals.
example: client/src/components/ui/Badge.tsx:12
check:
```

```rule
id: FE-017
severity: warn
scope: client/src/components/**/*.tsx
statement: Use the inline `style` prop only for values that are unknowable at author time because they come from entity data (a tag's `color` as `backgroundColor`, a computed bar `width` percentage); every static rule — layout, spacing, typography, token colors — belongs in the component's CSS Module.
example: client/src/components/stats/TagBreakdown.tsx:24
check:
```

```rule
id: FE-018
severity: warn
scope: client/src/hooks/*.ts
statement: Give every server resource exactly one hook at `client/src/hooks/use<Resource>.ts` that owns all of its state and returns a flat object shaped `{ <items>, loading, error, refetch, ...mutators }` — the plural entity field first (`tags`, `todos`, plus any sibling payload like `meta`/`tagStats`), then `loading`, `error`, `refetch`, then one mutator per write operation. There is no Redux/Zustand/React-Query layer.
example: client/src/hooks/useTags.ts:50
check:
```

```rule
id: FE-019
severity: error
scope: client/src/components/**/*.tsx
statement: Components in a Page/Grid/Card/Form slice never import from `client/src/api/*` — they receive data and mutators from the Page's resource hook. The one sanctioned exception is a self-contained sidebar widget (see the `ActivityFeed` rule).
example: client/src/components/tags/TagGrid.tsx:2
check:
```

```rule
id: FE-020
severity: warn
scope: client/src/components/**/*.tsx
statement: A widget with no page of its own owns its fetch directly and is refreshed by a `refreshKey: unknown` prop that the parent bumps — `ActivityFeed` imports `activityApi`, fetches in a `useEffect` keyed on `[refreshKey]`, and is rendered as `<ActivityFeed refreshKey={todos} />`. Use this shape only for such widgets, never for a Grid or Card.
example: client/src/components/activity/ActivityFeed.tsx:23
check:
```

```rule
id: FE-021
severity: warn
scope: client/src/hooks/*.ts
statement: Build each resource hook from the same skeleton as `useTags`: `useState` for the data (initialized empty/null), `useState(true)` for `loading`, `useState<string | null>(null)` for `error`; a `refetch` wrapped in `useCallback` that does `setLoading(true)` then `setError(null)`, awaits the api module inside `try`, maps failures with `err instanceof Error ? err.message : 'Failed to load <resource>'`, and clears `loading` in `finally`; then `useEffect(() => { void refetch(); }, [refetch])` to load on mount.
example: client/src/hooks/useTags.ts:10
check:
```

```rule
id: FE-022
severity: warn
scope: client/src/hooks/*.ts
statement: Write mutators as `useCallback` wrappers that await the api call and then `await refetch()`, with `[refetch]` as the only dependency — never patch local state optimistically and never return the server payload. Mutators deliberately do NOT catch: the rejection propagates to the calling component, which owns the error UI.
example: client/src/hooks/useTags.ts:26
check:
```

```rule
id: FE-023
severity: warn
scope: client/src/context/*.tsx
statement: Reach for React context only for state two sibling subtrees must share (today that is exactly `TodoFiltersContext`, shared by `TodoFilterBar` and `TodoGrid`). A new context lives in `client/src/context/<Name>Context.tsx`, keeps the `createContext<...Value | null>(null)` handle module-private, memoizes the value with `useMemo`, and exports the `<Name>Provider` plus a `use<Name>()` accessor that throws `'use<Name> must be used inside <Name>Provider'` when the context is null.
example: client/src/context/TodoFiltersContext.tsx:48
check:
```

```rule
id: FE-024
severity: info
scope: client/src/components/**/*.tsx
statement: Keep ephemeral UI state as local `useState` in the component that renders the affected UI — modal visibility on the Page (`const [showForm, setShowForm] = useState(false)`), per-row action failures on the Card (`const [actionError, setActionError] = useState<string | null>(null)`). Never lift this into a hook or context, and never mirror server data in component state.
example: client/src/components/todos/TodoCard.tsx:17
check:
```

```rule
id: FE-025
severity: warn
scope: client/src/components/**/*.tsx
statement: Declare props as an exported `interface <Component>Props` placed directly above the component and destructure it inline in the signature (`export function TodoGrid({ todos, tags, loading, ... }: TodoGridProps)`). Types are `interface`, never a `type` alias or inline object literal; there is no `React.FC`, no `defaultProps`, and defaults are set in the destructuring pattern (`variant = 'secondary'`). A component with no inputs (`Spinner`, `TagsPage`) declares no props interface at all.
example: client/src/components/todos/TodoGrid.tsx:8
check:
```

```rule
id: FE-026
severity: warn
scope: client/src/components/**/*Grid.tsx
statement: Have every Grid triage its props in this fixed order with early returns before rendering the list: `if (loading) return <Spinner />;` then, on `error`, a `<div className={styles.error} role="alert">` containing `<p>{error}</p>` and a `<Button onClick={onRetry}>Retry</Button>`; then, on an empty array, an `<EmptyState title=... hint=... />`; and only then the `styles.grid` container mapping items to Cards keyed by `item.id`.
example: client/src/components/tags/TagGrid.tsx:17
check:
```

```rule
id: FE-027
severity: warn
scope: client/src/components/**/*.tsx
statement: Type mutation callbacks passed down to children as `on<Verb>: (id: string) => Promise<void>`, and form callbacks as `onSubmit: (input) => Promise<void>` plus `onCancel: () => void`.
example: client/src/components/todos/TodoCard.tsx:11
check:
```

```rule
id: FE-028
severity: info
scope: client/src/components/**/*.tsx
statement: Pass a Card the whole shared entity as one prop named after the singular resource (`todo: Todo`, `tag: Tag`, `stat`-collections for panels) rather than spreading its scalar fields, and pass any collection the child needs for lookup alongside it (`tags: Tag[]` so `TodoCard` can resolve `todo.tagIds`); resolving that lookup is the child's job, not the Grid's.
example: client/src/components/tags/TagCard.tsx:8
check:
```

```rule
id: FE-029
severity: error
scope: client/src/**/*
statement: Import domain and API contract types from `@taskboard/shared` with a type-only import (`import type { Todo, Tag, PageMeta } from '@taskboard/shared'`) — never redeclare, copy, or locally widen a shared entity/envelope/query type in `client/src`.
example: client/src/hooks/useTodos.ts:2
check:
```

```rule
id: FE-030
severity: warn
scope: client/src/api/*Api.ts
statement: Mutation payload types are owned by the resource's api module: declare `export interface Create<Resource>Input` there and derive updates as `export type Update<Resource>Input = Partial<Create<Resource>Input>`; hooks and forms import those input types from the api module, never restate the fields.
example: client/src/api/tagsApi.ts:4
check:
```

```rule
id: FE-031
severity: info
scope: shared/src/*.ts
statement: Use `interface` for object shapes and reserve `type` aliases for unions and derived types (`export type TodoStatus = 'open' | 'done'` alongside `export interface Todo`) — never a `type` alias for a plain object shape and never a TS `enum`.
example: shared/src/types.ts:3
check:
```

```rule
id: FE-032
severity: error
scope: client/src/**/*
statement: Type unvalidated or opaque payloads as `unknown` and narrow before use (`readonly details?: unknown`, `err instanceof Error ? err.message : fallback`). `any` and `as any` appear nowhere in `client/src` and must stay out; the only non-null assertion in the client is the root-element lookup in `main.tsx` — do not add others.
example: client/src/api/http.ts:9
check:
```

```rule
id: FE-033
severity: warn
scope: client/src/hooks/use*.ts
statement: Data hooks expose the caught failure as `error: string | null`, always derived with `err instanceof Error ? err.message : '<Failed to load …>'` — never store the `ApiError`/`Error` object, an error code, or re-throw out of the hook.
example: client/src/hooks/useTags.ts:16
check:
```

```rule
id: FE-034
severity: warn
scope: client/src/components/**/*.tsx
statement: Render user-facing error messages inside an element carrying `role="alert"` and a CSS-module error class (`<p className={styles.error} role="alert">{error}</p>`) across Pages, Grids, Cards, and Forms; this per-component inline alert is the project's only error surface — there is no ErrorBoundary, so never introduce one. (`ActivityFeed.tsx:35` still renders its error without the role — that is drift to fix, not a pattern to copy.)
example: client/src/components/tags/TagGrid.tsx:21
check:
```

```rule
id: FE-035
severity: warn
scope: client/src/components/**/*.tsx
statement: Hook mutators (`onDelete`, `onSubmit`, `onComplete`) reject rather than swallow, so the Card/Form that invokes one owns a local `useState<string | null>(null)` error slot (`deleteError`, `actionError`, `error`), resets it to `null` before the call, and fills it in `catch` — never let a mutation rejection escape to the page.
example: client/src/components/lists/ListCard.tsx:12
check:
```

```rule
id: FE-036
severity: error
scope: client/src/hooks/use*.ts
statement: Wrap `refetch` and every mutator in `useCallback` — `refetch` on its real inputs only, mutators on `[refetch]` — because the mount effect is `useEffect(() => { void refetch(); }, [refetch])`; an unmemoized fetcher makes that effect refetch on every render.
example: client/src/hooks/useTags.ts:10
check:
```

```rule
id: FE-037
severity: warn
scope: client/src/hooks/use*.ts
statement: When a hook takes an object argument, serialize it once (`const queryKey = JSON.stringify(query)`), use that string as the sole `useCallback` dependency, and parse it back inside the fetcher — never depend on the object identity, which changes every render.
example: client/src/hooks/useTodos.ts:12
check:
```

```rule
id: FE-038
severity: error
scope: client/src/**
statement: Never call `fetch` (or any other HTTP client) outside `client/src/api/http.ts` — every request goes through the exported `request<T>(path, options)` wrapper, which is the only place that unwraps the `{ data, meta? }` envelope and throws `ApiError` with the envelope's `code`/`message`.
example: client/src/api/http.ts:25
check:
```

```rule
id: FE-039
severity: warn
scope: client/src/api/*Api.ts
statement: Each resource gets one `client/src/api/<resource>Api.ts` module exporting a single named const object (`tagsApi`, `todosApi`, `listsApi`) whose async methods call `request<T>()` and return the unwrapped `.data` — no free-standing per-endpoint functions, no default export, no class.
example: client/src/api/tagsApi.ts:11
check:
```

```rule
id: FE-040
severity: error
scope: client/src/api/*Api.ts
statement: API paths are origin-relative `/api/...` string literals written inline in the method — never an absolute URL, an env var base URL, or a shared `BASE_URL` constant; Vite's dev proxy forwards `/api` to :3001 (`client/vite.config.ts`).
example: client/src/api/tagsApi.ts:13
check:
```

```rule
id: FE-041
severity: warn
scope: client/src/api/*Api.ts
statement: Only endpoints that need pagination expose the envelope: `todosApi.list` returns the whole `{ data, meta? }` from `request` so callers can read `meta`; every other method returns just the entity or `void`. Build query strings inside the api module with `URLSearchParams`, skipping `undefined`/`''` values.
example: client/src/api/todosApi.ts:25
check:
```

```rule
id: FE-042
severity: warn
scope: client/src/components/**/*Form.tsx
statement: Forms are hand-rolled: one `useState` per field plus `submitting` and `error` state, wired as controlled inputs with `value`/`onChange`. Do not introduce a form library (react-hook-form, Formik) or client-side zod schemas — none exist in this client.
example: client/src/components/tags/TagForm.tsx:12
check:
```

```rule
id: FE-043
severity: warn
scope: client/src/components/**/*Form.tsx
statement: A Form component is presentational and never touches the api modules or data hooks: its props are `onSubmit: (input: Create<Resource>Input) => Promise<void>` plus `onCancel: () => void`, and any lookup arrays such as `lists`/`tags`.
example: client/src/components/tags/TagForm.tsx:6
check:
```

```rule
id: FE-044
severity: warn
scope: client/src/components/**/*Form.tsx
statement: `handleSubmit(e: React.FormEvent)` follows the fixed sequence: `e.preventDefault()`, `setSubmitting(true)`, `setError(null)`, `await onSubmit(...)` — and in the `catch` set the message and `setSubmitting(false)`. Deliberately do NOT reset `submitting` on success or in a `finally`: the parent unmounts the modal, so the button stays disabled until it goes away.
example: client/src/components/tags/TagForm.tsx:17
check:
```

```rule
id: FE-045
severity: warn
scope: client/src/components/**/*Form.tsx
statement: Normalize field values in `handleSubmit` before calling `onSubmit`: `.trim()` required strings, and map empty optional strings/dates to `undefined` (`notes.trim() === '' ? undefined : notes.trim()`) so omitted fields are absent from the request body rather than empty strings.
example: client/src/components/lists/ListForm.tsx:22
check:
```

```rule
id: FE-046
severity: warn
scope: client/src/components/**/*Form.tsx
statement: The server is the validator — express field constraints only as native HTML attributes (`required`, `maxLength` matching the server's limit) plus a submit `Button` disabled on `submitting || <required field>.trim() === ''`. No JS validation functions or duplicated rule logic on the client.
example: client/src/components/todos/TodoForm.tsx:106
check:
```

```rule
id: FE-047
severity: warn
scope: client/src/App.tsx
statement: Navigation is a single `useState<TabKey>('todos')` in `App.tsx` that conditionally renders one page per tab (`{tab === 'todos' && <TodosPage />}`). There is no router: do not add react-router, URL paths, query-param sync, history, lazy/Suspense route splitting, or route guards.
example: client/src/App.tsx:10
check:
```

```rule
id: FE-048
severity: warn
scope: client/src/components/layout/NavTabs.tsx
statement: The `TabKey` union and the module-level `TABS: { key: TabKey; label: string }[]` array in `NavTabs.tsx` are the single source of truth for top-level navigation; adding a page means extending both there and adding the matching `tab === '<key>' && <Page />` line in `App.tsx`.
example: client/src/components/layout/NavTabs.tsx:3
check:
```

```rule
id: FE-049
severity: info
scope: client/src/components/layout/NavTabs.tsx
statement: `NavTabs` stays stateless: props are `{ active: TabKey; onChange: (tab: TabKey) => void }`, each tab renders as `<button type="button">` whose class is `` `${styles.tab} ${styles.active}` `` when `tab.key === active`, and selection is reported upward via `onChange` only.
example: client/src/components/layout/NavTabs.tsx:17
check:
```

```rule
id: FE-050
severity: error
scope: client/src/**/*.test.ts*
statement: Import every test helper explicitly from 'vitest' (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`) — Vitest globals are intentionally OFF in the client, so relying on an ambient global throws at runtime.
example: client/src/testing/setup.ts:7
check:
```

```rule
id: FE-051
severity: info
scope: client/src/**/*.test.ts*
statement: Never call `cleanup()` in a test file — per-test DOM cleanup is already registered as `afterEach(cleanup)` in `client/src/testing/setup.ts`.
example: client/src/testing/setup.ts:7
check:
```

```rule
id: FE-052
severity: warn
scope: client/src/hooks/*.test.ts
statement: Hook tests mock the resource's api module with a top-level `vi.mock('../api/<x>Api', ...)` factory that returns a `vi.fn()` for every method, then in `beforeEach` call `vi.clearAllMocks()` and set the default `list` resolution with `vi.mocked(...).mockResolvedValue(FIXTURE)`.
example: client/src/hooks/useTags.test.ts:6
check:
```

```rule
id: FE-053
severity: warn
scope: client/src/hooks/*.test.ts
statement: Drive hook tests with `renderHook` from @testing-library/react: assert `result.current.loading` is true synchronously, then `await waitFor(() => expect(result.current.loading).toBe(false))` before asserting items/error, and wrap every mutator call in `await act(() => result.current.<mutator>(...))`. For a mutator, assert the api method received the exact payload AND that the list api was called a second time (`expect(tagsApi.list).toHaveBeenCalledTimes(2)`) to prove the refetch — never assert on the post-mutation items array, since the hook re-reads from the api rather than mutating local state.
example: client/src/hooks/useTags.test.ts:24
check:
```

```rule
id: FE-054
severity: warn
scope: client/src/components/**/*.test.tsx
statement: Presentational Grid tests pass every prop explicitly on each `render` (no shared setup helper, no partial props) and cover the four states the Grid renders: populated, `loading={true}` (assert `getByRole('status')`), `error="..."` with a Retry click, and the empty state text.
example: client/src/components/tags/TagGrid.test.tsx:16
check:
```

```rule
id: FE-055
severity: warn
scope: client/src/components/**/*Form.test.tsx
statement: Form tests use `userEvent` (not `fireEvent`), pass `onSubmit`/`onCancel` as `vi.fn()` mocks, and cover four behaviors: the submitted payload including default field values, the disabled-submit guard, a rejected `onSubmit` surfacing through `findByRole('alert')`, and `onCancel` firing.
example: client/src/components/tags/TagForm.test.tsx:22
check:
```

```rule
id: FE-056
severity: warn
scope: client/src/api/http.test.ts
statement: Stub `fetch` through the local `mockFetch(status, body)` helper built on `vi.stubGlobal` and always restore with `vi.unstubAllGlobals()` in `afterEach`; keep covering both envelope failure modes — an `{ error }` body, and a 2xx body that is not `{ data }`.
example: client/src/api/http.test.ts:4
check:
```

```rule
id: FE-057
severity: warn
scope: client/vitest.config.ts
statement: Client test settings live in `client/vitest.config.ts` (the project entry listed in the root `vitest.config.ts` `projects` array) and are duplicated in the `test` block of `client/vite.config.ts`; any change to `environment`, `setupFiles`, or `include` must be applied to BOTH files or `npm test` and `vitest` run with different setups.
example: client/vitest.config.ts:6
check:
```

```rule
id: FE-058
severity: warn
scope: eslint.config.js
statement: Lint config is a single root flat config; client-only rules belong in the existing `files: ['client/src/**/*.{ts,tsx}']` block (react + react-hooks plugins) — never add a `client/eslint.config.js` or per-workspace lint config.
example: eslint.config.js:25
check:
```

```rule
id: FE-059
severity: info
scope: client/src/**/*.tsx
statement: Never import `React` just for JSX — the flat config enables `react/jsx-runtime` and client/tsconfig.json sets `"jsx": "react-jsx"`; import only the hooks and types you use (`import { useState } from 'react'`) and reference `React.ReactNode` inline via the global type where needed.
example: client/src/components/inspiration/InspirationWidget.tsx:1
check:
```

```rule
id: FE-060
severity: warn
scope: client/package.json
statement: Client workspace scripts are fixed: `dev` (vite), `build` (vite build), `test` (`vitest run`), `test:watch` (`vitest`), `typecheck` (`tsc -p tsconfig.json`, noEmit) — run them from the root as `npm test -w client` / `npm run typecheck -w client`, and keep `npm run lint`, `npm run typecheck`, `npm test` green since .github/workflows/ci.yml runs exactly those three at the repo root.
example: client/package.json:12
check:
```

```rule
id: FE-061
severity: warn
scope: client/src/lib/*.ts
statement: Pure display and formatting helpers live in `client/src/lib/<topic>.ts` as named functions (`formatDate`, `isOverdue` in `lib/dates.ts`) and are imported by the components that need them — never inline a `toLocaleDateString` or a date comparison in a component.
example: client/src/lib/dates.ts:2
check:
```

```rule
id: FE-062
severity: warn
scope: client/src/main.tsx
statement: `client/src/main.tsx` is the only module that mounts the app and the only place `./index.css` is imported: `createRoot(...).render(<StrictMode><App /></StrictMode>)`. Keep `StrictMode` and do not add a second global stylesheet import elsewhere.
example: client/src/main.tsx:6
check:
```

```rule
id: FE-063
severity: info
scope: client/**/*
statement: Prettier owns all formatting via `.prettierrc.json` (semicolons, single quotes, trailing commas `all`, printWidth 100) — do not hand-wrap or hand-align code; run `npm run format` instead of matching style manually.
example: .prettierrc.json:5
check:
```

```rule
id: FE-064
severity: warn
scope: client/**/*
statement: The client has NO env/config layer — no `.env` files and zero `import.meta.env`/`process.env` reads. Dev-time settings (port 5173 and the `/api` -> http://localhost:3001 proxy) live in `client/vite.config.ts`.
example: client/vite.config.ts:11
check:
```

```rule
id: FE-065
severity: info
scope: client/tsconfig.json
statement: `client/tsconfig.json` extends `tsconfig.base.json` and adds only client-specific options (`lib` DOM entries, `"jsx": "react-jsx"`, `"types": ["vite/client"]`, `include: ["src", "vite.config.ts"]`) — put any compiler option shared with server/shared in `tsconfig.base.json` instead.
example: client/tsconfig.json:2
check:
```

```rule
id: FE-066
severity: info
scope: client/src/**/*.ts*
statement: Doc comments are exception-based, not routine: a one-to-three-sentence `/** */` goes on shared utilities (`api/http.ts`, `lib/dates.ts`), on a context provider, or on a component with a deliberate non-obvious behavior contract — ordinary feature components (TagsPage/TagGrid/TagCard/TagForm) carry none, so do not add boilerplate JSDoc to them.
example: client/src/api/http.ts:21
check:
```

```rule
id: FE-067
severity: info
scope: client/src/components/**/*.tsx
statement: Document a prop only when its purpose is not obvious from name and type: add a single-line `/** */` above that field inside the exported `*Props` interface (as on `Badge.dotColor` and `ActivityFeed.refreshKey`) rather than writing a comment block above the component.
example: client/src/components/ui/Badge.tsx:6
check:
```
