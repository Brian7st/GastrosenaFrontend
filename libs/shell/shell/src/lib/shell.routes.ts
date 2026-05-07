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
          import('@restaurant/home').then(m => m.HOME_ROUTES),
      },
    ],
  },

  // ── Auth: login, recuperar contraseña ───────────────────────────────────
  {
    path: 'auth',
    loadChildren: () => import('@restaurant/auth').then(m => m.AUTH_ROUTES),
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
        loadChildren: () => import('@restaurant/cocina').then(m => m.COCINA_ROUTES),
      },
      {
        path: 'bar',
        canActivate: [roleGuard([Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER])],
        loadChildren: () => import('@restaurant/bar').then(m => m.BAR_ROUTES),
      },
      {
        path: 'restaurante',
        loadChildren: () =>
          import('@restaurant/restaurante').then(m => m.RESTAURANTE_ROUTES),
      },
      {
        path: 'inventario',
        canActivate: [roleGuard([Rol.ADMINISTRADOR, Rol.CONTADORA])],
        loadChildren: () =>
          import('@restaurant/inventario').then(m => m.INVENTARIO_ROUTES),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('@restaurant/usuarios').then(m => m.USUARIOS_ROUTES),
      },
      {
        path: 'reportes',
        loadChildren: () => import('@restaurant/reportes').then(m => m.REPORTES_ROUTES),
      },
      {
        path: 'abastecimiento',
        loadChildren: () =>
          import('@restaurant/abastecimiento').then(m => m.ABASTECIMIENTO_ROUTES),
      },
      {
        path: 'notificaciones',
        loadChildren: () =>
          import('@restaurant/notificaciones').then(m => m.NOTIFICACIONES_ROUTES),
      },
    ],
  },

  // ── Showcase — herramienta de revisión del sistema de diseño (sin auth) ──
  {
    path: 'showcase',
    loadComponent: () =>
      import('./showcase/showcase.component').then(m => m.ShowcaseComponent),
  },

  { path: '**', redirectTo: '' },
];
