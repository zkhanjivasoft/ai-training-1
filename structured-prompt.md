# Structured Prompt

## Task chosen

Add a small `truncate` text-formatting utility to the client, following the existing
`lib/dates.ts` pattern, and use it in `ActivityFeed` to shorten long todo titles in
the activity list.

## Reference files identified

- `client/src/lib/dates.ts` — the existing pattern for small, pure, named-export
  display/formatting helpers in this project.
- `client/src/components/activity/ActivityFeed.tsx` — the component that will
  consume the new helper.

## The four-part prompt

**Context:**
TaskBoard is a React + Vite client in an npm-workspaces monorepo. Pure display/
formatting helpers live in `client/src/lib/<topic>.ts` as named functions — see
@client/src/lib/dates.ts, which exports `formatDate` and `isOverdue`. The activity
feed at @client/src/components/activity/ActivityFeed.tsx currently renders each
entry's full `todoTitle` with no length limit, which can overflow the sidebar
layout for long todo titles.

**Task:**
Add a `truncate(text: string, maxLength: number): string` helper in a new
`client/src/lib/text.ts` file, and use it in `ActivityFeed.tsx` to cap each
rendered `entry.todoTitle` at 60 characters, appending an ellipsis when the
title is cut.

**Constraints:**
- Match the style of `lib/dates.ts` exactly: a hoisted named export, a one-line
  `/** */` doc comment above it, no default export, no class.
- Don't add a new dependency (e.g. lodash) for this — it's a few lines of plain
  string logic.
- Don't touch `server/data/seed.json` or any file outside `client/src`.
- Follow this repo's import-order convention when adding the import to
  `ActivityFeed.tsx` (lib import goes after the type import, before the
  `.module.css` import — see how `TodoCard.tsx` imports `lib/dates.ts`).

**Verification:**
Run `npm run typecheck -w client` and `npm test -w client` and confirm both are
clean/passing, since there's no existing test file for `ActivityFeed` or for
`lib/dates.ts` to extend.

## Summary of Claude's response

Claude created `client/src/lib/text.ts` with a `truncate` function matching the
`dates.ts` style (named export, one-line JSDoc, pure function), imported it into
`ActivityFeed.tsx` in the correct import-order position, and wrapped
`entry.todoTitle` with `truncate(entry.todoTitle, 60)`. It then ran the typecheck
and test suite as requested and reported both passing.

## Follow-up iteration prompt

> "Refine `truncate`: right now it can cut off in the middle of a word. Adjust it
> so that when it needs to truncate, it backs up to the last space before
> `maxLength` and cuts there instead, so titles never end mid-word."

**Iteration strategy used:** **Refine** — narrowing/adjusting the existing
implementation's behavior at a specific edge case, rather than asking for a
full rewrite or a different approach.

Claude updated `truncate` to find the last space within the sliced substring
and cut there when one exists, falling back to the original hard cut only if
no space is found early enough in the string. It re-ran typecheck and the test
suite, both still passing.
