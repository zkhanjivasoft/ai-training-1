import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { statsService } from './stats.service';
import { todosService } from './todos.service';
import { makeTestDb } from '../testing/helpers';

describe('statsService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('counts a todo completed just now as completed this week', () => {
    todosService.complete('todo_a');

    const summary = statsService.summary();

    expect(summary.completedThisWeek).toBe(1);
  });
});
