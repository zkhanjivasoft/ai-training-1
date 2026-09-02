import type { Note } from '../types.js';
import { notesRepository } from '../repositories/notes.repository.js';
import { newId } from '../lib/ids.js';

interface CreateNoteInput {
  title: string;
  body: string;
}

export const notesService = {
  list(): Note[] {
    return notesRepository.findAll();
  },
  create(input: CreateNoteInput): Note {
    const title = input.title?.trim() ?? '';
    const body = input.body?.trim() ?? '';

    if (title.length < 1 || title.length > 120) {
      throw new Error('title must be between 1 and 120 characters');
    }
    if (body.length < 1 || body.length > 10000) {
      throw new Error('body must be between 1 and 10000 characters');
    }

    const now = new Date().toISOString();
    const note: Note = {
      id: newId('note'),
      title,
      body,
      createdAt: now,
      updatedAt: now,
    };

    return notesRepository.insert(note);
  },
};
