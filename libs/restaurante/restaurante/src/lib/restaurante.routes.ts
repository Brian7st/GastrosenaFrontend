import { Routes } from '@angular/router';
import { MesasPageComponent } from './pages/mesas-page/mesas-page.component';
import { PedidosPageComponent } from './pages/pedidos-page/pedidos-page.component';
import { CajaPageComponent } from './pages/caja-page/caja-page.component';
import { CajaNuevaPageComponent } from './pages/caja-nueva-page/caja-nueva-page.component';
import { CajaBuscarPageComponent } from './pages/caja-buscar-page/caja-buscar-page.component';
import { CajaPagarPageComponent } from './pages/caja-pagar-page/caja-pagar-page.component';

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
  {
    path: 'caja/nueva',
    component: CajaNuevaPageComponent,
  },
  {
    path: 'caja/buscar',
    component: CajaBuscarPageComponent,
  },
  {
    path: 'caja/pagar',
    component: CajaPagarPageComponent,
  },
];

