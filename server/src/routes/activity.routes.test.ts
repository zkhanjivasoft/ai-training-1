import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { makeTestDb } from '../testing/helpers';

describe('activity routes', () => {
  let db: ReturnType<typeof makeTestDb>;
  const app = createApp();

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('GET /api/activity returns entries in the data envelope', async () => {
    const res = await request(app).get('/api/activity');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('entityType');
  });

  it('GET /api/activity?entityId= filters to that entity', async () => {
    const res = await request(app).get('/api/activity?entityId=todo_a');
    expect(res.status).toBe(200);
    expect(res.body.data.every((e: { entityId: string }) => e.entityId === 'todo_a')).toBe(true);
  });

  it('GET /api/activity?limit=0 returns 400 validation error', async () => {
    const res = await request(app).get('/api/activity?limit=0');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/activity?todoId= (the old param name) returns 400, not a silent unfiltered feed', async () => {
    const res = await request(app).get('/api/activity?todoId=todo_a');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
