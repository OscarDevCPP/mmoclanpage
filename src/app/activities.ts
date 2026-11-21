import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-activities',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <p><a routerLink="/">Inicio</a></p>
    <h1>Actividades</h1>
    <p>Compartimos retos, encuentros y espacios para aprender juntos en el clan.</p>
    <ul class="activities">
      @for (activity of activities; track activity.path; let first = $first) {
        <li>
          <a [routerLink]="activity.path">
            <img [ngSrc]="activity.image" width="1536" height="1024" [priority]="first" alt="">
            <h2>{{ activity.title }}</h2>
          </a>
          <p>{{ activity.description }}</p>
        </li>
      }
    </ul>`,
  styles: `
    h1 { font: bold 2.5rem var(--font-title); margin: 1rem 0; }
    .activities { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem 1.5rem; padding: 0; margin: 1.5rem 0 0; list-style: none; }
    .activities a { display: block; color: inherit; text-decoration: none; }
    .activities img { display: block; width: 100%; height: auto; image-rendering: pixelated; }
    .activities h2 { font: bold 1.6rem var(--font-title); margin: .7rem 0 .35rem; }
    .activities a:hover h2 { text-decoration: underline; }
    .activities p { max-width: 65ch; margin: 0; line-height: 1.6; }
    @media (max-width: 600px) { .activities { grid-template-columns: 1fr; gap: 2rem; } }
  `,
})
export class Activities {
  readonly activities = [
    { path: '/actividades/misiones', image: 'activities/misiones.png', title: 'Misiones', description: 'Las misiones semanales convierten la captura de Pokémon y la recolección de objetos en una forma de colaborar con el clan. Cada anuncio propone objetivos y recompensas: quienes los completan reciben un reconocimiento por su esfuerzo y, al mismo tiempo, contribuyen al progreso del equipo.' },
    { path: '/actividades/sorteos', image: 'activities/sorteos.png', title: 'Sorteos', description: 'Cada sorteo reúne la ilusión de ganar un cosmético o un Pokémon con la oportunidad de apoyar al clan. Socamaru anuncia el premio y coordina los números de los participantes; la recaudación permite conseguir la recompensa y el dinero restante ayuda a financiar eventos, premios y otras actividades del equipo.' },
    { path: '/actividades/eventos-semanales', image: 'activities/eventos-semanales.png', title: 'Eventos semanales', description: 'Los eventos semanales son una ocasión para dejar la rutina y compartir una aventura con el clan. Entre combates, capturas y otros retos de participación gratuita, sus integrantes pueden conocerse, divertirse y fortalecer el compañerismo. Cada encuentro deja sus ganadores y una historia que conservar en el álbum del equipo.' },
    { path: '/actividades/red-wings-academy', image: 'activities/red-wings-academy.png', title: 'Academia “Red Wings Academy”', description: 'Red Wings Academy transforma lo que cada miembro sabe en una oportunidad para que otros aprendan. A través de clases gratuitas sobre farmeos, crianza, PvP, economía y otras mecánicas, el clan comparte experiencia y ayuda a sus integrantes a mejorar. Alumnos e instructores coordinan los temas y horarios en el grupo de WhatsApp, y quienes desean enseñar pueden sumarse para compartir sus conocimientos.' },
  ];
}
