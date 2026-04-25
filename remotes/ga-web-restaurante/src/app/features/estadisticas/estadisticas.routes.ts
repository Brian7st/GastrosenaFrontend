import { Routes } from '@angular/router';
import { EstadisticasComponent } from './estadisticas.component';
import { EstadisticasPageComponent } from './pages/estadisticas-page/estadisticas-page.component';

export const ESTADISTICAS_ROUTES: Routes = [
  {
    path: '',
    component: EstadisticasComponent,
    children: [
      {
        path: '',
        component: EstadisticasPageComponent
      }
    ]
  }
];
