import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

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
