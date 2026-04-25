import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'restaurante',
        loadComponent: () =>
          import('./features/restaurante/restaurante.component').then(m => m.RestauranteComponent)
      },
      {
        path: 'comandas',
        loadChildren: () =>
          import('./features/comandas/comandas.routes').then(m => m.COMANDAS_ROUTES)
      },
      {
        path: 'estadisticas', // Esta es la URL que pondrás en el navegador
        loadChildren: () => import('./features/estadisticas/estadisticas.routes')
          .then(m => m.ESTADISTICAS_ROUTES)
      },
      {
        path: 'facturacion',
        loadChildren: () =>
          import('./features/facturacion/facturacion.routes').then(m => m.FACTURACION_ROUTES)
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/configuracion/configuracion.component').then(m => m.ConfiguracionComponent)
      }
    ]
  }
];
