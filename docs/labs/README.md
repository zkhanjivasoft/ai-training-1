# Lab handouts

Student-facing material for the Lab 2 blocks and the Lab 4 capstone. Read the handout for the block you're in.
Every handout also ships as a **PDF** (same name, `.pdf`) for offline reading and distribution.

| Block   | Handout                                                      | You'll produce                                                                                                                                                             |
| ------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2.a** | [Writing the Standards Down](lab-2a-handout.md)              | An ADR + an NFR (unenforceable clauses marked), wired into CLAUDE.md, PR-reviewed                                                                                          |
| **2.b** | [Guardrails, and Making Standards Travel](lab-2b-handout.md) | A verified hook + CI gate, a documented bypass, a decision per clause — plus the "how we use these" README, a distribution decision with an owner, and a named port target |
| **4**   | [Capstone (Demo Day)](lab-4-handout.md)                      | One owned, team-shared artifact from the five-option menu, used in ≥1 real instance, presented at Demo Day (Aug 27, 2026) with its evidence                                |

Every demo is written down for replay at your own pace.
2.a: [`lab-2a-demo-walkthrough.md`](lab-2a-demo-walkthrough.md) (the ADR — six steps, prompts,
example replies, the finished document).
2.b runs four short demos, one per enforcement layer, told as a timeline:

| #   | Walkthrough                                                              | Layer / moment                                                    |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | [Permissions](lab-2b-demo-1-permissions-walkthrough.md)                  | 2a — the allow/ask/deny warm-up everyone does live                |
| 2   | [The git hook](lab-2b-demo-2-git-hook-walkthrough.md)                    | 3, commit time — the hook you already know; yours as a stretch    |
| 3   | [The Claude hook](lab-2b-demo-3-claude-hook-walkthrough.md)              | 2b, authoring time — the build-along guardrail, seven steps       |
| 4   | [Reading the CI](lab-2b-demo-4-ci-walkthrough.md) _(self-guided)_       | 4, merge time — what already runs, and the written-but-unrun rule |

Snippets to copy into your own repo live in [`snippets/`](snippets/) — one of them (2.b's settings block) must be **merged** into an existing file, never pasted over it:

| File                  | Used in | What it is                                                                   |
| --------------------- | ------- | ---------------------------------------------------------------------------- |
| `hook-skeleton.js`    | 2.b     | Hook plumbing — block and nudge shapes, two throwaway rules. Replace them    |
| `governance-gate.yml` | 2.b     | CI gate plumbing, including the `fetch-depth: 0` gotcha                      |
| `commit-msg.sh`       | 2.b     | The layer-3 commit hook from demo 2 — five lines; copy into `.husky/`        |
| `seed-lab2-issues.sh` | 2.a     | Optional — seeds the Lab 2 backlog into your copy so `Closes #N` still works |

## Why these are snippets and not files in your repo

Your copy was created from the template **before** these materials existed, and template copies
don't inherit later upstream changes. So the canonical copy lives here and you pull what you
need into your own repo.

Copy-paste from GitHub's raw view works. Or pull the whole folder:

```bash
npx giget gh:mike-tajmajer-fullstacklabs/fsl-taskboard-lab/docs/labs docs/labs
```

That is not incidental — Lab 2.b ends on a ladder of ways a standard reaches every repo, and you
just used the bottom of it. One canonical repo plus a pointer is the rung 2.b calls _crawl_;
pulling a copy on demand is most of the next rung, _walk_ — the missing half is the **pin**, a
version tag that would let you tell whether your copy is current (this repo doesn't carry tags
yet). You're using the thing you're about to be taught.

## Also worth reading

- [`../best-practices/enforcing-a-convention.md`](../best-practices/enforcing-a-convention.md) — takeaway card for applying the guardrail pattern in your own codebase, on your own conventions. Independent follow-up, supported in office hours.
- [`../best-practices/distributing-standards.md`](../best-practices/distributing-standards.md) — the Collective-layer artifact your team defines: how a standard reaches every repo, and how you know you're current. Options, trade-offs, and a template for recording the decision. Handed over at the end of Lab 2.b.
