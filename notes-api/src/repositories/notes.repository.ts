import type { Note } from '../types.js';

const notes: Note[] = [];

export const notesRepository = {
  findAll(): Note[] {
    return notes;
  },
  insert(note: Note): Note {
    notes.push(note);
    return note;
  },
};
