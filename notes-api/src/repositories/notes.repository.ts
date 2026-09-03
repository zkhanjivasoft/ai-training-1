import type { Note } from '../types.js';

const notes: Note[] = [];

export const notesRepository = {
  findAll(): Note[] {
    return notes;
  },
  findById(id: string): Note | undefined {
    return notes.find((n) => n.id === id);
  },
};
