import { PresentationState } from './presentation-state';
import { Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

const KEY = 'black-talon.missions.presentation.v1';
@Component({
  selector: 'app-missions', host: { '(window:keydown)': 'onKey($event)' }, imports: [RouterLink, NgTemplateOutlet], templateUrl: './missions.html', styleUrls: ['./missions.css', './mission-guide.css']
})
export class Missions {
  private readonly presentation = inject(PresentationState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly scenes = [
    { id: 'bienvenida', title: 'Cómo funcionan las misiones', text: '¡Bienvenido, causa! En las misiones semanales toca capturar Pokémon y reunir objetos. Mira bien las características y cantidades del anuncio, ¡que empezamos!' },
    { id: 'tablon', title: 'El tablón semanal', text: 'Cada semana publico la misión en WhatsApp y Discord. Ahí encontrarás las capturas, los objetos y la recompensa. Tienes de lunes a sábado para participar.' },
    { id: 'revision', title: 'La mesa de comprobación', text: 'Antes de entregar, revisa las características y cuenta los objetos. Como en una buena receta: ¡que no falte ningún ingrediente del anuncio!' },
    { id: 'correo', title: 'Correo dentro del juego', text: 'En PokeMMO, envíame lo solicitado a maykelsito con el asunto MISION SEMANAL. Si no entra todo en un correo, repártelo en varios.' },
    { id: 'premio', title: 'El premio semanal', text: '¡Y ahora el premio! Cada semana cambia: es un Pokémon 2x31 con el nivel, entrenamiento, habilidad y movimientos del anuncio. Suele servir para eventos, incursiones o uso semicompetitivo. Lo envío desde la medianoche del sábado al domingo hasta, como máximo, el lunes siguiente.' },
    { id: 'despedida', title: 'Un extra en el camino', text: 'A veces también puede haber un ticket gratis para un sorteo u otra mecánica adicional. No está garantizado, así que revisa el anuncio y los canales del clan. ¡Nos vemos en la misión, bro!' }
  ];
  readonly guideText: Record<string, string> = {
    bienvenida: 'Las misiones semanales consisten en capturar Pokémon y reunir objetos con las características y cantidades indicadas en el anuncio. Meowth, Geodude, Piedra Eterna, Carbón y Moneda Amuleto son ejemplos ilustrativos, no la misión vigente.',
    tablon: 'Maykelsito publica las misiones semanales en WhatsApp y Discord. Cada anuncio especifica las capturas, los objetos y la recompensa. El plazo para participar va de lunes a sábado.',
    revision: 'Antes de entregar, cada participante debe comprobar las características de las capturas y las cantidades de objetos frente al anuncio semanal.',
    correo: 'Dentro de PokeMMO, se envía lo solicitado a maykelsito con el asunto MISION SEMANAL. Si no cabe todo en uno, se pueden utilizar varios correos.',
    premio: 'La recompensa varía cada semana: un Pokémon 2x31 preparado con el nivel, entrenamiento, habilidad y movimientos anunciados, normalmente orientado a incursiones, eventos o uso semicompetitivo. Se envía desde la medianoche del sábado al domingo y, como máximo, hasta el lunes siguiente.',
    despedida: 'Algunas semanas puede incluirse un ticket gratuito para un sorteo u otra mecánica adicional. Este beneficio no está garantizado y debe confirmarse en el anuncio.'
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
