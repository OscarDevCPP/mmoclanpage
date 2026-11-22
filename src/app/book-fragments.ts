import { splitRuns, type BookBlock, type BookPosition, type BookSection, type InlineRun } from './book-content';

export interface BookFragment {
  readonly section: string;
  readonly block: string;
  /** UTF-16 offsets within the paragraph or list item. */
  readonly start: number;
  readonly end: number;
  readonly kind: 'heading' | 'paragraph' | 'item' | 'diagram';
  readonly runs: readonly InlineRun[];
  readonly level?: 2 | 3;
  readonly ordered?: boolean;
  readonly ordinal?: number;
  readonly itemId?: string;
  readonly description?: string;
}
export interface BookLeaf { readonly section: string; readonly fragments: readonly BookFragment[]; readonly position: BookPosition }

const size = (runs: readonly InlineRun[]) => runs.reduce((n, run) => n + run.text.length, 0);
function fragments(section: string, block: BookBlock): BookFragment[] {
  if (block.kind === 'diagram') return [{ section, block: block.id, start: 0, end: 0, kind: 'diagram', runs: [], description: block.description }];
  if (block.kind === 'list') return block.items.map(item => ({ section, block: block.id, itemId: item.id, start: 0, end: size(item.runs), kind: 'item', runs: item.runs, ordered: block.ordered, ordinal: item.ordinal }));
  return [{ section, block: block.id, start: 0, end: size(block.runs), kind: block.kind, runs: block.runs, ...(block.kind === 'heading' ? { level: block.level } : {}) }];
}
export function sectionFragments(section: BookSection): BookFragment[] {
  return section.blocks.flatMap(block => fragments(section.id, block));
}

/** Candidate UTF-16 offsets; Segmenter never splits surrogate pairs or grapheme clusters. */
function boundaries(value: string, granularity: 'word' | 'grapheme'): number[] {
  const segmenter = new Intl.Segmenter('es', { granularity });
  return Array.from(segmenter.segment(value), part => part.index + part.segment.length).filter(offset => offset < value.length);
}

/**
 * The caller renders each candidate using the same Angular renderer and measures the final
 * leaf. `fits` must check both axes, including the last rendered fragment. Never use a
 * sum of estimated heights. Rejecting an indivisible fragment is an explicit failure.
 */
export async function paginateSections(
  sections: readonly BookSection[],
  fits: (fragments: readonly BookFragment[]) => Promise<boolean>,
): Promise<BookLeaf[]> {
  const leaves: BookLeaf[] = [];
  for (const section of sections) {
    const queue = sectionFragments(section);
    let current: BookFragment[] = [];
    const flush = () => {
      if (!current.length) return;
      const first = current[0];
      leaves.push({ section: section.id, fragments: current, position: { section: section.id, block: first.itemId ?? first.block, offset: first.start } });
      current = [];
    };
    while (queue.length) {
      const fragment = queue.shift()!;
      if (await fits([...current, fragment])) {
        // Keep a heading with at least the beginning of its next block where possible.
        if (fragment.kind === 'heading' && queue.length && current.length && !(await fits([...current, fragment, queue[0]]))) {
          flush();
        }
        current.push(fragment);
        continue;
      }
      const splittable = fragment.kind === 'paragraph' || fragment.kind === 'item';
      // Keep complete blocks together unless the block itself is oversized, or a
      // partial block is needed to avoid leaving a heading alone on its leaf.
      const keepHeading = current.at(-1)?.kind === 'heading';
      if (current.length && (!splittable || (!keepHeading && await fits([fragment])))) {
        flush(); queue.unshift(fragment); continue;
      }
      if (!splittable) throw new Error(`Indivisible book block does not fit: ${fragment.block}`);
      const text = fragment.runs.map(run => run.text).join('');
      let cut = 0;
      for (const granularity of ['word', 'grapheme'] as const) {
        const candidates = boundaries(text, granularity);
        let low = 0, high = candidates.length - 1;
        while (low <= high) {
          const middle = Math.floor((low + high) / 2);
          const offset = candidates[middle];
          const [left] = splitRuns(fragment.runs, offset);
          if (await fits([...current, { ...fragment, runs: left, end: fragment.start + offset }])) { cut = offset; low = middle + 1; }
          else high = middle - 1;
        }
        if (cut) break;
      }
      if (!cut && current.length) { flush(); queue.unshift(fragment); continue; }
      if (!cut) throw new Error(`Minimum text fragment does not fit: ${fragment.itemId ?? fragment.block}`);
      const [left, right] = splitRuns(fragment.runs, cut);
      current.push({ ...fragment, runs: left, end: fragment.start + cut });
      flush();
      queue.unshift({ ...fragment, runs: right, start: fragment.start + cut });
    }
    flush();
  }
  return leaves;
}
