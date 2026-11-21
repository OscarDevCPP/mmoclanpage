import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-missions', imports: [RouterLink], templateUrl: './missions.html', styleUrl: './missions.css'
})
export class Missions {
  readonly discovery = signal('Elige una ilustración para saber más.');
  readonly selectedBoard = signal<string | null>(null);
  readonly board = signal('Consulta el anuncio semanal para conocer los detalles.');
  readonly pokemon = signal(false);
  readonly objects = signal(false);
  readonly mail = signal(1);
  readonly preview = signal(false);
  readonly prize = signal(false);
  readonly ticket = signal(false);

}
