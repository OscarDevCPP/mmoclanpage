import { Routes } from '@angular/router';
import { Home } from './home';
import { GUIDES } from './guide-catalog';

export const routes: Routes = [
  { path: '', component: Home, title: 'Black Talon', pathMatch: 'full' },
  ...GUIDES.map(guide => ({ path: guide.path.slice(1), title: `${guide.title} · El Compendio · Black Talon`, loadComponent: guide.loadComponent })),
  { path: 'compendio', title: 'El Compendio · Black Talon', loadComponent: () => import('./resources').then(m => m.Resources) },
  { path: 'recuerdos', title: 'Recuerdos · Black Talon', loadComponent: () => import('./memories').then(m => m.Memories) },
  { path: 'actividades', title: 'Actividades · Black Talon', loadComponent: () => import('./activities').then(m => m.Activities) },
  { path: 'actividades/eventos-semanales', title: 'Eventos semanales · Black Talon', loadComponent: () => import('./events').then(m => m.Events) },
  { path: 'actividades/sorteos', title: 'Sorteos · Black Talon', loadComponent: () => import('./sorteos').then(m => m.Sorteos) },
  { path: 'actividades/red-wings-academy', title: 'Red Wings Academy · Black Talon', loadComponent: () => import('./academy').then(m => m.Academy) },
  { path: 'actividades/misiones', title: 'Misiones · Black Talon', loadComponent: () => import('./missions').then(m => m.Missions) },
];
