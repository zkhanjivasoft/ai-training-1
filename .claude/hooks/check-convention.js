#!/usr/bin/env node
/**
 *
 * ── The contract ────────────────────────────────────────────────────────
 * A hook reads the tool call as JSON on stdin. What your exit code means
 * depends on WHICH event you registered it for:
 *
 *   PreToolUse  + exit 2  → BLOCKS the tool call. stderr is shown to Claude.
 *   PostToolUse + exit 2  → cannot block (the tool already ran), but stderr
 *                           is still shown to Claude → a NUDGE.
 *   any event   + exit 0  → allow, say nothing.
 *   any other non-zero    → non-blocking; the user sees a "hook error" notice.
 *
 * That difference IS the block-vs-warn decision. Pick per rule, on purpose.
 *
 * Register it in `.claude/settings.json` under the event you want:
 *
 *   "hooks": {
 *     "PreToolUse":  [{ "matcher": "Edit|Write",
 *       "hooks": [{ "type": "command",
 *         "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/check-convention.js\"" }] }]
 *   }
 *
 * Node only — no shell, no dependencies. Half the cohort is on Windows.
 * Docs: https://code.claude.com/docs/en/hooks
 */

import fs from 'node:fs';
import nodePath from 'node:path';

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  let body = '';
  let event = '';
  try {
    const payload = JSON.parse(raw);
    filePath = payload.tool_input?.file_path ?? '';
    // Write sends `content`; Edit sends `new_string`.
    body = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';
    event = payload.hook_event_name ?? '';
  } catch {
    process.exit(0); // Unparseable payload — never block unrelated work.
  }

  const path = filePath.replaceAll('\\', '/'); // Windows-safe comparisons.

  // ─── PROJECT RULES ─────────────────────────────────────────────────────

  // BLOCK — register on PreToolUse. Unambiguous and unrecoverable.
  // CLAUDE.md: "repositories/ — the ONLY layer allowed to import server/src/db/store.ts".
  // Any other server/src file importing it is an architecture-boundary violation.
  const isServerSrcFile = /\/server\/src\//.test(path);
  const isRepositoryFile = /\/server\/src\/repositories\//.test(path);
  const importsStore = /(?:from\s+|require\(\s*)['"][^'"]*\/db\/store(?:\.js)?['"]/.test(body);
  if (event === 'PreToolUse' && isServerSrcFile && !isRepositoryFile && importsStore) {
    return deny(
      'BLOCKED: only server/src/repositories/ may import db/store.ts.',
      'Why: routes and services must go through the repository layer, not read/write the store directly.',
      'Instead: add or call a repository method and have this file depend on that instead.',
      'Done means: server/src/db/store.ts is imported only from server/src/repositories/.',
    );
  }

  // NUDGE — register on PostToolUse. Heuristic, so don't block on it.
  // CLAUDE.md: "bare console.* in server/src fails lint" — use logger.ts instead.
  const isLoggerFile = /\/server\/src\/lib\/logger\.[jt]s$/.test(path);
  if (event === 'PostToolUse' && isServerSrcFile && !isLoggerFile && /console\.(log|info|warn|error|debug)\s*\(/.test(body)) {
    return nudge(
      'NOTE: this change calls console.* in server/src.',
      'Why: bare console.* in server/src fails lint; the repo standardizes on logger.ts.',
      "Instead: use logger.info('<file-basename>', message, meta?) from server/src/lib/logger.ts.",
    );
  }

  // NUDGE — register on PostToolUse. Heuristic: not every file has a natural
  // test (entrypoints, type-only files), so don't block on it.
  // CLAUDE.md testing approach: "co-located with the module under test".
  const isTestFile = /\.test\.tsx?$/.test(path);
  const isTypeScriptFile = /\.tsx?$/.test(path);
  const isExemptFile = /\/server\/src\/(?:app|index)\.tsx?$/.test(path) || /\.d\.ts$/.test(path);
  if (
    event === 'PostToolUse' &&
    isServerSrcFile &&
    isTypeScriptFile &&
    !isTestFile &&
    !isExemptFile
  ) {
    const absoluteFilePath = nodePath.resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), filePath);
    const absoluteTestPath = absoluteFilePath.replace(/\.tsx?$/, (ext) => `.test${ext}`);
    if (!fs.existsSync(absoluteTestPath)) {
      const base = nodePath.basename(absoluteFilePath);
      const testBase = nodePath.basename(absoluteTestPath);
      return nudge(
        `NOTE: ${base} has no sibling ${testBase}.`,
        'Why: this repo co-locates tests with the module under test and expects error paths covered.',
        `Instead: add ${testBase} covering this change, following the pattern in tags.routes.test.ts.`,
      );
    }
  }

  // ─── END OF PROJECT RULES ──────────────────────────────────────────────

  process.exit(0);
});

/** Refuse the action. Only has teeth on PreToolUse. */
function deny(...lines) {
  console.error(lines.join('\n'));
  process.exit(2);
}

/** Let it through, but tell Claude. Use on PostToolUse. */
function nudge(...lines) {
  console.error(lines.join('\n'));
  process.exit(2); // On PostToolUse this informs without blocking.
}
