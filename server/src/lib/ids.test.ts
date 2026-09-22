import { describe, expect, it } from 'vitest';
import { newId } from './ids';

describe('newId', () => {
  it('produces a "tag_" + 8 lowercase hex chars id, 12 chars total', () => {
    const id = newId('tag');
    expect(id).toMatch(/^tag_[0-9a-f]{8}$/);
    expect(id).toHaveLength(12);
  });

  it('produces a "todo_" + 8 lowercase hex chars id, 13 chars total', () => {
    const id = newId('todo');
    expect(id).toMatch(/^todo_[0-9a-f]{8}$/);
    expect(id).toHaveLength(13);
  });

  // The suffix is 8 hex chars (32 bits) sliced from a UUID, so collision probability
  // is negligible at this sample size (~4.6e-6 for n=200) but would not be at, say,
  // n=100,000 — keep this sample bounded rather than scaling it up.
  it('produces 200 unique ids across 200 calls with the same prefix', () => {
    const ids = Array.from({ length: 200 }, () => newId('tag'));
    expect(new Set(ids).size).toBe(200);
  });

  // Edge case (boundary/empty input): an empty-string prefix isn't special-cased —
  // the function just concatenates, producing a leading-underscore id.
  it('does not special-case an empty-string prefix', () => {
    const id = newId('');
    expect(id).toMatch(/^_[0-9a-f]{8}$/);
    expect(id).toHaveLength(9);
  });

  // Edge case (unusual-but-valid input): a prefix that itself contains an underscore
  // should still just concatenate, not be rejected or split unexpectedly.
  it('does not treat an underscore inside the prefix specially', () => {
    const id = newId('sub_task');
    expect(id).toMatch(/^sub_task_[0-9a-f]{8}$/);
    expect(id).toHaveLength(17);
  });
});
