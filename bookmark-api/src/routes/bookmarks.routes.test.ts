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
});
