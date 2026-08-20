#!/bin/sh
# commit-msg.sh — layer 3 (commit time) for a rule this repo already states:
# CLAUDE.md says "Conventional Commits", and nothing checks it. This does.
#
# Install (after `npm install -D husky`, then `npx husky init`):
#   cp docs/labs/snippets/commit-msg.sh .husky/commit-msg     # same in PowerShell
#
# No chmod, no extension needed, on ANY OS: git runs husky's shim
# (core.hooksPath = .husky/_), and the shim runs this file as an argument
# to sh - so the OS never "executes" it. Windows included: git ships its
# own shell. (Raw git hooks WITHOUT husky are different - there chmod +x
# is required, and travels via `git update-index --chmod=+x`.)
# git passes the commit-message file path as $1.
# Walkthrough with the verify steps: docs/labs/lab-2b-demo-2-git-hook-walkthrough.md

msg="$(head -n 1 "$1")"

if echo "$msg" | grep -qE '^(feat|fix|docs|test|refactor|chore|build|ci)(\([a-z0-9-]+\))?: .+'; then
  exit 0
fi

echo 'BLOCKED: commit message is not Conventional Commits.' >&2
echo 'Why: CLAUDE.md mandates the format - history and changelogs depend on it.' >&2
echo 'Instead: <type>(<scope>): <summary> - e.g. fix(server): guard empty title.' >&2
echo 'Done means: git log --oneline -1 reads like a changelog line.' >&2
exit 1
