import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { activityRepository } from './activity.repository';
import { makeTestDb } from '../testing/helpers';

describe('activityRepository', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('finds all activity entries', () => {
    expect(activityRepository.findAll()).toHaveLength(1);
  });

  it('finds entries by entityId', () => {
    expect(activityRepository.findByEntityId('todo_a')).toHaveLength(1);
    expect(activityRepository.findByEntityId('todo_nope')).toHaveLength(0);
  });

  it('normalizes a legacy-shape row (todoId/todoTitle, no entityType) on read', () => {
    // Simulates a row from server/data/seed.json, which predates the
    // entityType/entityId/entityTitle generalization and can never be edited directly.
    const dbPath = path.join(process.env.DATA_DIR!, 'db.json');
    const raw = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    raw.activity.push({
      id: 'act_legacy',
      todoId: 'todo_legacy',
      todoTitle: 'Legacy row',
      action: 'created',
      at: '2026-01-01T00:00:00.000Z',
    });
    fs.writeFileSync(dbPath, JSON.stringify(raw, null, 2));

    const found = activityRepository.findByEntityId('todo_legacy');
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({
      entityType: 'todo',
      entityId: 'todo_legacy',
      entityTitle: 'Legacy row',
    });
  });
});
