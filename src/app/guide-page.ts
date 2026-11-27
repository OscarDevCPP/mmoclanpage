import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonBuildCard } from './pokemon-build';
import type { GuideDefinition } from './guide-content';
import type { InlineRun } from './guide-content';

export function popupPosition(anchor: DOMRect, popup: DOMRect, width: number, height: number, headerBottom: number) {
  const gap = 8;
  const topLimit = Math.max(gap, headerBottom + gap);
  const bottomLimit = Math.max(topLimit, height - gap);
  const below = anchor.bottom + gap;
  const above = anchor.top - gap - popup.height;
  const top = below + popup.height <= bottomLimit ? below : above >= topLimit ? above : Math.max(topLimit, bottomLimit - popup.height);
  const left = Math.max(gap, Math.min(anchor.left, width - gap - popup.width));
  return { top, left };
}

@Component({
  selector: 'app-guide-page',
  imports: [NgTemplateOutlet, RouterLink, PokemonBuildCard],
  host: { '(document:click)': 'outside($event)', '(document:focusin)': 'focusChanged($event)', '(document:keydown.escape)': 'escape()', '(window:scroll)': 'reposition()', '(window:resize)': 'reposition()' },
  templateUrl: './guide-page.html',
  styleUrl: './guide-page.css',
})
export class GuidePage {
  readonly guide = input.required<GuideDefinition>();
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);
  ngOnInit() {
    const description = this.guide().description;
    if (!description) return;
    const previous = this.meta.getTag('name="description"')?.content;
    this.meta.updateTag({ name: 'description', content: description });
    this.destroyRef.onDestroy(() => {
      if (previous !== undefined) this.meta.updateTag({ name: 'description', content: previous });
      else this.meta.removeTag('name="description"');
    });
  }
  readonly openTerm = signal<string | null>(null);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  term(run: InlineRun): string | undefined {
    return run.marks.find(mark => mark.kind === 'glossary')?.term;
  }
  toggle(term: string, trigger: HTMLButtonElement) {
    if (this.openTerm() === term) { this.dismiss(); return; }
    this.openTerm.set(term);
    this.schedulePosition(term, trigger);
  }
  reposition() {
    const term = this.openTerm();
    if (!term) return;
    const trigger = this.hostElement.querySelector<HTMLButtonElement>(`[data-term="${term}"]`);
    if (trigger) this.schedulePosition(term, trigger);
  }
  private schedulePosition(term: string, trigger: HTMLButtonElement) {
    const view = this.hostElement.ownerDocument.defaultView;
    view?.requestAnimationFrame(() => {
      if (this.openTerm() !== term || !trigger.isConnected) return;
      const popup = this.hostElement.querySelector<HTMLElement>(`#definition-${term}`);
      if (!popup) return;
      const header = this.hostElement.ownerDocument.querySelector<HTMLElement>('.site-header');
      const headerRect = header?.getBoundingClientRect();
      const headerBottom = headerRect && headerRect.top <= 0 && headerRect.bottom > 0 ? headerRect.bottom : 0;
      const anchor = trigger.getBoundingClientRect();
      if (anchor.bottom <= headerBottom || anchor.top >= view.innerHeight || anchor.right <= 0 || anchor.left >= view.innerWidth) {
        this.dismiss();
        return;
      }
      popup.style.maxHeight = `${Math.max(0, view.innerHeight - Math.max(8, headerBottom + 8) - 8)}px`;
      const position = popupPosition(anchor, popup.getBoundingClientRect(), view.innerWidth, view.innerHeight, headerBottom);
      popup.style.left = `${position.left}px`;
      popup.style.top = `${position.top}px`;
      popup.style.visibility = 'visible';
    });
  }
  dismiss() { this.openTerm.set(null); }
  focusChanged(event: FocusEvent) {
    const term = this.openTerm();
    if (!term) return;
    const target = event.target;
    if (!(target instanceof Element) || target !== this.hostElement.querySelector(`[data-term="${term}"]`)) this.dismiss();
  }
  outside(event: MouseEvent) {
    if (!(event.target instanceof Element) || !event.target.closest('.glossary')) this.dismiss();
  }
  escape() {
    const term = this.openTerm();
    if (!term) return;
    const active = this.hostElement.ownerDocument.activeElement;
    if (active instanceof HTMLElement && active.closest('.glossary')) {
      this.hostElement.querySelector<HTMLButtonElement>(`[data-term="${term}"]`)?.focus();
    }
    this.dismiss();
  }

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    // Angular suppresses its initial Scroll event during hydration. Restore only
    // an initial guide fragment after rendering; later navigation stays with Router.
    const initialFragment = router.lastSuccessfulNavigation() === null ? route.snapshot.fragment : null;
    afterNextRender(() => {
      const guide = this.guide();
      if (initialFragment && (guide.sections.some(section => section.id === initialFragment) || Object.values(guide.aliases ?? {}).includes(initialFragment)) && !destroyRef.destroyed && route.snapshot.fragment === initialFragment) {
        document.getElementById(initialFragment)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  }

  href(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'link')?.href; }
  has(run: InlineRun, kind: 'strong' | 'emphasis' | 'italic'): boolean { return run.marks.some(mark => mark.kind === kind); }
  language(run: InlineRun): string | null { return run.marks.find(mark => mark.kind === 'language')?.value ?? null; }
  date(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'time')?.datetime; }
}
