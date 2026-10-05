import type { Bookmark } from '../types.js';
import { bookmarksRepository } from '../repositories/bookmarks.repository.js';
import { newId } from '../lib/ids.js';
import { ValidationError, NotFoundError } from '../lib/errors.js';

interface ValidatedFields {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Only http/https are accepted. Rejecting everything else blocks javascript:/data:/
// file: URLs, which would otherwise be stored and later rendered as a clickable link
// by any client of this API (a stored-XSS vector) — found by the final review pass.
function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidTags(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((t) => typeof t === 'string' && t.trim().length > 0);
}

// Validation rules for a Bookmark (decided up front, shared by create and update so
// the two can never drift): url is required (on create) and must be a valid http(s)
// URL; title is required (on create) and must be non-empty after trimming;
// description, if provided, must be a string; tags, if provided, must be an array of
// non-empty strings. Duplicate URLs are explicitly ALLOWED (not an error) — a
// conscious choice: a user may legitimately want to re-save the same URL under
// different tags.
function assertValidFields(input: unknown): asserts input is ValidatedFields {
  if (!isPlainObject(input)) {
    throw new ValidationError('request body must be a JSON object');
  }
  if (input.url !== undefined && !isValidUrl(input.url)) {
    throw new ValidationError('url must be a valid http(s) URL');
  }
  if (
    input.title !== undefined &&
    (typeof input.title !== 'string' || input.title.trim().length === 0)
  ) {
    throw new ValidationError('title must be a non-empty string');
  }
  if (input.description !== undefined && typeof input.description !== 'string') {
    throw new ValidationError('description must be a string');
  }
  if (input.tags !== undefined && !isValidTags(input.tags)) {
    throw new ValidationError('tags must be an array of non-empty strings');
  }
}

export const bookmarksService = {
  create(input: unknown): Bookmark {
    assertValidFields(input);
    if (input.url === undefined) throw new ValidationError('url is required');
    if (input.title === undefined) throw new ValidationError('title is required');

    const now = new Date().toISOString();
    const bookmark: Bookmark = {
      id: newId(),
      url: input.url,
      title: input.title.trim(),
      description: input.description,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    bookmarksRepository.insert(bookmark);
    return bookmark;
  },

  // Filter semantics (decided up front): a single `tag` value, matched against each
  // bookmark's tags case-insensitively and exactly (not a substring match) — mirrors
  // how notes-api's search() normalizes before comparing. An absent/empty tag returns
  // every bookmark unfiltered.
  list(tag?: string): Bookmark[] {
    const bookmarks = bookmarksRepository.findAll();
    const normalizedTag = tag?.trim().toLowerCase();
    if (!normalizedTag) return bookmarks;
    return bookmarks.filter((b) => b.tags.some((t) => t.toLowerCase() === normalizedTag));
  },

  getById(id: string): Bookmark {
    const bookmark = bookmarksRepository.findById(id);
    if (!bookmark) throw new NotFoundError('Bookmark', id);
    return bookmark;
  },

  // Partial-update semantics (decided up front): a key omitted from the request body
  // leaves that field unchanged; a key present with an explicit value replaces it
  // (an empty string "" clears description; an empty array [] clears tags); a
  // completely empty body is a 200 no-op, not a 400 — it's a valid (if pointless)
  // partial update of zero fields. Every provided field is validated by the exact
  // same assertValidFields() rules create() uses, so the two can't drift apart.
  update(id: string, input: unknown): Bookmark {
    this.getById(id);
    assertValidFields(input);

    const changes: Partial<Bookmark> = {
      ...(input.url !== undefined && { url: input.url }),
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...('description' in input && { description: input.description || undefined }),
      ...(input.tags !== undefined && { tags: input.tags }),
      updatedAt: new Date().toISOString(),
    };

    return bookmarksRepository.update(id, changes)!;
  },

  remove(id: string): void {
    this.getById(id);
    bookmarksRepository.remove(id);
  },
};
