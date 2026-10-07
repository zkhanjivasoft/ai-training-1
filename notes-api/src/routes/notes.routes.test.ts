import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { resetNotes } from '../repositories/notes.repository.js';

beforeEach(() => {
  resetNotes();
});

describe('POST /notes', () => {
  const app = createApp();

  it('creates a note with valid input', async () => {
    const res = await request(app).post('/notes').send({ title: 'T', body: 'B' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.title).toBe('T');
    expect(res.body.body).toBe('B');
  });

  it('rejects an empty title with 400', async () => {
    const res = await request(app).post('/notes').send({ title: '', body: 'B' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('rejects a missing body field with 400', async () => {
    const res = await request(app).post('/notes').send({ title: 'T' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/body/i);
  });

  it('rejects a missing request body with 400 instead of crashing', async () => {
    const res = await request(app).post('/notes').set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });
});
