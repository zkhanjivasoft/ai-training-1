# Project Summary

TaskBoard is a training codebase for practicing AI-assisted development: a task-board (todo) app with tags, lists, an activity feed, and stats. It's an npm-workspaces monorepo with an Express 5 REST API backed by a flat JSON file (`server/data/db.json`), a React 18 + Vite client, and a shared TypeScript types package (`@taskboard/shared`) consumed by both tiers.

## Tools observed during exploration

- **Bash tool** — used to run `ls` and `find . -maxdepth 3 -type d` to map the top-level layout and directory structure of the monorepo.
- **Read tool** — used to open `package.json` (to see the workspace scripts) and `client/src/context/TodoFiltersContext.tsx` (the file open in the IDE) to inspect their contents directly.
- **Bash tool (again)** — used to list the contents of `server/src/routes`, `server/src/services`, `shared/src`, and `client/src/components` to see how resources are organized per architectural layer.
