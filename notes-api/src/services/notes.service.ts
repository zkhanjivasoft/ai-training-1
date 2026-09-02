import type { Note } from '../types.js';
import { notesRepository } from '../repositories/notes.repository.js';
import { newId } from '../lib/ids.js';
import { HttpError } from '../lib/errors.js';

interface CreateNoteInput {
  title: string;
  body: string;
}

export const notesService = {
  list(): Note[] {
    return notesRepository.findAll();
  },
  create(input: CreateNoteInput): Note {
    if (typeof input?.title !== 'string' || typeof input?.body !== 'string') {
      throw new HttpError(400, 'title and body must be strings');
    }

    const title = input.title.trim();
    const body = input.body.trim();

    if (title.length < 1 || title.length > 120) {
      throw new HttpError(400, 'title must be between 1 and 120 characters');
    }
    if (body.length < 1 || body.length > 10000) {
      throw new HttpError(400, 'body must be between 1 and 10000 characters');
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
