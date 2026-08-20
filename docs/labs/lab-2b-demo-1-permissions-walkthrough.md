# Lab 2.b demo 1 walkthrough — the five-minute guardrail (permissions)

The warm-up, written down. Layer 2a on the timeline: **configuration, not code** — the cheapest
guardrail there is, and the one to land in every repo you own tomorrow. In the live session
everyone does this together; use this page to replay it, catch up, or fix a step. ~5 minutes.

**Before you start:** your own copy; `.claude/settings.json` exists and still holds the seed rules.

---

## Step 1 — Read what's already there

Open `.claude/settings.json`. It already carries two `permissions.deny` rules protecting
`server/data/seed.json`, and a `hooks` block registering `protect-seed.js`. **Both must survive
this demo** — they're the exhibit the rest of the lab builds on.

```json
{
  "permissions": {
    "deny": ["Edit(server/data/seed.json)", "Write(server/data/seed.json)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/protect-seed.js\""
          }
        ]
      }
    ]
  }
}
```

_(A `settings.local.json` may sit next to it — that's your personal, git-ignored overrides file;
leave it alone.)_

## Step 2 — MERGE in the ask/deny list

Three verdicts, not two: **allow** (silent), **ask** (stop and check), **deny** (never). Add the
`ask` array and **append** to the existing `deny` array — never paste over the file:

```json
{
  "permissions": {
    "allow": [],
    "ask": ["Bash(rm *)"],
    "deny": [
      "Edit(server/data/seed.json)",
      "Write(server/data/seed.json)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Bash(git clean *)",
      "Bash(npm publish *)",
      "Bash(curl * | bash)"
    ]
  }
}
```

The rule of thumb while you type: **deny the unrecoverable, ask the annoying.** If everything
asks, people stop reading — prompt fatigue kills the layer.

The `allow` array is empty **on purpose** — it's the third verdict's home. Later, promote the
commands you never want to be asked about (`Bash(npm test)`, `Bash(npm run lint)`) into it;
day one, empty is the right default. Entries are earned.

## Step 3 — Verify both directions

1. **Block:** ask Claude to force-push, or to `rm -rf` something. Watch it refuse (deny) or stop
   for your confirmation (ask). **Save the refusal line** — pasting it into chat is the live
   checkpoint; into your PR description, the evidence standard.
2. **Still intact:** ask Claude to edit `server/data/seed.json` and confirm it is **still**
   refused. If it isn't, you pasted over the file instead of merging — restore the two seed rules
   and the hooks block.

That's the whole demo. This is the honest answer to "there are no restore points" and "it did
something I didn't expect": five minutes, no code, works in every repo.

---

## Common wobbles

| Wobble                                    | The move                                                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| seed.json is no longer refused            | You pasted over the file. Restore the two seed `deny` rules and the `hooks` block, then re-verify          |
| The new rules don't seem to apply         | Settings are read at session start — start a new Claude Code session                                       |
| Everything asks now                       | You made the `ask` list too broad. Deny the unrecoverable, ask the genuinely dangerous, allow the rest     |
| Rule syntax doubts                        | The shape is `Tool(pattern)` — e.g. `Bash(git push --force *)`, `Edit(server/data/seed.json)`              |
