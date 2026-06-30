import { Routes } from '@angular/router';
import { Rol } from '@restaurant/shared/models';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { permissionGuard } from './guards/permission.guard';
import { ShellLayoutComponent } from './shell-layout/shell-layout.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

export const shellRoutes: Routes = [
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
  {
    path: 'auth',
    loadChildren: () => import('@restaurant/auth').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'app',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@restaurant/home').then(m => m.DashboardPageComponent),
      },
      {
        path: 'cocina',
        canActivate: [permissionGuard(['RECETAS_GESTIONAR', 'RECETAS_CONSULTAR', 'COMANDAS_CONSULTAR', 'PEDIDOS_ACTIVOS_VISUALIZAR'])],
        loadChildren: () => import('@restaurant/cocina').then(m => m.COCINA_ROUTES),
      },
      {
        path: 'bar',
        canActivate: [permissionGuard(['COMANDAS_CONSULTAR', 'RECETAS_CONSULTAR', 'PEDIDOS_ACTIVOS_VISUALIZAR'])],
        loadChildren: () => import('@restaurant/bar').then(m => m.BAR_ROUTES),
      },
      {
        path: 'restaurante',
        canActivate: [permissionGuard(['MODULO_MESAS_VER', 'MESAS_CONSULTAR', 'COMANDAS_CREAR', 'PEDIDOS_ACTIVOS_VISUALIZAR', 'FACTURAS_GENERAR'])],
        loadChildren: () =>
          import('@restaurant/restaurante').then(m => m.RESTAURANTE_ROUTES),
      },
      {
        path: 'inventario',
        canActivate: [permissionGuard([
          'bienes:ver', 'facturas:ver', 'consolidado:ver', 'alertas:ver', 'FACTURAS_GENERAR',
          // Acceso de legalización/formación (INSTRUCTOR) — el guard pasa con cualquiera de estos.
          'MODULO_LEGALIZACION_VER', 'requisiciones:ver', 'actas:ver', 'paquete:ver', 'solicitudes:ver',
        ])],
        loadChildren: () =>
          import('@restaurant/inventario').then(m => m.INVENTARIO_ROUTES),
      },
      {
        path: 'usuarios',
        canActivate: [permissionGuard(['USUARIOS_LISTAR', 'USUARIOS_VER'])],
        loadChildren: () => import('@restaurant/usuarios').then(m => m.USUARIOS_ROUTES),
      },

          {
      path: 'fichas',
      canActivate: [roleGuard([Rol.ADMINISTRADOR, Rol.INSTRUCTOR])], // solo ADMINISTRADOR e INSTRUCTOR pueden ver fichas
      loadComponent: () => import('@restaurant/usuarios').then(m => m.FichasPageComponent),
    },
    
      {
        path: 'reportes',
        canActivate: [permissionGuard(['MODULO_REPORTES_VER', 'REPORTES_GESTIONAR', 'REPORTES_PEDIDOS_COCINA', 'REPORTES_VENTAS_MESERO'])],
        loadChildren: () => import('@restaurant/reportes').then(m => m.REPORTES_ROUTES),
      },
      {
        path: 'abastecimiento',
        canActivate: [roleGuard([Rol.ADMINISTRADOR, Rol.CONTADORA])],
        loadChildren: () =>
          import('@restaurant/abastecimiento').then(m => m.ABASTECIMIENTO_ROUTES),
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('@restaurant/configuracion').then(m => m.CONFIGURACION_ROUTES),
      },
{ path: 'notificaciones', loadComponent: () => import('@restaurant/notificaciones').then(m => m.NotificacionesPageComponent) },
      {
        path: 'perfil',
        loadComponent: () => import('@restaurant/usuarios').then(m => m.PerfilPageComponent),
      },
    ],
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./showcase/showcase.component').then(m => m.ShowcaseComponent),
  },
  { path: '**', redirectTo: '' },
];