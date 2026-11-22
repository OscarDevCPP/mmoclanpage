import { afterNextRender, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, InjectionToken, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Book, CreateBookOptions } from '@openpageflip/core';
import { BOOK_GUIDE } from './book-guide';
import { BOOK_INDEX } from './book-index';
import { BookMeasure } from './book-measure';
import { BookRenderer } from './book-renderer';
import { sectionFragments, type BookLeaf } from './book-fragments';
import type { BookPosition } from './book-content';

type BookModule = { createBook: (root: HTMLElement, options: CreateBookOptions) => Book };
export const BOOK_LOADER = new InjectionToken<() => Promise<BookModule>>('resource book loader', { factory: () => () => import('@openpageflip/core') });
const DEDICATION = { id: 'dedicatoria', blocks: [{ kind: 'paragraph' as const, id: 'dedicatoria-texto', runs: [{ text: '«Recopilación de conocimientos prácticos con mucho cariño para la comunidad»', marks: [] }] }] };
const SECTIONS = [DEDICATION, BOOK_INDEX, ...BOOK_GUIDE];
const STATE_KEY = 'compendioPosition';

@Component({
  selector: 'app-resources-book', imports: [RouterLink, BookMeasure, BookRenderer],
  templateUrl: './resources-book.html', styleUrl: './resources-book.css',
  host: { '(window:keydown)': 'key($event)', '(window:popstate)': 'restore()', '(window:hashchange)': 'restore()', '(window:resize)': 'schedule()', '(window:orientationchange)': 'schedule()' },
})
export class ResourcesBook {
  readonly replay = output<void>();
  readonly ready = signal(false);
  readonly current = signal(0);
  readonly pageCount = signal(0);
  readonly draft = signal<readonly BookLeaf[]>([]);
  readonly document = SECTIONS.map(section => ({ id: section.id, fragments: sectionFragments(section) }));
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly leafSource = viewChild.required<ElementRef<HTMLElement>>('leafSource');
  private readonly fontProbe = viewChild.required<ElementRef<HTMLElement>>('fontProbe');
  private readonly measure = viewChild.required(BookMeasure);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly load = inject(BOOK_LOADER);
  private module?: BookModule;
  private book?: Book;
  private pages: HTMLElement[] = [];
  private leaves: readonly BookLeaf[] = [];
  private observer?: ResizeObserver;
  private generation = 0;
  private turnGeneration = 0;
  private measuring = false;
  private scheduled = false;
  private pendingPosition?: BookPosition;
  private activePosition?: BookPosition;
  private touch?: { x: number; y: number };

  constructor() {
    afterNextRender(() => { void this.init(); });
    this.destroyRef.onDestroy(() => { this.generation++; this.turnGeneration++; this.observer?.disconnect(); this.book?.destroy(); this.book = undefined; });
  }
  private async init() {
    try {
      this.module = await this.load();
      if (this.destroyRef.destroyed) return;
      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(() => this.schedule());
        this.observer.observe(this.stage().nativeElement);
        this.observer.observe(this.fontProbe().nativeElement);
      }
      this.schedule();
    } catch (error) { if (!this.destroyRef.destroyed) console.error('No se pudo iniciar el libro; el contenido sigue disponible.', error); }
  }
  schedule() {
    if (!this.module || this.destroyRef.destroyed) return;
    this.generation++;
    if (this.scheduled || this.measuring) return;
    this.scheduled = true;
    requestAnimationFrame(() => { this.scheduled = false; void this.repaginate(); });
  }
  private async repaginate() {
    if (this.measuring || !this.module || this.destroyRef.destroyed) return;
    this.measuring = true;
    const generation = this.generation;
    try {
      const stage = this.stage().nativeElement;
      // Match OpenPageFlip's stretch/auto layout and the eight-pixel page inset.
      const w = stage.clientWidth, h = stage.clientHeight;
      const pageWidth = Math.min(w < 580 ? w : w / 2, h * 440 / 650);
      const pageHeight = pageWidth * 650 / 440;
      const horizontalPadding = w < 580 ? 96 : 16;
      // Account for subpixel rounding between the measurement box and transformed leaf.
      const leaves = await this.measure().paginate(SECTIONS, Math.floor(pageWidth - horizontalPadding) - 2, Math.floor(pageHeight - 68) - 2, () => generation !== this.generation || this.destroyRef.destroyed);
      if (generation !== this.generation || this.destroyRef.destroyed) return;
      const position = this.pendingPosition ?? this.activePosition ?? this.statePosition() ?? this.positionForHash(location.hash.slice(1));
      this.draft.set(leaves);
      this.detector.detectChanges();
      const elements = Array.from(this.leafSource().nativeElement.children, element => element.cloneNode(true) as HTMLElement);
      const oldPages = this.pages;
      const active = stage.ownerDocument.activeElement;
      const restoreFocus = oldPages.some(page => page.contains(active));
      const focusInitialAnchor = !this.ready() && !!location.hash && (active === stage.ownerDocument.body || !active);
      const nextIndex = this.findPosition(position, leaves);
      this.turnGeneration++;
      if (!this.book) {
        stage.replaceChildren(...elements);
        this.book = this.module.createBook(stage, { width: 440, height: 650, minWidth: 290, maxWidth: 2000, autoSize: false, size: 'stretch', cover: true, startPage: nextIndex, flipDuration: 450, click: 'off', hover: false, drag: false, swipe: false });
        this.book.on('changeOrientation', () => { if (!this.destroyRef.destroyed) this.schedule(); });
      } else {
        this.book.setPages(elements);
        oldPages.forEach(page => page.remove());
        this.book.update();
        this.book.turnTo(nextIndex);
      }
      this.pages = elements; this.leaves = leaves; this.pageCount.set(elements.length); this.current.set(nextIndex);
      this.pendingPosition = undefined; this.activePosition = position; this.ready.set(true); this.refresh();
      if (restoreFocus || focusInitialAnchor) this.focusPosition(nextIndex, position);
      this.replacePosition(position);
    } catch (error) {
      if (generation === this.generation && !this.destroyRef.destroyed) console.error('No se pudo paginar el libro; se conserva la última edición válida.', error);
    } finally {
      this.measuring = false;
      if (generation !== this.generation && !this.destroyRef.destroyed) this.schedule();
    }
  }
  private positionAt(index: number): BookPosition {
    if (index <= 0) return { section: 'cubierta', block: 'cubierta', offset: 0 };
    return this.leaves[index - 1]?.position ?? { section: 'final', block: 'final', offset: 0 };
  }
  private positionForHash(hash: string): BookPosition {
    if (hash.startsWith('pvp-alfabetico')) hash = 'pvp';
    if (!hash) hash = 'cubierta';
    const section = SECTIONS.find(s => s.id === hash || s.blocks.some(block => block.id === hash));
    return { section: section?.id ?? hash, block: hash, offset: 0 };
  }
  private statePosition(): BookPosition | undefined {
    const value = history.state?.[STATE_KEY];
    return history.state?.compendioHash === decodeURIComponent(location.hash.slice(1)) && value && typeof value.section === 'string' && typeof value.block === 'string' && Number.isSafeInteger(value.offset) && value.offset >= 0 ? value as BookPosition : undefined;
  }
  private findPosition(position: BookPosition, leaves = this.leaves): number {
    if (position.section === 'cubierta') return 0;
    if (position.section === 'final') return leaves.length + 1;
    const found = leaves.findIndex(leaf => leaf.section === position.section && leaf.fragments.some(f => (f.itemId ?? f.block) === position.block && position.offset >= f.start && (position.offset < f.end || f.start === f.end)));
    if (found >= 0) return found + 1;
    const section = leaves.findIndex(leaf => leaf.section === position.section);
    return section < 0 ? 0 : section + 1;
  }
  private replacePosition(position: BookPosition) { history.replaceState({ ...history.state, [STATE_KEY]: position, compendioHash: decodeURIComponent(location.hash.slice(1)) }, '', location.href); }
  private visible(): number[] {
    const index = this.current();
    if (this.book?.orientation !== 'landscape' || index === 0 || index === this.pageCount() - 1) return [index];
    const first = index % 2 === 0 ? index - 1 : index;
    return [first, first + 1].filter(i => i < this.pageCount());
  }
  private refresh() { const shown = this.visible(); this.pages.forEach((page, index) => { page.inert = !shown.includes(index); }); }
  private focusPosition(index: number, position: BookPosition) {
    const page = this.pages[index];
    if (!page) return;
    const exact = Array.from(page.querySelectorAll<HTMLElement>('[data-logical-block]')).find(node => node.dataset['logicalBlock'] === position.block);
    (exact ?? page.querySelector<HTMLElement>('h2,h3,p[tabindex],li[tabindex],svg[tabindex]'))?.focus({ preventScroll: true });
  }
  async go(index: number, addHistory = true, hash?: string, requestedPosition?: BookPosition) {
    if (!this.book) return;
    index = Math.max(0, Math.min(this.pages.length - 1, index));
    const position = requestedPosition ?? this.positionAt(index);
    this.pendingPosition = position;
    if (addHistory) {
      const target = hash ?? position.section;
      // A fragment-only URL resolves against <base href>, which can point to the
      // site root rather than the current route. Preserve both route and query.
      history.pushState({ ...history.state, [STATE_KEY]: position, compendioHash: target }, '', `${location.pathname}${location.search}#${encodeURIComponent(target)}`);
    }
    const book = this.book, token = ++this.turnGeneration;
    try {
      await book.flipTo(index);
      if (this.destroyRef.destroyed || token !== this.turnGeneration || this.book !== book) return;
      book.turnTo(index); this.current.set(index); this.pendingPosition = undefined; this.activePosition = position; this.refresh();
      this.focusPosition(index, position);
    } catch (error) { if (!this.destroyRef.destroyed) console.error('No se pudo pasar la página.', error); }
  }
  goHash(hash: string) { const pos = this.positionForHash(hash); void this.go(this.findPosition(pos), true, hash, pos); }
  move(direction: number) { const shown = this.visible(); void this.go(direction > 0 ? shown[shown.length - 1] + 1 : shown[0] - 1); }
  restore() { if (!this.ready()) return; const pos = this.statePosition() ?? this.positionForHash(location.hash.slice(1)); void this.go(this.findPosition(pos), false, undefined, pos); }
  link(event: MouseEvent) {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    event.preventDefault(); this.goHash(decodeURIComponent(link.hash.slice(1)));
  }
  key(event: KeyboardEvent) {
    if (!this.ready() || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    if ((event.target as HTMLElement | null)?.closest('a,button,input,textarea,select,[contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); this.move(event.key === 'ArrowRight' ? 1 : -1); }
  }
  touchStart(event: TouchEvent) {
    if (event.touches.length !== 1 || (event.target as Element).closest('.page-inner,a,button')) return;
    this.touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  touchEnd(event: TouchEvent) {
    if (!this.touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - this.touch.x, dy = event.changedTouches[0].clientY - this.touch.y; this.touch = undefined;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && !window.getSelection()?.toString()) this.move(dx < 0 ? 1 : -1);
  }
  touchCancel() { this.touch = undefined; }
}
