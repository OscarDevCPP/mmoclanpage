import { Routes } from '@angular/router';
import { Home } from './home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Black Talon', pathMatch: 'full' },
  { path: 'recuerdos', title: 'Recuerdos · Black Talon', loadComponent: () => import('./memories').then(m => m.Memories) },
  { path: 'actividades', title: 'Actividades · Black Talon', loadComponent: () => import('./activities').then(m => m.Activities) },
  { path: 'actividades/eventos-semanales', title: 'Eventos semanales · Black Talon', loadComponent: () => import('./events').then(m => m.Events) },
  { path: 'actividades/sorteos', title: 'Sorteos · Black Talon', loadComponent: () => import('./sorteos').then(m => m.Sorteos) },
  { path: 'actividades/red-wings-academy', title: 'Red Wings Academy · Black Talon', loadComponent: () => import('./academy').then(m => m.Academy) },
  { path: 'actividades/misiones', title: 'Misiones · Black Talon', loadComponent: () => import('./missions').then(m => m.Missions) },
];
