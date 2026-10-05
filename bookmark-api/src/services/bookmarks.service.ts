import type { Bookmark } from '../types.js';
import { bookmarksRepository } from '../repositories/bookmarks.repository.js';
import { newId } from '../lib/ids.js';
import { ValidationError, NotFoundError } from '../lib/errors.js';

interface CreateBookmarkInput {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

interface UpdateBookmarkInput {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Validation rules for a Bookmark (decided up front, applied by both create and
// update): url is required and must parse as a valid absolute URL; title is required
// and must be non-empty after trimming; tags, if provided, must be an array of
// strings. Duplicate URLs are explicitly ALLOWED (not an error) — a conscious choice,
// not an accident: a user may legitimately want to re-save the same URL under
// different tags.
function assertValidCreateInput(input: CreateBookmarkInput): void {
  if (typeof input.url !== 'string' || !isValidUrl(input.url)) {
    throw new ValidationError('url must be a valid absolute URL');
  }
  if (typeof input.title !== 'string' || input.title.trim().length === 0) {
    throw new ValidationError('title is required and must not be empty');
  }
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags) || !input.tags.every((t) => typeof t === 'string')) {
      throw new ValidationError('tags must be an array of strings');
    }
  }
}

export const bookmarksService = {
  create(input: CreateBookmarkInput): Bookmark {
    assertValidCreateInput(input);
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
  // (an empty string "" clears description, an empty array [] clears tags); a
  // completely empty body is a 200 no-op, not a 400 — it's a valid (if pointless)
  // partial update of zero fields. url/title, if provided, are re-validated with the
  // same rules as create().
  update(id: string, input: UpdateBookmarkInput): Bookmark {
    this.getById(id);

    if (input.url !== undefined && !isValidUrl(input.url)) {
      throw new ValidationError('url must be a valid absolute URL');
    }
    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new ValidationError('title must not be empty');
    }
    if (input.tags !== undefined) {
      if (!Array.isArray(input.tags) || !input.tags.every((t) => typeof t === 'string')) {
        throw new ValidationError('tags must be an array of strings');
      }
    }

    const changes: Partial<Bookmark> = {
      ...(input.url !== undefined && { url: input.url }),
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...('description' in input && { description: input.description || undefined }),
      ...(input.tags !== undefined && { tags: input.tags }),
      updatedAt: new Date().toISOString(),
    };

    return bookmarksRepository.update(id, changes)!;
  },
};
