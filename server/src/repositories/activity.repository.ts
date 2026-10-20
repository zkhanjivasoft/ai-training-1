import type { ActivityEntry } from '@taskboard/shared';
import { readDb, writeDb } from '../db/store';

// server/data/seed.json is guarded and can never be edited directly (see CLAUDE.md), so
// its activity rows still use the pre-generalization shape (todoId/todoTitle, no
// entityType/entityId/entityTitle). Normalize on read so every caller sees the current
// ActivityEntry shape regardless of which shape is actually on disk.
function normalize(entry: ActivityEntry): ActivityEntry {
  if (entry.entityType !== undefined) return entry;
  const legacy = entry as unknown as { todoId?: string; todoTitle?: string };
  return {
    ...entry,
    entityType: 'todo',
    entityId: legacy.todoId ?? entry.entityId,
    entityTitle: legacy.todoTitle ?? entry.entityTitle,
  };
}

/** Persistence for the activity feed. Append-only plus queries. */
export const activityRepository = {
  findAll(): ActivityEntry[] {
    return readDb().activity.map(normalize);
  },

  findByEntityId(entityId: string): ActivityEntry[] {
    return readDb().activity.map(normalize).filter((entry) => entry.entityId === entityId);
  },

  insert(entry: ActivityEntry): ActivityEntry {
    const db = readDb();
    db.activity.push(entry);
    writeDb(db);
    return entry;
  },
};
