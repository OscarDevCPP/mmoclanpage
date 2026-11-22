import { afterNextRender, Component, DestroyRef, ElementRef, inject, InjectionToken, Injector, output, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Book, CreateBookOptions } from '@openpageflip/core';
import { PVP_TOPICS, PVP_ALPHABETICAL } from './pvp-catalog';

type BookModule = { createBook: (root: HTMLElement, options: CreateBookOptions) => Book };
export const BOOK_LOADER = new InjectionToken<() => Promise<BookModule>>('resource book loader', {
  factory: () => () => import('@openpageflip/core'),
});

@Component({
  selector: 'app-resources-book',
  imports: [RouterLink],
  templateUrl: './resources-book.html',
  styleUrl: './resources-book.css',
  host: { '(window:keydown)': 'key($event)', '(window:popstate)': 'restore()', '(window:hashchange)': 'restore()', '(window:resize)': 'updateScrollRegions()' },
})
export class ResourcesBook {
  readonly replay = output<void>();
  readonly ready = signal(false);
  readonly current = signal(0);
  readonly busy = signal(false);
  readonly pageCount = signal(0);
  readonly levels = [
    { id: 'pvp-basico', label: 'Básico', topics: PVP_TOPICS.filter(t => t.level === 'básico') },
    { id: 'pvp-intermedio', label: 'Intermedio', topics: PVP_TOPICS.filter(t => t.level === 'intermedio') },
    { id: 'pvp-avanzado', label: 'Avanzado', topics: PVP_TOPICS.filter(t => t.level === 'avanzado') },
  ];
  readonly alphabetPages = [
    { id: 'pvp-alfabetico', label: 'A–F', topics: PVP_ALPHABETICAL.slice(0, 8) },
    { id: 'pvp-alfabetico-2', label: 'G–M', topics: PVP_ALPHABETICAL.slice(8, 16) },
    { id: 'pvp-alfabetico-3', label: 'M–W', topics: PVP_ALPHABETICAL.slice(16) },
  ];
  private ids: string[] = [];
  private readonly source = viewChild.required<ElementRef<HTMLElement>>('source');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly load = inject(BOOK_LOADER);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private book: Book | undefined;
  private pages: HTMLElement[] = [];
  private pending: number | undefined;
  private turningTarget: number | undefined;
  private scrollObserver: ResizeObserver | undefined;
  private touch: { x: number; y: number } | undefined;

  constructor() {
    // The engine receives clones in an otherwise empty, Angular-unmanaged container.
    // Angular keeps the original SSR document as a readable failure/no-JS fallback.
    afterNextRender(() => { void this.init(); });
    this.destroyRef.onDestroy(() => { this.scrollObserver?.disconnect(); this.book?.destroy(); this.book = undefined; });
  }
  private async init() {
    try {
      const module = await this.load();
      if (this.destroyRef.destroyed) return;
      const root = this.stage().nativeElement;
      const originals = Array.from(this.source().nativeElement.children) as HTMLElement[];
      this.ids = originals.map(el => el.id);
      this.pageCount.set(this.ids.length);
      this.pages = originals.map(el => {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.removeAttribute('id');
        return clone;
      });
      root.replaceChildren(...this.pages);
      const start = this.hashIndex();
      this.book = module.createBook(root, { width: 440, height: 650, minWidth: 290, maxWidth: 2000, autoSize: false, size: 'stretch', cover: true, startPage: start, flipDuration: 450, click: 'off', hover: false, drag: false, swipe: false });
      this.current.set(start);
      this.book.on('changeOrientation', () => {
        if (this.destroyRef.destroyed || !this.book) return;
        // The motor normalizes landscape spreads to their first page and reopens
        // that page on resize. Restore the requested logical page, not book.page.
        const target = this.turningTarget ?? this.current();
        const focused = this.stage().nativeElement.ownerDocument.activeElement;
        const focusedPage = this.pages.findIndex(page => page.contains(focused));
        this.book.turnTo(target);
        this.current.set(target);
        this.refresh();
        if (focusedPage >= 0 && !this.visible().includes(focusedPage)) {
          this.pages[target]?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
        }
      });
      this.ready.set(true);
      if (typeof ResizeObserver !== 'undefined') {
        this.scrollObserver = new ResizeObserver(() => this.updateScrollRegions());
        this.pages.forEach(page => { const inner = page.querySelector('.page-inner'); if (inner) this.scrollObserver?.observe(inner); });
      }
      this.refresh();
      afterNextRender(() => {
        if (!this.destroyRef.destroyed && this.ready()) this.pages[start]?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
      }, { injector: this.injector });
    } catch (error) {
      // A partially initialised engine is discarded with its private root; fallback stays visible.
      if (!this.destroyRef.destroyed) {
        this.book?.destroy(); this.book = undefined;
        this.stage().nativeElement.replaceChildren();
        this.source().nativeElement.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
        console.error('No se pudo iniciar el libro; el contenido sigue disponible.', error);
      }
    }
  }
  private hashIndex(): number { return Math.max(0, this.ids.indexOf(window.location.hash.slice(1))); }
  private visible(): number[] {
    const index = this.current();
    if (this.book?.orientation !== 'landscape' || index === 0 || index === this.ids.length - 1) return [index];
    const first = index % 2 === 0 ? index - 1 : index;
    return [first, first + 1];
  }
  updateScrollRegions() {
    this.pages.forEach(page => {
      const inner = page.querySelector<HTMLElement>('.page-inner');
      if (!inner) return;
      if (inner.clientHeight > 0 && inner.scrollHeight > inner.clientHeight + 1) {
        inner.tabIndex = 0;
        inner.setAttribute('role', 'region');
        inner.setAttribute('aria-label', page.querySelector('h2')?.textContent?.trim() || 'Contenido de la página');
      } else { inner.removeAttribute('tabindex'); inner.removeAttribute('role'); inner.removeAttribute('aria-label'); }
    });
  }
  private refresh() {
    const shown = this.visible();
    this.pages.forEach((page, i) => { page.inert = !shown.includes(i); });
    this.updateScrollRegions();
  }
  async go(index: number, history = true) {
    if (!this.book) return;
    index = Math.max(0, Math.min(this.ids.length - 1, index));
    if (history && this.router.parseUrl(this.router.url).fragment !== this.ids[index]) {
      void this.router.navigate([], { relativeTo: this.route, fragment: this.ids[index], queryParamsHandling: 'preserve' });
    }
    if (this.busy()) { this.pending = index; return; }
    this.busy.set(true);
    this.turningTarget = index;
    try {
      await this.book.flipTo(index);
      if (this.destroyRef.destroyed || !this.book) return;
      // A resize can cancel a flip even without changing orientation. Ensure the
      // requested spread is displayed before updating logical state and inert.
      this.book.turnTo(index);
      this.current.set(index); this.refresh();
      this.pages[index]?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    } catch (error) {
      if (!this.destroyRef.destroyed) {
        this.book?.destroy(); this.book = undefined;
        this.stage().nativeElement.replaceChildren();
        this.ready.set(false); this.pending = undefined;
        console.error('No se pudo pasar la página; el contenido sigue disponible.', error);
      }
    } finally {
      if (!this.destroyRef.destroyed) {
        this.turningTarget = undefined;
        this.busy.set(false);
        if (this.pending !== undefined) { const next = this.pending; this.pending = undefined; void this.go(next, false); }
      }
    }
  }
  move(direction: number) {
    const shown = this.visible();
    void this.go(direction > 0 ? shown[shown.length - 1] + 1 : shown[0] - 1);
  }
  restore() { if (this.ready()) void this.go(this.hashIndex(), false); }
  link(event: MouseEvent) {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const index = this.ids.indexOf(link.hash.slice(1));
    if (index < 0) return;
    event.preventDefault(); void this.go(index);
  }
  key(event: KeyboardEvent) {
    if (!this.ready() || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button, input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); this.move(event.key === 'ArrowRight' ? 1 : -1); }
  }
  touchStart(event: TouchEvent) {
    const target = event.target as Element;
    if (event.touches.length !== 1 || target.closest('.page-inner, a, button')) return;
    this.touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  touchEnd(event: TouchEvent) {
    if (!this.touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - this.touch.x, dy = event.changedTouches[0].clientY - this.touch.y;
    this.touch = undefined;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && !window.getSelection()?.toString()) this.move(dx < 0 ? 1 : -1);
  }
  touchCancel() { this.touch = undefined; }
}
