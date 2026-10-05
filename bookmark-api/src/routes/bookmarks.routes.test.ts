import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { resetBookmarks } from '../repositories/bookmarks.repository.js';

beforeEach(() => {
  resetBookmarks();
});

describe('POST /bookmarks', () => {
  const app = createApp();

  it('creates a bookmark with valid input', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'Example', tags: ['test'] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.url).toBe('https://example.com');
    expect(res.body.title).toBe('Example');
    expect(res.body.tags).toEqual(['test']);
  });

  it('rejects a malformed URL with 400', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'not-a-url', title: 'Bad URL' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url/i);
  });

  it('rejects an empty title with 400', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('rejects a javascript: URL with 400', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'javascript:alert(1)', title: 'XSS attempt' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url/i);
  });

  it('rejects a non-array tags value with 400', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T', tags: 'not-an-array' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tags/i);
  });

  it('rejects a non-string description with 400', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T', description: { nested: true } });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/description/i);
  });

  it('rejects a missing/non-object body with 400 instead of crashing', async () => {
    const res = await request(app).post('/bookmarks').set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON with 400 instead of crashing', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .set('Content-Type', 'application/json')
      .send('{not valid json');
    expect(res.status).toBe(400);
  });
});

describe('GET /bookmarks', () => {
  const app = createApp();

  it('lists all bookmarks and filters by tag case-insensitively', async () => {
    await request(app)
      .post('/bookmarks')
      .send({ url: 'https://a.com', title: 'A', tags: ['Work'] });
    await request(app).post('/bookmarks').send({ url: 'https://b.com', title: 'B', tags: ['Home'] });

    const all = await request(app).get('/bookmarks');
    expect(all.status).toBe(200);
    expect(all.body).toHaveLength(2);

    const filtered = await request(app).get('/bookmarks?tag=work');
    expect(filtered.status).toBe(200);
    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].url).toBe('https://a.com');
  });

  it('returns an empty array for a tag that matches nothing, not an error', async () => {
    const res = await request(app).get('/bookmarks?tag=does-not-exist');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a repeated ?tag= param with 400 instead of silently ignoring it', async () => {
    const res = await request(app).get('/bookmarks?tag=a&tag=b');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tag/i);
  });
});

describe('GET /bookmarks/:id', () => {
  const app = createApp();

  it('gets a bookmark by id', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'Example' });

    const res = await request(app).get(`/bookmarks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.url).toBe('https://example.com');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/bookmarks/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('PATCH /bookmarks/:id', () => {
  const app = createApp();

  it('applies a partial update, leaving omitted fields unchanged', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'Old title', description: 'desc', tags: ['a'] });

    const res = await request(app)
      .patch(`/bookmarks/${created.body.id}`)
      .send({ title: 'New title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
    expect(res.body.url).toBe('https://example.com'); // unchanged
    expect(res.body.description).toBe('desc'); // unchanged
    expect(res.body.tags).toEqual(['a']); // unchanged
  });

  it('clears description and tags with explicit empty values', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T', description: 'desc', tags: ['a'] });

    const res = await request(app)
      .patch(`/bookmarks/${created.body.id}`)
      .send({ description: '', tags: [] });

    expect(res.status).toBe(200);
    expect(res.body.description).toBeUndefined();
    expect(res.body.tags).toEqual([]);
  });

  it('treats an empty body as a 200 no-op', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const res = await request(app).patch(`/bookmarks/${created.body.id}`).send({});
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('T');
  });

  it('rejects an update with a malformed url with 400', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const res = await request(app)
      .patch(`/bookmarks/${created.body.id}`)
      .send({ url: 'not-a-url' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url/i);
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app).patch('/bookmarks/does-not-exist').send({ title: 'X' });
    expect(res.status).toBe(404);
  });

  it('rejects a non-string title with 400 instead of crashing', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const res = await request(app).patch(`/bookmarks/${created.body.id}`).send({ title: 5 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('rejects a url sent as a non-string (e.g. an array) with 400', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const res = await request(app)
      .patch(`/bookmarks/${created.body.id}`)
      .send({ url: ['https://evil.com'] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/url/i);
  });

  it('rejects a bad tags shape with 400', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const res = await request(app)
      .patch(`/bookmarks/${created.body.id}`)
      .send({ tags: [1, 2] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tags/i);
  });
});

describe('DELETE /bookmarks/:id', () => {
  const app = createApp();

  it('deletes a bookmark and it is gone afterward', async () => {
    const created = await request(app)
      .post('/bookmarks')
      .send({ url: 'https://example.com', title: 'T' });

    const del = await request(app).delete(`/bookmarks/${created.body.id}`);
    expect(del.status).toBe(200);
    expect(del.body).toEqual({ deleted: true });

    const after = await request(app).get(`/bookmarks/${created.body.id}`);
    expect(after.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete('/bookmarks/does-not-exist');
    expect(res.status).toBe(404);
  });
});
