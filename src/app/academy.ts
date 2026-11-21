import { PresentationState } from './presentation-state';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { NgOptimizedImage, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

const KEY = 'black-talon.academy.presentation.v1';
@Component({
  selector: 'app-academy', host: { '(window:keydown)': 'onKey($event)' }, imports: [RouterLink, NgOptimizedImage, NgTemplateOutlet], templateUrl: './academy.html', styleUrls: ['./missions.css', './mission-guide.css', './academy.css']
})
export class Academy {
  private readonly presentation = inject(PresentationState);
  private readonly scroller = inject(ViewportScroller);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly scenes = [
    { id: 'bienvenida', image: '/academy/bienvenida.svg', alt: 'Puerta abierta a un espacio de aprendizaje', title: 'Aprender y compartir', speaker: 'Socamaru', text: '¡Bienvenidos a Red Wings Academy! Aquí compartimos lo que sabemos entre miembros del clan y aprendemos poquito a poquito, jeje.' },
    { id: 'temas', image: '/academy/temas.svg', alt: 'Herramientas, crianza, combate, monedas y libros', title: 'Temas para explorar', speaker: 'Socamaru', text: 'Podemos aprender sobre farmeos, crianza, PvP, economía y mecánicas del juego. Me alegra que podamos compartir lo que sabemos 😅.' },
    { id: 'formato', image: '/academy/formato.svg', alt: 'Cuatro participantes conectados y un lugar de encuentro', title: 'Cómo nos reunimos', speaker: 'Socamaru', text: 'Necesitamos al menos 3 alumnos. Con 3, formamos un Link de 4 con el instructor; si hay más, acordamos un lugar y usamos el chat normal. Así no interferimos con el chat de equipo ni otros canales.' },
    { id: 'participar', image: '/academy/participar.svg', alt: 'Calendario y mensajes para coordinar una clase', title: 'Participar y coordinar', speaker: 'Socamaru', text: 'Las clases son gratuitas y exclusivas para miembros del clan. Instructor y alumnos acuerdan tema, día y hora; en el grupo de WhatsApp de la Academia podemos anunciar, coordinar y proponer clases.' },
    { id: 'maykelsito', image: '/academy/maykelsito.svg', alt: 'Campo de combate y estrategia PvP', title: 'PvP con maykelsito', speaker: 'maykelsito', text: '¡El PvP me apasiona, causa! Compartamos estrategias y aprendamos a combatir. A ver qué dice la chama de nuestras jugadas.' },
    { id: 'huron', image: '/academy/huron.svg', alt: 'Combate y exploración representados en un mapa', title: 'PvP y PvE con HuronVNLZ', speaker: 'HuronVNLZ', text: 'Puedo compartir lo que sé de PvP y PvE. Analicemos cada jugada con calma; la peruana ya pone suficiente emoción.' },
    { id: 'socamaru', image: '/academy/socamaru.svg', alt: 'Ruta de exploración PvE y herramientas de aventura', title: 'PvE con Socamaru', speaker: 'Socamaru', text: 'Yo puedo compartirles lo que sé de PvE y algunos consejos para avanzar. Vamos con calma, que aprendemos juntos, jeje.' },
    { id: 'ensenar', image: '/academy/ensenar.svg', alt: 'Personas compartiendo conocimiento alrededor de una mesa', title: 'Una invitación abierta', speaker: 'Socamaru', text: 'Si tienes ganas de ayudar y compartir, tú también puedes enseñar. Coordina conmigo y anuncia tu clase en el grupo de WhatsApp de la Academia. ¡Será bonito aprender juntos!' }
  ];
  readonly guide = signal(false);
  readonly sections = [
    { id: 'proposito', title: 'Propósito y temas', image: this.scenes[1], text: 'Red Wings Academy es un espacio para aprender y compartir entre miembros del clan. Sus temas incluyen farmeos, crianza, PvP, economía y mecánicas. Más adelante podrían organizarse clases intermedias o avanzadas.' },
    { id: 'requisitos', title: 'Requisitos y gratuidad', image: this.scenes[0], text: 'Las clases son gratuitas y exclusivas para miembros del clan. Se requiere un mínimo de 3 alumnos.' },
    { id: 'grupos', title: 'Formato de los grupos', image: this.scenes[2], text: 'Con 3 alumnos, el instructor y los alumnos forman un Link de 4. Si hay más de 3 alumnos, se acuerda un lugar y se utiliza el chat normal del juego. Así se evita interferir con el chat de equipo y otros canales.' },
    { id: 'coordinacion', title: 'Coordinación', image: this.scenes[3], text: 'Instructor y alumnos acuerdan el tema, el día y la hora. El grupo de WhatsApp dedicado a Red Wings Academy sirve para anunciar y coordinar clases y proponer temas.' },
    { id: 'referentes', title: 'Referentes', image: this.scenes[4], text: 'Estos miembros comparten sus conocimientos como referentes; no forman una plantilla fija ni exclusiva.' },
    { id: 'ensenar', title: 'Compartir lo aprendido', image: this.scenes[7], text: 'Cualquier miembro con ganas de ayudar y compartir puede enseñar: debe coordinar con Socamaru y anunciar su clase en el grupo de WhatsApp de la Academia.' }
  ];
  readonly index = signal(0);
  private initialGuide(): boolean {
    if (['proposito', 'requisitos', 'grupos', 'coordinacion', 'referentes', 'ensenar'].includes(this.route.snapshot.fragment ?? '')) return true;
    try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; }
  }
  constructor() {
    this.presentation.active.set(true);
    afterNextRender(() => {
      if (this.initialGuide()) {
        this.guide.set(true);
        this.presentation.active.set(false);
        const fragment = this.route.snapshot.fragment;
        if (fragment) setTimeout(() => {
          if (this.destroyRef.destroyed) return;
          this.scroller.scrollToAnchor(fragment);
          const element = this.host.ownerDocument.getElementById(fragment);
          element?.focus({ preventScroll: true });
        });
      }
    });
    this.destroyRef.onDestroy(() => this.presentation.active.set(false));
    this.route.fragment.pipe(skip(1), takeUntilDestroyed()).subscribe(fragment => {
      if (this.sections.some(section => section.id === fragment)) { this.guide.set(true); this.presentation.active.set(false); }
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
