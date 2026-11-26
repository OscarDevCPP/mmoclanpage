import { PokemonBuildCard } from './pokemon-build';
import { PILLARS } from './pillars-data';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pve-pilares',
  imports: [RouterLink, PokemonBuildCard],
  templateUrl: './pve-pilares.html',
  styleUrls: ['./pvp-fundamentos.css', './pve-pilares.css'],
})
export class PvePilares {
  readonly pillars = PILLARS;
}
