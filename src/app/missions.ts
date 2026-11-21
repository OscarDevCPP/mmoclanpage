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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly scenes = [
    { hint: 'Meowth, Geodude, Piedra Eterna, Carbón y Moneda Amuleto son ejemplos ilustrativos, no la misión vigente.', id: 'bienvenida', title: 'Bienvenido al claro', text: '¡Bienvenido a las misiones semanales! Participa capturando Pokémon y reuniendo objetos según las características y cantidades del anuncio.' },
    { id: 'tablon', title: 'El tablón semanal', text: 'Yo publico la misión de cada semana en WhatsApp y Discord. Consulta allí las capturas, los objetos y la recompensa. El plazo va de lunes a sábado.' },
    { id: 'revision', title: 'La mesa de comprobación', text: 'Antes de entregar, compara las características de tus capturas y las cantidades de objetos con el anuncio de esa semana.' },
    { id: 'correo', title: 'Correo dentro del juego', text: 'Dentro de PokeMMO, envía lo solicitado a maykelsito con el asunto MISION SEMANAL. Si no cabe todo, repártelo en varios correos. Esta web es una demostración y nunca envía correos.' },
    { id: 'premio', title: 'El premio semanal', text: 'El premio cambia cada semana: un Pokémon 2x31 preparado con el nivel, entrenamiento, habilidad y movimientos del anuncio. Suele estar orientado a eventos, incursiones o uso semicompetitivo. El envío comienza a medianoche del sábado al domingo y termina como máximo el lunes siguiente.' },
    { id: 'despedida', title: 'Un extra en el camino', text: 'Algunas semanas puede haber un ticket gratuito para un sorteo u otra mecánica adicional. No está garantizado: revisa el anuncio. Consulta los canales del clan para conocer los detalles.' }
  ];
  readonly index = signal(0);
  readonly guide = signal(this.initialGuide());
  private initialGuide(): boolean {
    if (this.scenes.some(scene => scene.id === this.route.snapshot.fragment)) return true;
    try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; }
  }
  constructor() {
    this.route.fragment.pipe(skip(1), takeUntilDestroyed()).subscribe(fragment => {
      if (this.scenes.some(scene => scene.id === fragment)) this.guide.set(true);
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
    this.guide.set(true); this.focus('.intro h1');
  }
  replay() {
    if (this.route.snapshot.fragment) void this.router.navigate([], { relativeTo: this.route, fragment: undefined, replaceUrl: true });
    this.index.set(0); this.guide.set(false); this.focus('.cinematic h2');
  }
  onKey(event: KeyboardEvent) {
    if (this.guide() || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.step(event.key === 'ArrowRight' ? 1 : -1); }
  }
}
