import { createFeature, createReducer, on } from '@ngrx/store';
import { Usuario } from '@restaurant/shared/models';
import { ImportarUsuariosResponse, RolOpcion } from '../../../models/usuarios.model';
import { UsuariosActions } from '../actions/usuarios.actions';

export interface UsuariosState {
  usuarios:            Usuario[];
  roles:               RolOpcion[];
  usuarioSeleccionado: Usuario | null;
  totalElements:       number;
  totalPages:          number;
  paginaActual:        number;
  loading:             boolean;
  loadingAccion:       boolean;
  error:               string | null;
  importando:          boolean;
  resultadoImport:     ImportarUsuariosResponse | null;
}

const initialState: UsuariosState = {
  usuarios:            [],
  roles:               [],
  usuarioSeleccionado: null,
  totalElements:       0,
  totalPages:          0,
  paginaActual:        0,
  loading:             false,
  loadingAccion:       false,
  error:               null,
  importando:          false,
  resultadoImport:     null,
};

export const usuariosFeature = createFeature({
  name: 'usuarios',
  reducer: createReducer(
    initialState,

    // ── Cargar lista ──────────────────────────────────────────────────────────
    on(UsuariosActions.cargarUsuarios, state => ({
      ...state, loading: true, error: null,
    })),
    on(UsuariosActions.cargarUsuariosExitoso, (state, { response }) => ({
      ...state,
      loading:       false,
      usuarios:      response.content,
      totalElements: response.totalElements,
      totalPages:    response.totalPages,
      paginaActual:  response.currentPage,
    })),
    on(UsuariosActions.cargarUsuariosFallido, (state, { error }) => ({
      ...state, loading: false, error,
    })),

    // ── Cargar roles ──────────────────────────────────────────────────────────
    on(UsuariosActions.cargarRolesExitoso, (state, { roles }) => ({
      ...state, roles,
    })),
    on(UsuariosActions.cargarRolesFallido, (state, { error }) => ({
      ...state, error,
    })),

    // ── Crear ─────────────────────────────────────────────────────────────────
    on(UsuariosActions.crearUsuario, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.crearUsuarioExitoso, (state, { usuario }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      [...state.usuarios, usuario],
      totalElements: state.totalElements + 1,
    })),
    on(UsuariosActions.crearUsuarioFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Actualizar ────────────────────────────────────────────────────────────
    on(UsuariosActions.actualizarUsuario, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.actualizarUsuarioExitoso, (state, { usuario }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      state.usuarios.map(u => u.id === usuario.id ? usuario : u),
    })),
    on(UsuariosActions.actualizarUsuarioFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Eliminar ──────────────────────────────────────────────────────────────
    on(UsuariosActions.eliminarUsuario, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.eliminarUsuarioExitoso, (state, { id }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      state.usuarios.filter(u => u.id !== id),
      totalElements: state.totalElements - 1,
    })),
    on(UsuariosActions.eliminarUsuarioFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Activar ───────────────────────────────────────────────────────────────
    on(UsuariosActions.activarUsuario, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.activarUsuarioExitoso, (state, { usuario }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      state.usuarios.map(u => u.id === usuario.id ? usuario : u),
    })),
    on(UsuariosActions.activarUsuarioFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Desactivar ────────────────────────────────────────────────────────────
    on(UsuariosActions.desactivarUsuario, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.desactivarUsuarioExitoso, (state, { usuario }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      state.usuarios.map(u => u.id === usuario.id ? usuario : u),
    })),
    on(UsuariosActions.desactivarUsuarioFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Desbloquear cuenta ────────────────────────────────────────────────────
    on(UsuariosActions.desbloquearCuenta, state => ({
      ...state, loadingAccion: true, error: null,
    })),
    on(UsuariosActions.desbloquearCuentaExitoso, (state, { usuario }) => ({
      ...state,
      loadingAccion: false,
      usuarios:      state.usuarios.map(u => u.id === usuario.id ? usuario : u),
    })),
    on(UsuariosActions.desbloquearCuentaFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Importar masivo ───────────────────────────────────────────────────────
    on(UsuariosActions.importarMasivo, state => ({
      ...state, importando: true, error: null, resultadoImport: null,
    })),
    on(UsuariosActions.importarMasivoExitoso, (state, { resultado }) => ({
      ...state, importando: false, resultadoImport: resultado,
    })),
    on(UsuariosActions.importarMasivoFallido, (state, { error }) => ({
      ...state, importando: false, error,
    })),

    // ── Exportar ──────────────────────────────────────────────────────────────
    on(UsuariosActions.exportarUsuarios, state => ({
      ...state, loadingAccion: true,
    })),
    on(UsuariosActions.exportarUsuariosExitoso, state => ({
      ...state, loadingAccion: false,
    })),
    on(UsuariosActions.exportarUsuariosFallido, (state, { error }) => ({
      ...state, loadingAccion: false, error,
    })),

    // ── Selección local ───────────────────────────────────────────────────────
    on(UsuariosActions.seleccionarUsuario, (state, { usuario }) => ({
      ...state, usuarioSeleccionado: usuario,
    })),
    on(UsuariosActions.limpiarSeleccion, state => ({
      ...state, usuarioSeleccionado: null,
    })),
  ),
});
