import { randomUUID } from 'node:crypto';
import type { Note } from '../types.js';
import { notesRepository } from '../repositories/notes.repository.js';

export class ValidationError extends Error {}

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
  create(input: { title?: unknown; body?: unknown }): Note {
    if (typeof input?.title !== 'string' || input.title.trim().length === 0) {
      throw new ValidationError('title must be a non-empty string');
    }
    if (typeof input?.body !== 'string' || input.body.trim().length === 0) {
      throw new ValidationError('body must be a non-empty string');
    }
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: input.title.trim(),
      body: input.body.trim(),
      createdAt: now,
      updatedAt: now,
    };
    return notesRepository.insert(note);
  },
};
