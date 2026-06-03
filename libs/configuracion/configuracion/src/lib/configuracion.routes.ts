import { Routes } from '@angular/router';

export const CONFIGURACION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general',
      },
      {
        path: 'general',
        loadComponent: () =>
          import('./pages/config-page/config-page.component').then(
            m => m.ConfigPageComponent,
          ),
      },
      {
        path: 'bienes/eliminar-masiva',
        loadComponent: () =>
          import(
            './pages/bien-delete-page/bien-delete-page.component'
          ).then(m => m.BienDeletePageComponent),
      },
    ],
  },
];
