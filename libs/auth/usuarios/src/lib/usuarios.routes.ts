import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-page/lista-page.component').then(
        m => m.ListaPageComponent,
      ),
  },
];
