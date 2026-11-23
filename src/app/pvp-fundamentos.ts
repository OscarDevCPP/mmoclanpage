import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PVP_CONTENTS, PVP_GUIDE } from './pvp-guide';
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
  selector: 'app-pvp-fundamentos',
  imports: [NgTemplateOutlet, RouterLink],
  host: { '(document:click)': 'outside($event)', '(document:focusin)': 'focusChanged($event)', '(document:keydown.escape)': 'escape()', '(window:scroll)': 'reposition()', '(window:resize)': 'reposition()' },
  templateUrl: './pvp-fundamentos.html',
  styleUrl: './pvp-fundamentos.css',
})
export class PvpFundamentos {
  readonly sections = PVP_GUIDE;
  readonly contents = PVP_CONTENTS;
  readonly openTerm = signal<string | null>(null);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly definitions: Record<string, string> = {
    Singles: 'Combate con un Pokémon activo por jugador.',
    Doubles: 'Combate con dos Pokémon activos por jugador.',
    Randoms: 'Modalidad con equipos generados y preparación predefinida.',
    tiers: 'Categorías que delimitan qué Pokémon pueden participar.',
    OU: 'OverUsed: una categoría competitiva relacionada con el uso.',
    UU: 'UnderUsed: una categoría competitiva relacionada con el uso.',
    NU: 'NeverUsed: una categoría competitiva relacionada con el uso.',
    STAB: 'Bonificación de daño cuando el movimiento comparte tipo con quien lo usa.',
    IV: 'Valores individuales que influyen en las estadísticas de un Pokémon.',
    EV: 'Valores de esfuerzo obtenidos mediante entrenamiento que influyen en las estadísticas.',
    core: 'Pequeño grupo de Pokémon que colaboran alrededor de una idea.',
  };
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
    if (initialFragment && (this.sections.some(section => section.id === initialFragment) || ['introduccion-turno', 'introduccion-plan', 'introduccion-practica'].includes(initialFragment))) {
      afterNextRender(() => {
        if (!destroyRef.destroyed && route.snapshot.fragment === initialFragment) {
          document.getElementById(initialFragment)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      });
    }
    const meta = inject(Meta);
    const previous = meta.getTag('name="description"')?.content;
    meta.updateTag({ name: 'description', content: 'Introducción al competitivo de PokeMMO: modalidades, preparación, equipos y práctica PvP para la comunidad de Black Talon.' });
    destroyRef.onDestroy(() => {
      if (previous !== undefined) meta.updateTag({ name: 'description', content: previous });
      else meta.removeTag('name="description"');
    });
  }

  href(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'link')?.href; }
  has(run: InlineRun, kind: 'strong' | 'emphasis'): boolean { return run.marks.some(mark => mark.kind === kind); }
}
