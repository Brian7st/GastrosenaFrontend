import { Routes } from '@angular/router';
import { MesasPageComponent } from './pages/mesas-page/mesas-page.component';

export const RESTAURANTE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'mesas'
  },
  {
    path: 'mesas',
    component: MesasPageComponent,
  },
];

