import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard-home/dashboard-home')
            .then(m => m.DashboardHome)
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../usuarios/usuarios.routes')
            .then(m => m.USUARIOS_ROUTES)
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('../reportes/reportes.routes')
            .then(m => m.REPORTES_ROUTES)
      }
    ]
  }
];
