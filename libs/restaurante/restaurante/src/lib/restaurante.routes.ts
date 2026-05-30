import { Routes } from '@angular/router';
import { MesasPageComponent } from './pages/mesas-page/mesas-page.component';
import { PedidosPageComponent } from './pages/pedidos-page/pedidos-page.component';
import { CajaPageComponent } from './pages/caja-page/caja-page.component';
import { CajaNuevaPageComponent } from './pages/caja-nueva-page/caja-nueva-page.component';
import { CajaBuscarPageComponent } from './pages/caja-buscar-page/caja-buscar-page.component';
import { CajaPagarPageComponent } from './pages/caja-pagar-page/caja-pagar-page.component';
import { CajaAperturaPageComponent } from './pages/caja-apertura-page/caja-apertura-page.component';
import { CajaCierrePageComponent } from './pages/caja-cierre-page/caja-cierre-page.component';
import { CajaMovimientosPageComponent } from './pages/caja-movimientos-page/caja-movimientos-page.component';
import { PedidosHubPageComponent } from './pages/pedidos-hub-page/pedidos-hub-page.component';
import { HistorialInstructorPageComponent } from './pages/historial-instructor-page/historial-instructor-page.component';
import { HistorialEstudiantePageComponent } from './pages/historial-estudiante-page/historial-estudiante-page.component';
import { provideLucideIcons, LucideSalad, LucideBeef, LucideCake, LucideLayoutGrid, LucideCoffee, LucideMinus, LucidePlus, LucideClipboardList, LucideUser, LucideArrowLeft, LucideChevronDown, LucideSearch, LucideTrash2, LucideUtensils, LucideUsers, LucidePencil, LucideLoader, LucideAlertTriangle, LucideX, LucideCheckCircle, LucideSave } from '@lucide/angular';

export const RESTAURANTE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideLucideIcons(LucideSalad, LucideBeef, LucideCake, LucideLayoutGrid, LucideCoffee, LucideMinus, LucidePlus, LucideClipboardList, LucideUser, LucideArrowLeft, LucideChevronDown, LucideSearch, LucideTrash2, LucideUtensils, LucideUsers, LucidePencil, LucideLoader, LucideAlertTriangle, LucideX, LucideCheckCircle, LucideSave)
    ],
    children: [
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
        path: 'historial-pedidos',
        component: PedidosHubPageComponent,
      },
      {
        path: 'historial-instructor',
        component: HistorialInstructorPageComponent,
      },
      {
        path: 'historial-estudiante',
        component: HistorialEstudiantePageComponent,
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
      {
        path: 'caja/apertura',
        component: CajaAperturaPageComponent,
      },
      {
        path: 'caja/cierre',
        component: CajaCierrePageComponent,
      },
      {
        path: 'caja/movimientos',
        component: CajaMovimientosPageComponent,
      },
    ]
  }
];
