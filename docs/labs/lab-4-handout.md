# Lab 4 — Capstone (Demo Day)

**Demo Day: Thursday, August 27, 2026.** Your exec sponsor and leadership attend to see what
you've built — this is the formal capstone of the program.

**Deliverable:** **one real, team-shareable artifact you own** — putting everything from the program to work.
**Duration:** self-built through week 6 (office hours + teaming up with other developers); one ~2-hr block at Demo Day.
**Surface:** real code — this repo or your own team's work.

**The challenge.** Pick **one** artifact from the menu, build it on real code, prove it in at
least one real instance, commit and share it with the team, and present it at Demo Day.

## Pick one artifact

| Artifact                                                                    | Ideas — anything like…                                                                       | Build          |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------- |
| **Shareable skill or specialist subagent**                                   | things you explain twice: writing tests, drafting PR reviews, debugging a subsystem, scaffolding new code, release chores | solo           |
| **Governance / standards contribution** — into the team's Collective Brain   | rules that live in someone's head: naming, what "done" means, which doc to write when, how we work with Claude | solo           |
| **Guardrail / hook bundle** — grow your Lab 2 hook into a team policy set    | things reviewers keep catching by hand: protected files, risky commands, architecture rules, secrets | solo           |
| **Small workflow automation**                                                | chores you dread: environment setup, deploy steps, ticket grooming, status reports, form-filling | solo or paired |
| **MCP server / connector**                                                   | systems you keep copy-pasting from: tickets, databases, CI status, internal docs and APIs      | solo or paired |

_Every option counts the same toward your capstone — pick whichever fits your real work._
An MCP server can be a **small local script** (Python or Node) that Claude Code launches on your
machine, or a **remote service** — either is a valid capstone. Start **read-only**, fewest useful
operations, config included; prep is the self-paced _Extending Claude Code_ module.

**Evidence — the same three things for every artifact:** an **impact note** in your own words
(what it saves or improves — "before, this was all manual" is a fine story; numbers only if you
have them), a **named teammate who will adopt it**, and a short **"how to use" README**.

**Your 10 minutes on Demo Day (max, per developer or paired entry):**

1. **Come on live** and share your screen.
2. **Introduce your artifact** — what it is and the problem it removes (~2 min).
3. **Practical demonstration** — run it on real work, live (~5 min).
4. **Questions & answers** from the room (~3 min).

**Done means:**

- [ ] one owned, committed, team-shared artifact from the menu
- [ ] used or validated in at least one real instance
- [ ] the three evidence items
- [ ] Demo Day presentation delivered — counts toward **Framework Practitioner** (a governance-doc capstone still certifies)

**Stuck?** "Nothing to automate" is fine — ship a skill, doc, or connector. Scope too big — build
the smallest useful version (start from the automation-asks list or your Lab 2 work). No adopter
yet — recruit one teammate. That's the point.

<style>
/* One-page fit for the PDF export only — GitHub strips this block when rendering. */
body { font-size: 9.5pt; line-height: 1.35; }
p, ul, ol { margin: 0.45em 0; }
h1 { margin: 0 0 0.35em; }
h2 { margin-top: 0.7em; margin-bottom: 0.3em; }
td, th { padding: 3px 7px; }
table { font-size: 9pt; }
li { margin: 1px 0; }
ul, ol { padding-left: 1.6em; }
@page { margin: 10mm 15mm; }
</style>
