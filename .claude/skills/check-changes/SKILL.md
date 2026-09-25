---
name: check-changes
description: Reviews staged (or unstaged) local changes for correctness bugs, security issues, and naming/readability problems before a commit. Use when asked to "check my changes", "review before I commit", or run "/check-changes" — not a general code review of the whole codebase, only of the current git diff.
context: fork
---

# Review the current diff

Current staged diff:

!`git diff --staged`

If that's empty, review the unstaged diff instead:

!`git diff`

Review the diff shown above across at least these three categories:

1. **Correctness** — does the change do what it appears to intend? Trace any changed
   condition, loop bound, or comparison against concrete inputs; flag anything that would
   produce a wrong result for a plausible input.
2. **Security** — unvalidated input reaching a sink (a shell command, a query, a log
   line, an HTTP response), secrets or internal detail leaking outward, missing bounds
   checks.
3. **Naming & readability** — do new or renamed identifiers say what they are without
   requiring the reader to open the implementation? Flag only what actually costs a
   reader time, not a style preference.

For each issue found, report:
- **File:** the path
- **Line:** the line number in the new version of the file
- **Severity:** Critical / Major / Minor / Nit
- **Suggested fix:** the minimal change, described or as a short snippet

If the diff is empty in both the staged and unstaged case, say so plainly and stop —
don't invent findings against files that aren't part of the current change.
