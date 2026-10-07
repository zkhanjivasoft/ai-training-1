import type { Note } from '../types.js';

const notes: Note[] = [];

export const notesRepository = {
  findAll(): Note[] {
    return notes;
  },
  findById(id: string): Note | undefined {
    return notes.find((n) => n.id === id);
  },
  insert(note: Note): Note {
    notes.push(note);
    return note;
  },
};

/** Test-only hook: clears the in-memory store between tests. */
export function resetNotes(): void {
  notes.length = 0;
}
