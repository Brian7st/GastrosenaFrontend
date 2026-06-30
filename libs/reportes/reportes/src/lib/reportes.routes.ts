import { Routes } from '@angular/router';
import { ReportesPageComponent } from './ui/reportes-page.component';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    component: ReportesPageComponent,
  },
  {
    path: 'estadisticas-cocina',
    loadComponent: () => import('../estadisticas-cocina/estadisticas-page.component').then(m => m.EstadisticasPageComponent)
  }
];
