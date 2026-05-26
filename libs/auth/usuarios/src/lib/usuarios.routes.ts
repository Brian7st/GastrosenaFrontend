import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as UsuariosEffects from './data-access/store/effects/usuarios.effects';
import { usuariosFeature } from './data-access/store/reducers/usuarios.reducer';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-page/lista-page.component').then(
        m => m.ListaPageComponent,
      ),
    providers: [
      provideState(usuariosFeature),
      provideEffects(UsuariosEffects),
    ],
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
];