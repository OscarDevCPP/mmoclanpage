import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-activities', imports: [RouterLink],
  template: `
    <p><a routerLink="/">Inicio</a></p>
    <h1>Actividades</h1>
    <p>Compartimos retos, encuentros y espacios para aprender juntos en el clan.</p>
    <ul class="activity-list">
      <li><a routerLink="/actividades/misiones"><img src="/activities/misiones.png" alt=""><span>Misiones</span></a></li>
      <li><a routerLink="/actividades/sorteos"><img src="/activities/sorteos.png" alt=""><span>Sorteos</span></a></li>
      <li><a routerLink="/actividades/eventos-semanales"><img src="/activities/eventos-semanales.png" alt=""><span>Eventos semanales</span></a></li>
      <li><div class="activity-unavailable"><img src="/activities/red-wings-academy.png" alt=""><span>Academia 'Red Wings Academy'</span><small>Próximamente</small></div></li>
    </ul>`,
  styles: `h1 { font: bold 2.5rem var(--font-title); margin: 1rem 0; }`
})
export class Activities {}
