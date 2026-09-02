/** Truncate a string to maxLength characters at the nearest word boundary, appending an ellipsis if it was cut. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${base.trimEnd()}…`;
}
