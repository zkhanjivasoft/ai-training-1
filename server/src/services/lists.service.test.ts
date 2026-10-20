import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listsService } from './lists.service';
import { activityService } from './activity.service';
import { ConflictError, NotFoundError } from '../lib/errors';
import { makeTestDb } from '../testing/helpers';

describe('listsService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('lists lists sorted by name', () => {
    expect(listsService.list().map((l) => l.name)).toEqual(['Alpha', 'Beta']);
  });

  it('throws NotFoundError for a missing list', () => {
    expect(() => listsService.getById('list_nope')).toThrow(NotFoundError);
  });

  it('creates a list and records activity', () => {
    const list = listsService.create({ name: 'Gamma', description: 'Third' });
    expect(list.id).toMatch(/^list_/);
    expect(listsService.getById(list.id).description).toBe('Third');
    const feed = activityService.list({ entityId: list.id, limit: 10 });
    expect(feed[0]?.action).toBe('created');
    expect(feed[0]?.entityType).toBe('list');
    expect(feed[0]?.entityTitle).toBe('Gamma');
  });

  it('updates a list and records activity', () => {
    expect(listsService.update('list_b', { name: 'Renamed' }).name).toBe('Renamed');
    const feed = activityService.list({ entityId: 'list_b', limit: 10 });
    expect(feed[0]?.action).toBe('updated');
    expect(feed[0]?.entityTitle).toBe('Renamed');
  });

  it('refuses to remove a list that still has todos', () => {
    expect(() => listsService.remove('list_a')).toThrow(ConflictError);
  });

  it('removes an empty list after its todos are gone and records activity', () => {
    const list = listsService.create({ name: 'Empty' });
    listsService.remove(list.id);
    expect(() => listsService.getById(list.id)).toThrow(NotFoundError);
    // Uses .find(), not feed[0]: this list is created and deleted back-to-back in this
    // same test, so their timestamps can tie at millisecond resolution — toSorted()'s
    // stability would then keep 'created' first. (The analogous todos test can safely
    // use feed[0] because it deletes a pre-seeded fixture item with a fixed, much older
    // timestamp, so there's no tie there.)
    const feed = activityService.list({ entityId: list.id, limit: 10 });
    expect(feed.find((entry) => entry.action === 'deleted')).toMatchObject({
      entityType: 'list',
      entityTitle: 'Empty',
    });
  });
});
