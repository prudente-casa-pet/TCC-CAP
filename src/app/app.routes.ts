import { Routes } from '@angular/router';
import { IsLoginGuard } from './_guard/login.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.page').then( m => m.AgendaPage),
    canActivate: [IsLoginGuard]

  },
  {
    path: '',
    redirectTo: 'agenda',
    pathMatch: 'full',
  },
  {
    path: 'tutor',
    loadComponent: () => import('./tutor/tutor.page').then( m => m.TutorPage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'servico',
    loadComponent: () => import('./servico/servico.page').then( m => m.ServicoPage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'pet',
    loadComponent: () => import('./pet/pet.page').then( m => m.PetPage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'procedimentos',
    loadComponent: () => import('./procedimentos/procedimentos.page').then( m => m.ProcedimentosPage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'pacote',
    loadComponent: () => import('./pacote/pacote.page').then( m => m.PacotePage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'pagamento-efetuado',
    loadComponent: () => import('./pagamento-efetuado/pagamento-efetuado.page').then( m => m.PagamentoEfetuadoPage),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'pagamento-pendente',
    loadComponent: () => import('./pagamento-pendente/pagamento-pendente.page').then( m => m.PagamentoPendentePage),
    canActivate: [IsLoginGuard]
  }
];
