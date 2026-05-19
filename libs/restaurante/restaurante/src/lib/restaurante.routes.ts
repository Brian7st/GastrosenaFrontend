import { Routes } from '@angular/router';
import { MesasPageComponent } from './pages/mesas-page/mesas-page.component';
import { PedidosPageComponent } from './pages/pedidos-page/pedidos-page.component';
import { CajaPageComponent } from './pages/caja-page/caja-page.component';

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
  {
    path: 'pedidos',
    component: PedidosPageComponent,
  },
  {
    path: 'caja',
    component: CajaPageComponent,
  },
];
