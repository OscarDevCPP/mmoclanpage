/** Logical content for the Compendio. Text offsets are UTF-16 code units, as in DOM Range. */
export type InlineMark =
  | { readonly kind: 'emphasis' }
  | { readonly kind: 'strong' }
  | { readonly kind: 'link'; readonly href: string };

export interface InlineRun {
  readonly text: string;
  readonly marks: readonly InlineMark[];
}

export type BookBlock =
  | { readonly kind: 'heading'; readonly id: string; readonly level: 2 | 3; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'paragraph'; readonly id: string; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'list'; readonly id: string; readonly ordered: boolean; readonly items: readonly BookListItem[] }
  | { readonly kind: 'diagram'; readonly id: string; readonly description: string };

export interface BookListItem {
  readonly id: string;
  readonly runs: readonly InlineRun[];
  /** Original ordinal, retained when an ordered list continues on another leaf. */
  readonly ordinal?: number;
}

export interface BookSection {
  readonly id: string;
  readonly blocks: readonly BookBlock[];
}

export interface BookPosition {
  readonly section: string;
  readonly block: string;
  readonly offset: number;
}

/** Split without changing text or marks; callers choose a safe word/grapheme boundary. */
export function splitRuns(runs: readonly InlineRun[], offset: number): [InlineRun[], InlineRun[]] {
  const length = runs.reduce((sum, run) => sum + run.text.length, 0);
  if (!Number.isInteger(offset) || offset < 0 || offset > length) {
    throw new RangeError('Invalid text offset');
  }
  const before: InlineRun[] = [];
  const after: InlineRun[] = [];
  let remaining = offset;
  for (const run of runs) {
    const cut = Math.min(remaining, run.text.length);
    if (cut > 0) before.push({ ...run, text: run.text.slice(0, cut) });
    if (cut < run.text.length) after.push({ ...run, text: run.text.slice(cut) });
    remaining -= cut;
  }
  return [before, after];
}
