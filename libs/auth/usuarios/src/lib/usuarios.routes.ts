import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as UsuariosEffects from './data-access/store/effects/usuarios.effects';
import { usuariosFeature } from './data-access/store/reducers/usuarios.reducer';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(usuariosFeature),
      provideEffects(UsuariosEffects),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/lista-page/lista-page.component').then(
            m => m.ListaPageComponent,
          ),
      },
      {
        path: 'lista',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil-page/perfil-page.component').then(
            m => m.PerfilPageComponent,
          ),
      },
      {
        path: 'cuentas',
        loadComponent: () =>
          import('./pages/cuentas-page/cuentas-page.component').then(
            m => m.CuentasPageComponent,
          ),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial-page/historial-page.component').then(
            m => m.HistorialPageComponent,
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles-page/roles-page.component').then(
            m => m.RolesPageComponent,
          ),
      },
    ],
  },
];