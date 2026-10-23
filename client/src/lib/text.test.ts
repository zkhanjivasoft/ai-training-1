import { describe, it, expect } from 'vitest';
import { truncate } from './text';

describe('truncate', () => {
  it('returns the text unchanged when shorter than maxLength', () => {
    expect(truncate('hello world', 50)).toBe('hello world');
  });

  it('returns the text unchanged when exactly maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates at the nearest word boundary and appends an ellipsis', () => {
    expect(truncate('the quick brown fox jumps', 13)).toBe('the quick…');
  });

  it('keeps the whole slice when there is no space to break on', () => {
    expect(truncate('supercalifragilisticexpialidocious', 10)).toBe('supercalif…');
  });

  it('trims trailing whitespace left at the cut point before adding the ellipsis', () => {
    expect(truncate('hello   world', 8)).toBe('hello…');
  });

  it('returns just an ellipsis when maxLength is 0', () => {
    expect(truncate('hello world', 0)).toBe('…');
  });

  it('returns an empty string unchanged', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('does not strip a leading space when the only space is at index 0', () => {
    expect(truncate(' abcdefgh', 5)).toBe(' abcd…');
  });

  // Regression test: the "already fits" guard was once accidentally changed from
  // `<=` to `<`, which made a string exactly at maxLength fall through into the
  // truncation branch and get a spurious ellipsis appended (e.g. 'world' at
  // maxLength 5 became 'world…' instead of staying 'world'), even though nothing
  // was actually cut. Covers the same boundary as the "exactly maxLength" test
  // above with an independent example, specifically to guard against this defect.
  it('regression: does not append an ellipsis when text length exactly equals maxLength', () => {
    expect(truncate('world', 5)).toBe('world');
  });
});
