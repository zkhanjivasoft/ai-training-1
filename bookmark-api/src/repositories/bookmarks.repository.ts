import type { Bookmark } from '../types.js';

const bookmarks: Bookmark[] = [];

/** Test-only hook: clears the in-memory store between tests. */
export function resetBookmarks(): void {
  bookmarks.length = 0;
}

export const bookmarksRepository = {
  findAll(): Bookmark[] {
    return bookmarks;
  },
  findById(id: string): Bookmark | undefined {
    return bookmarks.find((b) => b.id === id);
  },
  insert(bookmark: Bookmark): Bookmark {
    bookmarks.push(bookmark);
    return bookmark;
  },
  update(id: string, changes: Partial<Bookmark>): Bookmark | undefined {
    const found = bookmarks.find((b) => b.id === id);
    if (!found) return undefined;
    Object.assign(found, changes);
    return found;
  },
  remove(id: string): boolean {
    const before = bookmarks.length;
    const filtered = bookmarks.filter((b) => b.id !== id);
    bookmarks.length = 0;
    bookmarks.push(...filtered);
    return bookmarks.length < before;
  },
};
