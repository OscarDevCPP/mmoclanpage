import { afterNextRender, Component, DestroyRef, ElementRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PresentationState } from './presentation-state';

interface Memory { date: string; label: string; title: string; file: string; type: 'image' | 'video'; story: string; }

const KEY = 'black-talon.memories.presentation.v1';
@Component({ selector: 'app-memories', imports: [RouterLink], templateUrl: './memories.html', styleUrls: ['./missions.css', './mission-guide.css', './events.css', './memories.css'], host: { '(window:keydown)': 'onKey($event)' } })
export class Memories {
  private readonly presentation = inject(PresentationState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly scenes = [
    { title: 'Dos primeras voces', speaker: 'maykelsito', image: 1, text: 'Huron y yo fundamos Black Talon, causa. Fuimos los dos primeros miembros de esta historia.' },
    { title: 'Una comunidad que crece', speaker: 'HuronVNLZ', image: 2, text: 'Después llegó Socamaru y la comunidad fue creciendo. Cada persona ha traído algo al clan.' },
    { title: 'Entre amigos y rivales', speaker: 'maykelsito', image: 3, text: 'A la chama y a mí nos gusta competir. ¡Pero también sabemos disfrutar juntos cada encuentro, bro!' },
    { title: 'Momentos compartidos', speaker: 'HuronVNLZ', image: 4, text: 'La peruana no pierde las ganas de competir. Guardemos también los momentos que compartimos. Aquí están algunos de nuestros recuerdos.' },
  ];
  readonly memories = signal<Memory[]>([
    { date: '2026-09-17', label: '17 de septiembre de 2026', title: 'Nuestro primer evento', file: '1_recuerdo_primer_evento.jpeg', type: 'image', story: 'Nos reunimos en Ciudad Verde, Kanto, canal 1 para nuestro primer evento de PvP aleatorios, organizado por maykelsito. Cintiacamila ganó 500k.' },
    { date: '2026-10-12', label: '12 de octubre de 2026', title: 'La primera clase de la Academia', file: '2_recuerdo_primera_clase.jpeg', type: 'image', story: 'Compartimos nuestra primera clase de PvP en Red Wings Academy con maykelsito. Gracias al profesor y a quienes nos acompañaron para aprender juntos.' },
    { date: '2026-11-13', label: '13 de noviembre de 2026', title: 'Nuestro primer Halloween', file: '3_recuerdo_primer_evento_de_hallowen.jpeg', type: 'image', story: 'Vivimos juntos nuestro primer Halloween. Felicitaciones a quienes pudieron aprovecharlo y ánimo a quienes no; esperamos compartir muchos Halloween más.' },
    { date: '2026-11-13', label: '13 de noviembre de 2026', title: 'Se abrieron las puertas de los 12 Templos', file: '4_recuerdo_presentacion_2_los_12_templos.mp4', type: 'video', story: 'El anuncio de los 12 Templos convocó a quienes querían convertirse en Guardianes y representar un tipo de Pokémon. Se invitó a los aspirantes a elegir su tipo y se anunció un torneo para poner a prueba sus habilidades. Fue el comienzo de una nueva historia para el clan.' },
  ]);
  readonly sortedMemories = computed(() => [...this.memories()].sort((a, b) => b.date.localeCompare(a.date)));
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
