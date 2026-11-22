import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import type { BookSection } from './book-content';

/** Preserve the original illustration only at its legible native size; otherwise the
 * equivalent marked paragraph may flow over leaves rather than being clipped. */
export function adaptDiagrams(sections: readonly BookSection[], width: number, height: number, rootSize: number): readonly BookSection[] {
  if (width >= 270 && height >= 220 && rootSize <= 20) return sections;
  return sections.map(section => ({ ...section, blocks: section.blocks.map(block => block.kind === 'diagram'
    ? { kind: 'paragraph' as const, id: block.id, runs: [{ text: block.description, marks: [] }] }
    : block) }));
}
import { paginateSections, type BookFragment, type BookLeaf } from './book-fragments';
import { BookRenderer } from './book-renderer';

/** Mounted by the book while paginating; not display:none so the browser performs layout. */
@Component({
  selector: 'app-book-measure',
  imports: [BookRenderer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="book-measure" aria-hidden="true" inert><div #surface class="book-reading" [style.width.px]="width()" [style.height.px]="height()"><app-book-renderer [fragments]="candidate()" /></div></div>`,
  styles: `
    .book-measure { position: fixed; left: -100000px; top: 0; pointer-events: none; }
    .book-reading { --book-line: 1.65rem; display: flow-root; box-sizing: border-box; font: 1.125rem/var(--book-line) Verdana, sans-serif; text-align: left; background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--book-line) - 1px), #b5a58a calc(var(--book-line) - 1px), #b5a58a var(--book-line)); }
    .book-reading h2, .book-reading h3, .book-reading p, .book-reading ol, .book-reading ul { margin: 0 0 var(--book-line); line-height: var(--book-line); }
    .book-reading h2 { font-family: inherit; text-transform: none; border: 0; padding: 0; font-size: 1.2em; line-height: var(--book-line); }
    .book-reading h3 { font-size: 1.08em; }
    .book-reading ol, .book-reading ul { padding-left: 1.5em; margin-bottom: 0; }
    /* Reading targets receive programmatic focus; interactive links keep their focus ring. */
    .book-reading :is(h2,h3,p,li)[tabindex="-1"]:focus { outline: none; }
    .book-reading .book-item-continuation { list-style-type: none; }
    .book-reading h3[data-logical-block^="pvp-"] { padding-inline-start: .5em; }
    .book-reading .book-tree { padding-left: .5em; }
    .book-reading .book-tree-branch { list-style: none; }
    .book-reading .book-diagram { display: block; width: min(100%, 300px); height: auto; margin: 0 auto var(--book-line); fill: #e5d1a6; stroke: #805d3c; stroke-width: 2; }
    .book-reading .book-diagram text { fill: #30241c; stroke: none; text-anchor: middle; font: 16px Georgia, serif; }
    .book-reading .diagram-description { border-inline-start: 4px solid #805d3c; padding-inline-start: .5em; }
  `,
})
export class BookMeasure {
  readonly width = signal(0);
  readonly height = signal(0);
  readonly candidate = signal<readonly BookFragment[]>([]);
  private readonly surface = viewChild.required<ElementRef<HTMLElement>>('surface');
  private readonly changeDetector = inject(ChangeDetectorRef);

  async paginate(sections: readonly BookSection[], width: number, height: number, cancelled: () => boolean = () => false): Promise<BookLeaf[]> {
    if (width <= 0 || height <= 0) throw new RangeError('Book measurement surface must have a positive size');
    const document = this.surface().nativeElement.ownerDocument;
    await document.fonts.ready;
    this.width.set(width); this.height.set(height);
    const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const adapted = adaptDiagrams(sections, width, height, rootSize);
    return paginateSections(adapted, async fragments => {
      if (cancelled()) throw new Error('Book pagination superseded');
      this.candidate.set(fragments);
      this.changeDetector.detectChanges();
      const element = this.surface().nativeElement;
      const box = element.getBoundingClientRect();
      const childrenFit = Array.from(element.querySelectorAll('h2,h3,p,ol,ul,li,a,svg')).every(child => {
        const rect = child.getBoundingClientRect();
        return rect.top >= box.top - 0.5 && rect.left >= box.left - 0.5 && rect.bottom <= box.bottom + 0.5 && rect.right <= box.right + 0.5;
      });
      return childrenFit && element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth;
    });
  }
}
