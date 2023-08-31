import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'tutor',
    loadComponent: () => import('./tutor/tutor.page').then( m => m.TutorPage)
  },
  {
    path: 'servico',
    loadComponent: () => import('./servico/servico.page').then( m => m.ServicoPage)
  },
  {
    path: 'pet',
    loadComponent: () => import('./pet/pet.page').then( m => m.PetPage)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.page').then( m => m.AgendaPage)
  },
];
