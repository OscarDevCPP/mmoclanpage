import { PokemonBuildCard } from './pokemon-build';
import { PILLARS } from './pillars-data';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { popupPosition } from './pvp-fundamentos';

@Component({
  selector: 'app-pve-pilares',
  imports: [RouterLink, PokemonBuildCard],
  host: { '(document:click)': 'outside($event)', '(document:focusin)': 'focusChanged($event)', '(document:keydown.escape)': 'escape()', '(window:scroll)': 'reposition()', '(window:resize)': 'reposition()' },
  templateUrl: './pve-pilares.html',
  styleUrls: ['./pvp-fundamentos.css', './pve-pilares.css'],
})
export class PvePilares {
  readonly openTerm = signal<string | null>(null);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly pillars = PILLARS;
  toggle(term: string, trigger: HTMLButtonElement) { if (this.openTerm() === term) { this.dismiss(); return; } this.openTerm.set(term); this.position(term, trigger); }
  reposition() { const term = this.openTerm(); if (term) { const trigger = this.hostElement.querySelector<HTMLButtonElement>(`[data-term="${term}"]`); if (trigger) this.position(term, trigger); } }
  private position(term: string, trigger: HTMLButtonElement) {
    const view = this.hostElement.ownerDocument.defaultView;
    view?.requestAnimationFrame(() => {
      if (this.openTerm() !== term || !trigger.isConnected) return;
      const popup = this.hostElement.querySelector<HTMLElement>(`#definition-${term}`); if (!popup) return;
      const rect = this.hostElement.ownerDocument.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect();
      const headerBottom = rect && rect.top <= 0 && rect.bottom > 0 ? rect.bottom : 0;
      const anchor = trigger.getBoundingClientRect();
      if (anchor.bottom <= headerBottom || anchor.top >= view.innerHeight || anchor.right <= 0 || anchor.left >= view.innerWidth) { this.dismiss(); return; }
      popup.style.maxHeight = `${Math.max(0, view.innerHeight - Math.max(8, headerBottom + 8) - 8)}px`;
      const pos = popupPosition(anchor, popup.getBoundingClientRect(), view.innerWidth, view.innerHeight, headerBottom);
      popup.style.left = `${pos.left}px`; popup.style.top = `${pos.top}px`; popup.style.visibility = 'visible';
    });
  }
  dismiss() { this.openTerm.set(null); }
  outside(event: MouseEvent) { if (!(event.target instanceof Element) || !event.target.closest('.glossary')) this.dismiss(); }
  focusChanged(event: FocusEvent) { const term = this.openTerm(); if (term && event.target !== this.hostElement.querySelector(`[data-term="${term}"]`)) this.dismiss(); }
  escape() { const term = this.openTerm(); if (!term) return; if (this.hostElement.ownerDocument.activeElement instanceof HTMLElement && this.hostElement.ownerDocument.activeElement.closest('.glossary')) this.hostElement.querySelector<HTMLButtonElement>(`[data-term="${term}"]`)?.focus(); this.dismiss(); }
}
