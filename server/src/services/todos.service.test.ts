import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { todosService } from './todos.service';
import { NotFoundError, ValidationError } from '../lib/errors';
import { activityService } from './activity.service';
import { makeTestDb } from '../testing/helpers';

describe('todosService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('gets a todo by id', () => {
    expect(todosService.getById('todo_a').title).toBe('First fixture todo');
  });

  it('throws NotFoundError for a missing todo', () => {
    expect(() => todosService.getById('todo_nope')).toThrow(NotFoundError);
  });

  it('creates a todo and records activity', () => {
    const todo = todosService.create({
      title: 'Brand new',
      priority: 'high',
      listId: 'list_a',
      tagIds: ['tag_a'],
    });
    expect(todo.id).toMatch(/^todo_/);
    expect(todo.status).toBe('open');
    const feed = activityService.list({ todoId: todo.id, limit: 10 });
    expect(feed[0]?.action).toBe('created');
  });

  it('rejects a todo referencing a missing list', () => {
    expect(() =>
      todosService.create({ title: 'Orphan', priority: 'low', listId: 'list_nope', tagIds: [] }),
    ).toThrow(ValidationError);
  });

  it('rejects a todo referencing a missing tag', () => {
    expect(() =>
      todosService.create({
        title: 'Bad tag',
        priority: 'low',
        listId: 'list_a',
        tagIds: ['tag_nope'],
      }),
    ).toThrow(ValidationError);
  });

  it('updates a todo', () => {
    const updated = todosService.update('todo_a', { title: 'Renamed', priority: 'low' });
    expect(updated.title).toBe('Renamed');
    expect(updated.priority).toBe('low');
  });

  it('completes a todo and stamps completedAt', () => {
    const done = todosService.complete('todo_a');
    expect(done.status).toBe('done');
    expect(done.completedAt).toBeTruthy();
  });

  it('reopens a completed todo and clears completedAt', () => {
    todosService.complete('todo_a');
    const reopened = todosService.reopen('todo_a');
    expect(reopened.status).toBe('open');
    expect(reopened.completedAt).toBeUndefined();
  });

  it('removes a todo and records the deletion', () => {
    todosService.remove('todo_a');
    expect(() => todosService.getById('todo_a')).toThrow(NotFoundError);
    const feed = activityService.list({ todoId: 'todo_a', limit: 10 });
    expect(feed[0]?.action).toBe('deleted');
  });

  describe('list', () => {
    const baseQuery = { sort: 'createdAt' as const, page: 1, pageSize: 20 };

    it('returns all todos sorted by createdAt descending when no filters are given', () => {
      const { todos } = todosService.list(baseQuery);
      expect(todos.map((t) => t.id)).toEqual(['todo_c', 'todo_b', 'todo_a']);
    });

    it('filters by status', () => {
      const { todos } = todosService.list({ ...baseQuery, status: 'done' });
      expect(todos.map((t) => t.id)).toEqual(['todo_c']);
    });

    it('filters by priority', () => {
      const { todos } = todosService.list({ ...baseQuery, priority: 'high' });
      expect(todos.map((t) => t.id)).toEqual(['todo_b']);
    });

    it('filters by listId', () => {
      const { todos } = todosService.list({ ...baseQuery, listId: 'list_b' });
      expect(todos.map((t) => t.id)).toEqual(['todo_c']);
    });

    it('filters by tagId', () => {
      const { todos } = todosService.list({ ...baseQuery, tagId: 'tag_b' });
      expect(todos.map((t) => t.id)).toEqual(['todo_b']);
    });

    it('filters by free-text search over the title', () => {
      const { todos } = todosService.list({ ...baseQuery, q: 'Completed' });
      expect(todos.map((t) => t.id)).toEqual(['todo_c']);
    });

    it('filters by free-text search over notes', () => {
      const { todos } = todosService.list({ ...baseQuery, q: 'Has notes' });
      expect(todos.map((t) => t.id)).toEqual(['todo_b']);
    });

    it('combines multiple filters', () => {
      const { todos } = todosService.list({ ...baseQuery, status: 'open', listId: 'list_a' });
      expect(todos.map((t) => t.id)).toEqual(['todo_b', 'todo_a']);
    });

    it('paginates results and reports meta', () => {
      const { todos, meta } = todosService.list({ ...baseQuery, pageSize: 2 });
      expect(todos.map((t) => t.id)).toEqual(['todo_c', 'todo_b']);
      expect(meta).toEqual({ total: 2, page: 1, pageSize: 2 });
    });
  });
});
