import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PresentationState } from './presentation-state';
import { sortedEventMemories } from './events-data';

const KEY = 'black-talon.events.presentation.v1';
@Component({ selector: 'app-events', imports: [RouterLink, NgOptimizedImage], templateUrl: './events.html', styleUrls: ['./missions.css', './mission-guide.css', './events.css'], host: { '(window:keydown)': 'onKey($event)' } })
export class Events {
  private readonly presentation = inject(PresentationState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly memories = sortedEventMemories;
  readonly scenes = [
    { title: 'Un encuentro cada semana', speaker: 'Socamaru', text: 'Cada semana nos reunimos para compartir un evento. Algunos dicen que vienen a divertirse, pero tampoco quieren perder. 😅', image: 'encuentro' },
    { title: 'Revisa el anuncio', speaker: 'HuronVNLZ', text: 'También venimos a competir, claro. Normalmente jugamos el domingo por la tarde, hora de Perú; revisen el anuncio para confirmar la hora y el lugar.', image: 'calendario' },
    { title: 'Participar es gratuito', speaker: 'maykelsito', text: 'Participar es gratis. Nos vemos en el lugar indicado en el anuncio. ¡Vengan con ganas!', image: 'entrada' },
    { title: 'Cada evento es diferente', speaker: 'Socamaru', text: 'Los administradores organizamos cada encuentro y explicamos las reglas antes de empezar. Cada evento es distinto, así que escúchenlas antes de retarse.', image: 'reglas' },
    { title: 'Premios y resultados', speaker: 'HuronVNLZ', text: 'Las recompensas y los puestos premiados varían según el evento; revisen el anuncio. La peruana seguro ya está preparando su próxima jugada.', image: 'premios' },
    { title: 'Nuestros recuerdos', speaker: 'maykelsito', text: 'La chama me conoce bien. 😎 Me gusta competir, pero también guardar los buenos momentos que compartimos.', image: 'recuerdos' },
    { title: 'Juntos en cada encuentro', speaker: 'Socamaru', text: 'Al final, lo mejor es encontrarnos y compartir. Nos vemos en la próxima reunión.', image: 'union' },
  ];
  readonly closingMembers = ['Socamaru', 'HuronVNLZ', 'maykelsito'];
  readonly index = signal(0);
  readonly album = signal(false);
  private seen(): boolean { try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; } }
  constructor() { this.presentation.active.set(true); afterNextRender(() => { if (this.seen()) { this.album.set(true); this.presentation.active.set(false); } }); this.destroyRef.onDestroy(() => this.presentation.active.set(false)); }
  private focus(selector: string) { setTimeout(() => { if (!this.destroyRef.destroyed) this.host.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }); }); }
  step(delta: number) { const next = this.index() + delta; if (next >= this.scenes.length) return this.finish(); if (next >= 0) { this.index.set(next); this.focus('.cinematic h2'); } }
  finish() { try { localStorage.setItem(KEY, 'seen'); } catch { /* storage can be unavailable */ } this.album.set(true); this.presentation.active.set(false); this.focus('.intro h1'); }
  replay() { this.index.set(0); this.album.set(false); this.presentation.active.set(true); this.focus('.cinematic h2'); }
  onKey(event: KeyboardEvent) { if (this.album() || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return; const target = event.target instanceof HTMLElement ? event.target : null; if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.step(event.key === 'ArrowRight' ? 1 : -1); } }
}
