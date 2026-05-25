import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@restaurant/shared/state';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ExportarConfig,
  FiltrosUsuarios,
  ImportarUsuariosRequest,
  UsuarioDetalle,
} from '../models/usuarios.model';
import { UsuariosActions } from './store/actions/usuarios.actions';
import { UsuariosState } from './store/reducers/usuarios.reducer';
import {
  selectError,
  selectHayError,
  selectHistorial,
  selectImportando,
  selectLoading,
  selectLoadingAccion,
  selectLoadingHistorial,
  selectMensajeExport,
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
  readonly mensajeExport$       = this.store.select(selectMensajeExport);
  readonly hayError$            = this.store.select(selectHayError);
  readonly historial$           = this.store.select(selectHistorial);
  readonly loadingHistorial$    = this.store.select(selectLoadingHistorial);

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

  exportarUsuarios(config: ExportarConfig): void {
    this.store.dispatch(UsuariosActions.exportarUsuarios({ config }));
  }

  seleccionarUsuario(usuario: UsuarioDetalle): void {
    this.store.dispatch(UsuariosActions.seleccionarUsuario({ usuario }));
  }

  limpiarSeleccion(): void {
    this.store.dispatch(UsuariosActions.limpiarSeleccion());
  }

  cargarHistorial(): void {
    this.store.dispatch(UsuariosActions.cargarHistorial());
  }
}
