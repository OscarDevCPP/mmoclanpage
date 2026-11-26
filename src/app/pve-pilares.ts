import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { popupPosition } from './pvp-fundamentos';

@Component({
  selector: 'app-pve-pilares',
  imports: [RouterLink],
  host: { '(document:click)': 'outside($event)', '(document:focusin)': 'focusChanged($event)', '(document:keydown.escape)': 'escape()', '(window:scroll)': 'reposition()', '(window:resize)': 'reposition()' },
  templateUrl: './pve-pilares.html',
  styleUrls: ['./pvp-fundamentos.css', './pve-pilares.css'],
})
export class PvePilares {
  readonly openTerm = signal<string | null>(null);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly pillars = [
    {name:'Typhlosion', ability:'Blaze', iv:'PS y Defensa 10–31; Ataque Especial y Velocidad 31.', ev:'252 Ataque Especial / 4 Defensa Especial / 252 Velocidad', nature:'Modest', item:'Choice Specs', moves:'Eruption, Swift, Incinerate, Cut', note:'La guía menciona Flash Fire como habilidad alternativa.'},
    {name:'Blastoise', ability:'Torrent', iv:'PS y Defensa 0–25; Ataque Especial y Velocidad 31.', ev:'252 Ataque Especial / 252 Velocidad', nature:'Mild', item:'Choice Scarf', moves:'Water Spout, Blizzard, Helping Hand, Fake Out', note:'Con otra naturaleza, comprueba que Explosion de Weezing lo debilite; la fuente ofrece Modest como alternativa con ajuste de IV.'},
    {name:'Togekiss', ability:'Hustle', iv:'Ataque Especial y Velocidad 31.', ev:'252 Ataque Especial / 252 Velocidad', nature:'Modest', item:'Choice Specs', moves:'Hyper Voice, Helping Hand, Shock Wave, Fly', note:'Su tipo Volador lo protege del Earthquake de Garchomp.'},
    {name:'Garchomp', ability:'Sand Veil', iv:'Ataque y Velocidad 31.', ev:'252 Ataque / 26 Defensa Especial / 232 Velocidad', nature:'Lonely', item:'Choice Band', moves:'Earthquake, Dragon Claw, Helping Hand, Sunny Day', note:'Para dos gimnasios, la fuente recomienda PS y Defensa inferiores a 9 y Defensa Especial de al menos 19, con naturaleza Lonely. Son mejoras opcionales; también recomienda Rough Skin sin exigirlo.'},
    {name:'Weezing', ability:'Neutralizing Gas', iv:'Ataque y Velocidad 31.', ev:'252 Ataque / 252 Velocidad', nature:'Adamant', item:'Choice Band', moves:'Assurance, Explosion, Incinerate, Rain Dance', note:'La fuente admite 22 o más IV de Velocidad para superar a Ninetales de Celadon, aunque recomienda 31 para futuras variantes. Neutralizing Gas anula habilidades mientras está en el campo.'},
    {name:'Vanilluxe', ability:'Snow Warning', iv:'Ataque Especial y Velocidad 31.', ev:'6 Defensa / 252 Ataque Especial / 252 Velocidad', nature:'Modest', item:'Choice Scarf', moves:'Blizzard, Ice Beam, Hyper Voice', note:'Como mejora opcional para una variante, la fuente propone al menos 28 IV en PS y Defensa. Snow Warning cambia el clima.'},
  ];
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
