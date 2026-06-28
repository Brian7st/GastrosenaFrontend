import { Routes, Router } from '@angular/router';
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
import {
  provideLucideIcons,
  LucideSalad, LucideBeef, LucideCake, LucideLayoutGrid, LucideCoffee,
  LucideMinus, LucidePlus, LucideClipboardList, LucideUser, LucideArrowLeft,
  LucideChevronDown, LucideSearch, LucideTrash2, LucideUtensils, LucideUsers,
  LucidePencil, LucideLoader, LucideAlertTriangle, LucideX, LucideCheckCircle,
  LucideSave, LucideCreditCard, LucideFileText, LucideWallet, LucideLogIn,
  LucideLogOut, LucideArrowLeftRight, LucideBanknote, LucideLock,
  LucideFileCheck2, LucidePrinter, LucideSend, LucideCheckCircle2,
  LucideReceipt, LucideDownload
} from '@lucide/angular';
import { inject } from '@angular/core';
import { AuthService } from './data-access/auth.service';
import { RestauranteFacade } from './data-access/restaurante.facade';


const cajaGuard = () => {
  const auth = inject(AuthService);
  const facade = inject(RestauranteFacade);
  // Se añaden permisos explícitos (MODULO_FACTURACION_VER) que envía el backend real
  const permitidos = ['ROLE_CAJERO', 'CAJERO', 'ROLE_ADMIN', 'ADMINISTRADOR', 'ROLE_INSTRUCTOR', 'INSTRUCTOR', 'ADMINISTRADOR_SISTEMA', 'ROLE_ADMINISTRADOR_SISTEMA', 'ADMIN', 'MODULO_FACTURACION_VER'];
  if (auth.hasAnyRole(permitidos)) {
    return true;
  }
  facade.abrirModalAccesoDenegado();
  return false;
};

export const RESTAURANTE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideLucideIcons(
        LucideSalad, LucideBeef, LucideCake, LucideLayoutGrid, LucideCoffee,
        LucideMinus, LucidePlus, LucideClipboardList, LucideUser, LucideArrowLeft,
        LucideChevronDown, LucideSearch, LucideTrash2, LucideUtensils, LucideUsers,
        LucidePencil, LucideLoader, LucideAlertTriangle, LucideX, LucideCheckCircle,
        LucideSave, LucideCreditCard, LucideFileText, LucideWallet, LucideLogIn,
        LucideLogOut, LucideArrowLeftRight, LucideBanknote, LucideLock,
        LucideFileCheck2, LucidePrinter, LucideSend, LucideCheckCircle2,
        LucideReceipt, LucideDownload
      )
    ],
    children: [
{
  path: '',
  pathMatch: 'full',
  redirectTo: '',
  canActivate: [() => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.hasAnyRole(['CAJERO', 'ROLE_CAJERO', 'PAGOS_REGISTRAR'])) {
      return router.createUrlTree(['caja']);
    }
    return router.createUrlTree(['mesas']);
  }]
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
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/nueva',
        component: CajaNuevaPageComponent,
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/buscar',
        component: CajaBuscarPageComponent,
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/pagar',
        component: CajaPagarPageComponent,
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/apertura',
        component: CajaAperturaPageComponent,
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/cierre',
        component: CajaCierrePageComponent,
        canActivate: [cajaGuard]
      },
      {
        path: 'caja/movimientos',
        component: CajaMovimientosPageComponent,
        canActivate: [cajaGuard]
      },
    ]
  }
];