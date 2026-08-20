# Lab 2.b demo 4 walkthrough — reading the CI (layer 4, merge time)

The shortest demo: no build, one file to read, one question to answer. Layer 4 is **merge time** —
the moment `git commit --no-verify` cannot reach, and the layer that holds against **anyone
merging, agent or human**, wired clone or fresh one. ~5 minutes.

---

## Step 1 — Read what already runs

Open [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). On **every PR and every push
to main** it runs:

```yaml
- npm ci
- npm run lint        # includes the no-console rule for server/src
- npm run typecheck
- npm test
```

Lint, typecheck, tests: deterministic, non-AI guardrails have been holding this repo the whole
time. The repo's review agent (`.claude/agents/taskboard-code-reviewer.md`) is even told **not**
to re-report what these catch — the AI layer spends itself on what only it can see. Use the
cheapest layer that holds.

## Step 2 — Find the rule that's written but never run

One of this repo's `package.json` scripts encodes a rule that **no layer enforces**. Find it
before reading on.

<details>
<summary>The answer</summary>

`"format:check": "prettier --check ."` — the formatting rule exists as a runnable script, and
nothing calls it: not CI, not a git hook, nothing. A written rule with no gate at any layer. That
gap-hunt — *"which of our rules are enforced in tooling, and which are just written down?"* — is
the exact skill the whole lab is about, applied to someone else's repo in thirty seconds.

Closing it is a one-line decision about **which layer is cheapest**: a CI step (holds against
everyone, runs late) or a pre-commit hook (runs early, per-clone, `--no-verify`-able) — or both,
one rule module, two enforcement points.

</details>

## Step 3 — Where your gate goes

The governance gate you build in the exercise (`.github/workflows/governance.yml`, handout §3) is
a **sibling of this file** — same trigger, same Actions tab, one more check on the PR. To be
precise about what it is: GitHub cannot run your Claude hook (no agent runs there), so the gate
is a **second program** — your rule's check re-written as a grep — that GitHub runs on every
pull request. Two things to know before you build:

- **It only runs when a PR exists.** A pushed branch alone runs nothing — open a draft PR to see
  it fire, or your gate will look broken when it's merely unasked.
- **Results live in the PR's Checks tab** (or the repo's Actions tab). The run URL is this
  layer's evidence — the refusal text's merge-time twin.

---

## Common wobbles

| Wobble                                   | The move                                                                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| "My gate doesn't run"                    | Draft PR open? `on: pull_request` runs nothing for a bare branch                                  |
| `git diff` fails with "unknown revision" | `fetch-depth: 0` on the checkout step — the default shallow clone breaks diffs against the base   |
| Can't find the run                       | PR page → Checks tab, or repo → Actions tab; each run links its log per step                      |
