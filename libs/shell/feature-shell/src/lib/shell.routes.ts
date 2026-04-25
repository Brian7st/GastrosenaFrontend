import { Routes } from '@angular/router';
import { Rol } from '@restaurant/shared/models';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ShellLayoutComponent } from './shell-layout/shell-layout.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

export const shellRoutes: Routes = [
  // ── Ruta pública: landing page ──────────────────────────────────────────
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@restaurant/feature-home').then(m => m.HOME_ROUTES),
      },
    ],
  },

  // ── Auth: login, recuperar contraseña ───────────────────────────────────
  {
    path: 'auth',
    loadChildren: () => import('@restaurant/feature-auth').then(m => m.AUTH_ROUTES),
  },

  // ── Shell autenticado: todos los módulos de negocio ──────────────────────
  {
    path: 'app',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventario',
      },
      {
        path: 'cocina',
        canActivate: [roleGuard([Rol.CHEF, Rol.ADMIN_COCINA, Rol.AUXILIAR_COCINA])],
        loadChildren: () => import('@restaurant/feature-cocina').then(m => m.COCINA_ROUTES),
      },
      {
        path: 'bar',
        canActivate: [roleGuard([Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER])],
        loadChildren: () => import('@restaurant/feature-bar').then(m => m.BAR_ROUTES),
      },
      {
        path: 'restaurante',
        loadChildren: () =>
          import('@restaurant/feature-restaurante').then(m => m.RESTAURANTE_ROUTES),
      },
      {
        path: 'inventario',
        canActivate: [roleGuard([Rol.ADMINISTRADOR, Rol.CONTADORA])],
        loadChildren: () =>
          import('@restaurant/feature-inventario').then(m => m.INVENTARIO_ROUTES),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('@restaurant/feature-usuarios').then(m => m.USUARIOS_ROUTES),
      },
      {
        path: 'reportes',
        loadChildren: () => import('@restaurant/feature-reportes').then(m => m.REPORTES_ROUTES),
      },
      {
        path: 'facturacion',
        loadChildren: () =>
          import('@restaurant/feature-facturacion').then(m => m.FACTURACION_ROUTES),
      },
      {
        path: 'abastecimiento',
        loadChildren: () =>
          import('@restaurant/feature-abastecimiento').then(m => m.ABASTECIMIENTO_ROUTES),
      },
      {
        path: 'presupuesto',
        loadChildren: () =>
          import('@restaurant/feature-presupuesto').then(m => m.PRESUPUESTO_ROUTES),
      },
      {
        path: 'requisiciones',
        loadChildren: () =>
          import('@restaurant/feature-requisiciones').then(m => m.REQUISICIONES_ROUTES),
      },
      {
        path: 'notificaciones',
        loadChildren: () =>
          import('@restaurant/feature-notificaciones').then(m => m.NOTIFICACIONES_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
