import { PresentationState } from './presentation-state';
import { Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

const KEY = 'black-talon.sorteos.presentation.v1';
@Component({
  selector: 'app-sorteos', host: { '(window:keydown)': 'onKey($event)' }, imports: [RouterLink, NgOptimizedImage, NgTemplateOutlet], templateUrl: './sorteos.html', styleUrls: ['./missions.css', './mission-guide.css', './sorteos.css']
})
export class Sorteos {
  private readonly presentation = inject(PresentationState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly scenes = [
    { id: 'anuncio', image: '/sorteos/anuncio.svg', alt: 'Socamaru junto al tablón de anuncio y un regalo', title: 'El sorteo semanal', text: '¡Bienvenido! Cada semana anuncio un sorteo con un cosmético o un Pokémon. Me alegra compartirlo con ustedes, jeje. Revisa el anuncio para conocer los detalles.' },
    { id: 'numeros', image: '/sorteos/numeros.svg', alt: 'Tablero de números y monedas que representan disponibilidad y precio', title: 'Números y límites', text: 'En el anuncio les cuento cuántos números hay, cuánto cuestan y el máximo por persona. Pueden cambiar según el premio y la participación, así que mejor revisarlos cada semana 😅.' },
    { id: 'ticket', image: '/sorteos/ticket.svg', alt: 'Lista de misiones y tickets de recompensa', title: 'Un ticket de misiones', text: 'Si te toca un ticket gratuito por misiones, recuerda que cuenta dentro del límite. Por ejemplo, si el máximo es tres y tienes uno gratis, puedes comprar dos más.' },
    { id: 'participar', image: '/sorteos/participar.svg', alt: 'Mensaje para coordinar la participación con Socamaru', title: 'Cómo participar', text: 'Dime los números que deseas y confirmamos si están disponibles por WhatsApp o Discord, o por susurro si estoy conectado en el juego. No uses correo: no podemos confirmar la disponibilidad, jeje.' },
    { id: 'resultado', image: '/sorteos/resultado.svg', alt: 'Reloj y sobre que representan la espera y la revelación del resultado', title: 'El momento del sorteo', text: 'En el anuncio siempre dejo un enlace externo para seguir la cuenta regresiva durante la semana. El domingo a las 12 del mediodía, hora de Perú, la página elige y revela al ganador. ¡Suerte a todos, jeje!' },
    { id: 'fondos', image: '/sorteos/fondos.svg', alt: 'Monedas destinadas a un cofre y a eventos del clan', title: 'Para seguir compartiendo', text: 'Si sale un número que nadie compró, hacemos otro sorteo entre participantes. La recaudación consigue el premio y lo que sobra ayuda a los eventos, premios y wars del clan. Poquito a poquito, seguimos compartiendo.' }
  ];
  readonly guideText: Record<string, string> = {
    anuncio: 'Socamaru anuncia un sorteo semanal cuyo premio es un cosmético o un Pokémon. Cada participante debe consultar el anuncio correspondiente.',
    numeros: 'El anuncio define el total de números, el precio y el máximo por persona según el premio y la participación. Como ejemplo ilustrativo, podrían ser 15 números, un máximo de 3 por persona y 20k por número; no son condiciones fijas.',
    ticket: 'Un ticket gratuito obtenido por misiones cuenta dentro del máximo personal. En el ejemplo de máximo 3, quien tenga 1 gratis puede comprar 2 más.',
    participar: 'Para comprar, cada participante indica los números que desea y confirma su disponibilidad directamente con Socamaru por WhatsApp o Discord, o por susurro dentro del juego si está conectado. El correo no es válido para comprar porque no permite confirmar la disponibilidad. Consulta los canales del clan para contactar.',
    resultado: 'El anuncio semanal siempre incluye un enlace externo donde se puede seguir la cuenta regresiva durante la semana. El domingo a las 12 del mediodía, hora de Perú, esa página elige y revela al ganador al llegar la hora. Si el número ganador no fue comprado, se realiza un sorteo adicional entre los participantes.',
    fondos: 'La recaudación se usa para conseguir el premio; lo restante se destina a fondos para eventos, premios y wars del clan.'
  };
  readonly index = signal(0);
  readonly guide = signal(this.initialGuide());
  private initialGuide(): boolean {
    if (this.scenes.some(scene => scene.id === this.route.snapshot.fragment)) return true;
    try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; }
  }
  constructor() {
    this.presentation.active.set(!this.guide());
    this.destroyRef.onDestroy(() => this.presentation.active.set(false));
    this.route.fragment.pipe(skip(1), takeUntilDestroyed()).subscribe(fragment => {
      if (this.scenes.some(scene => scene.id === fragment)) { this.guide.set(true); this.presentation.active.set(false); }
    });
  }
  private focus(selector: string) {
    setTimeout(() => {
      if (this.destroyRef.destroyed) return;
      const element = this.host.querySelector<HTMLElement>(selector);
      if (!element) return;
      element.focus({ preventScroll: true });
      const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 60) + 16;
      const top = element.getBoundingClientRect().top;
      if (top < offset || top > window.innerHeight - element.offsetHeight) {
        window.scrollTo({ top: window.scrollY + top - offset, behavior: 'instant' });
      }
    });
  }
  step(delta: number) {
    const next = this.index() + delta;
    if (next >= this.scenes.length) { this.finish(); return; }
    if (next < 0) return;
    this.index.set(next); this.focus('.cinematic h2');
  }
  finish() {
    try { localStorage.setItem(KEY, 'seen'); } catch { /* preference remains in this view */ }
    this.guide.set(true); this.presentation.active.set(false); this.focus('.intro h1');
  }
  replay() {
    if (this.route.snapshot.fragment) void this.router.navigate([], { relativeTo: this.route, fragment: undefined, replaceUrl: true });
    this.index.set(0); this.guide.set(false); this.presentation.active.set(true); this.focus('.cinematic h2');
  }
  onKey(event: KeyboardEvent) {
    if (this.guide() || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.step(event.key === 'ArrowRight' ? 1 : -1); }
  }
}
