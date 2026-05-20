import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Usuario } from '@restaurant/shared/models';
import { AppState } from '@restaurant/shared/state';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  FiltrosUsuarios,
  ImportarUsuariosRequest,
} from '../models/usuarios.model';
import { UsuariosActions } from './store/actions/usuarios.actions';
import { UsuariosState } from './store/reducers/usuarios.reducer';
import {
  selectError,
  selectHayError,
  selectImportando,
  selectLoadingAccion,
  selectLoading,
  selectResultadoImport,
  selectRoles,
  selectTotalActivos,
  selectTotalElements,
  selectTotalInactivos,
  selectUsuarioSeleccionado,
  selectUsuarios,
} from './store/selectors/usuarios.selectors';

type LocalState = AppState & { readonly usuarios: UsuariosState };

@Injectable({ providedIn: 'root' })
export class UsuariosFacade {
  private readonly store = inject<Store<LocalState>>(Store);

  // ── Observables ───────────────────────────────────────────────────────────
  readonly usuarios$            = this.store.select(selectUsuarios);
  readonly roles$               = this.store.select(selectRoles);
  readonly usuarioSeleccionado$ = this.store.select(selectUsuarioSeleccionado);
  readonly totalElements$       = this.store.select(selectTotalElements);
  readonly loading$             = this.store.select(selectLoading);
  readonly loadingAccion$       = this.store.select(selectLoadingAccion);
  readonly error$               = this.store.select(selectError);
  readonly totalActivos$        = this.store.select(selectTotalActivos);
  readonly totalInactivos$      = this.store.select(selectTotalInactivos);
  readonly importando$          = this.store.select(selectImportando);
  readonly resultadoImport$     = this.store.select(selectResultadoImport);
  readonly hayError$            = this.store.select(selectHayError);

  // ── Comandos ──────────────────────────────────────────────────────────────
  cargarUsuarios(filtros?: Partial<FiltrosUsuarios>): void {
    this.store.dispatch(UsuariosActions.cargarUsuarios({ filtros }));
  }

  cargarRoles(): void {
    this.store.dispatch(UsuariosActions.cargarRoles());
  }

  crearUsuario(data: CrearUsuarioRequest): void {
    this.store.dispatch(UsuariosActions.crearUsuario({ data }));
  }

  actualizarUsuario(id: string, data: ActualizarUsuarioRequest): void {
    this.store.dispatch(UsuariosActions.actualizarUsuario({ id, data }));
  }

  eliminarUsuario(id: string): void {
    this.store.dispatch(UsuariosActions.eliminarUsuario({ id }));
  }

  activarUsuario(id: string): void {
    this.store.dispatch(UsuariosActions.activarUsuario({ id }));
  }

  desactivarUsuario(id: string): void {
    this.store.dispatch(UsuariosActions.desactivarUsuario({ id }));
  }

  desbloquearCuenta(id: string): void {
    this.store.dispatch(UsuariosActions.desbloquearCuenta({ id }));
  }

  importarMasivo(request: ImportarUsuariosRequest): void {
    this.store.dispatch(UsuariosActions.importarMasivo({ request }));
  }

  exportarUsuarios(): void {
    this.store.dispatch(UsuariosActions.exportarUsuarios());
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.store.dispatch(UsuariosActions.seleccionarUsuario({ usuario }));
  }

  limpiarSeleccion(): void {
    this.store.dispatch(UsuariosActions.limpiarSeleccion());
  }
}
