import type { Note } from '../types.js';
import { notesRepository } from '../repositories/notes.repository.js';

export const notesService = {
  list(): Note[] {
    return notesRepository.findAll();
  },
  search(q: string | undefined): Note[] {
    const notes = notesRepository.findAll();
    const query = q?.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query),
    );
  },
  getById(id: string): Note | undefined {
    return notesRepository.findById(id);
  },
};
