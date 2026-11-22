import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PresentationState } from './presentation-state';
import { ResourcesBook } from './resources-book';
import { BOOK_NOSCRIPT } from './book-noscript';

const KEY = 'black-talon.compendio.presentation.v1';

@Component({
  selector: 'app-resources',
  host: { '(window:keydown)': 'onKey($event)' },
  imports: [NgOptimizedImage, ResourcesBook],
  templateUrl: './resources.html',
  styleUrls: ['./missions.css', './mission-guide.css', './resources.css'],
})
export class Resources {
  private readonly presentation = inject(PresentationState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly guide = signal(false);
  readonly index = signal(0);
  // The browser parses noscript as text with scripting enabled. A single innerHTML
  // binding keeps Angular from hydrating child elements that do not exist there.
  readonly noScriptContent = inject(DomSanitizer).bypassSecurityTrustHtml(BOOK_NOSCRIPT);
  readonly scenes = [
    { title: 'Un lugar para compartir', image: 'academy/bienvenida.svg', speaker: 'Socamaru', text: '¡Bienvenidos al Compendio! Aquí reunimos lo que vamos aprendiendo para compartirlo con el clan, jeje.' },
    { title: 'Una duda', image: 'academy/temas.svg', speaker: 'GhostyFly', text: '¿Y qué podemos encontrar aquí? 😁' },
    { title: 'Entre combates y aventuras', image: 'academy/temas.svg', speaker: 'Socamaru', text: 'La idea es reunir guías de PvP y PvE, y recursos sobre eventos del juego. Así será más fácil encontrar lo que buscamos.' },
    { title: 'Por dónde empezar', image: 'academy/socamaru.svg', speaker: 'Weonaso', text: '¿Y si tengo dudas para avanzar en PvE?' },
    { title: 'Explorar juntos', image: 'academy/socamaru.svg', speaker: 'Socamaru', text: 'Puedo compartir lo que sé de PvE. Preguntar antes también ahorra unas cuantas vueltas, jeje.' },
    { title: 'Preparar la jugada', image: 'academy/huron.svg', speaker: 'HuronVNLZ', text: 'Yo puedo aportar tanto en PvP como en PvE. Si algo no sale, lo revisamos y probamos otra vez.' },
    { title: 'La revancha', image: 'academy/maykelsito.svg', speaker: 'maykelsito', text: 'Y para PvP, aquí estoy, causa. A ver si la chama se anima a otra partida.' },
    { title: 'Seguimos aprendiendo', image: 'academy/huron.svg', speaker: 'HuronVNLZ', text: 'Me animo. Después vemos quién pide la revancha. 👊' },
    { title: 'Un espacio abierto', image: 'academy/ensenar.svg', speaker: 'Socamaru', text: 'Hay muchas experiencias que compartir, no solo las nuestras. Ya puedes comenzar con la introducción al competitivo; los demás recursos siguen en preparación.' },
  ];
  constructor() {
    this.presentation.active.set(true);
    afterNextRender(() => {
      try { if (localStorage.getItem(KEY) === 'seen') { this.guide.set(true); } } catch { /* presentation remains available */ }
    });
    this.destroyRef.onDestroy(() => this.presentation.active.set(false));
  }
  private focus(selector: string) {
    setTimeout(() => {
      if (this.destroyRef.destroyed) return;
      const element = this.host.querySelector<HTMLElement>(selector);
      if (!element) return;
      element.focus({ preventScroll: true });
      const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 60) + 16;
      const top = element.getBoundingClientRect().top;
      if (top < offset || top > window.innerHeight - element.offsetHeight) window.scrollTo({ top: window.scrollY + top - offset, behavior: 'instant' });
    });
  }
  step(delta: number) {
    const next = this.index() + delta;
    if (next >= this.scenes.length) { this.finish(); return; }
    if (next < 0) return;
    this.index.set(next); this.focus('.cinematic h2');
  }
  finish() {
    try { localStorage.setItem(KEY, 'seen'); } catch { /* retain state in this view */ }
    this.guide.set(true);
  }
  replay() { this.index.set(0); this.guide.set(false); this.presentation.active.set(true); this.focus('.cinematic h2'); }
  onKey(event: KeyboardEvent) {
    if (this.guide() || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.step(event.key === 'ArrowRight' ? 1 : -1); }
  }
}
