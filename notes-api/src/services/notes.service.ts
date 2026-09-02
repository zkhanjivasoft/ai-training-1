import type { Note } from '../types.js';
import { notesRepository } from '../repositories/notes.repository.js';

export const notesService = {
  list(): Note[] {
    return notesRepository.findAll();
  },
};
