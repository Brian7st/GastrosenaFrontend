import { createFeature, createReducer, on } from '@ngrx/store';
import { HistorialItem, ImportarUsuariosResponse, RolDetalle, RolOpcion, UsuarioDetalle } from '../../../models/usuarios.model';
import { UsuariosActions } from '../actions/usuarios.actions';

export interface MensajeExport {
  texto: string;
  tipo:  'success' | 'error';
}

export interface UsuariosState {
  usuarios:            UsuarioDetalle[];
  roles:               RolOpcion[];
  usuarioSeleccionado: UsuarioDetalle | null;
  totalElements:       number;
  totalPages:          number;
  paginaActual:        number;
  loading:             boolean;
  loadingAccion:       boolean;
  error:               string | null;
  importando:          boolean;
  resultadoImport:     ImportarUsuariosResponse | null;
  mensajeExport:       MensajeExport | null;
  historial:           HistorialItem[];
  loadingHistorial:    boolean;
  rolesDetalle:        RolDetalle[];
  loadingRolesDetalle: boolean;
  loadingAsignacion:   boolean;
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
  mensajeExport:       null,
  historial:           [],
  loadingHistorial:    false,
  rolesDetalle:        [],
  loadingRolesDetalle: false,
  loadingAsignacion:   false,
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
    on(UsuariosActions.cargarRolesExitoso, (state, { roles }) => ({ ...state, roles })),
    on(UsuariosActions.cargarRolesFallido, (state, { error }) => ({ ...state, error })),

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
      ...state, loadingAccion: true, mensajeExport: null,
    })),
    on(UsuariosActions.exportarUsuariosExitoso, state => ({
      ...state,
      loadingAccion: false,
      mensajeExport: { texto: 'Exportación completada exitosamente.', tipo: 'success' as const },
    })),
    on(UsuariosActions.exportarUsuariosFallido, (state, { error }) => ({
      ...state,
      loadingAccion: false,
      error,
      mensajeExport: { texto: error, tipo: 'error' as const },
    })),

    // ── Roles detalle ─────────────────────────────────────────────────────────
    on(UsuariosActions.cargarRolesDetalle, state => ({
      ...state, loadingRolesDetalle: true,
    })),
    on(UsuariosActions.cargarRolesDetalleExitoso, (state, { roles }) => ({
      ...state, loadingRolesDetalle: false, rolesDetalle: roles,
    })),
    on(UsuariosActions.cargarRolesDetalleFallido, (state, { error }) => ({
      ...state, loadingRolesDetalle: false, error,
    })),

    // ── Asignación masiva de rol ──────────────────────────────────────────────
    on(UsuariosActions.asignarRolMasivo, state => ({
      ...state, loadingAsignacion: true, error: null,
    })),
    on(UsuariosActions.asignarRolMasivoExitoso, state => ({
      ...state, loadingAsignacion: false,
    })),
    on(UsuariosActions.asignarRolMasivoFallido, (state, { error }) => ({
      ...state, loadingAsignacion: false, error,
    })),

    // ── Historial ─────────────────────────────────────────────────────────────
    on(UsuariosActions.cargarHistorial, state => ({
      ...state, loadingHistorial: true,
    })),
    on(UsuariosActions.cargarHistorialExitoso, (state, { historial }) => ({
      ...state, loadingHistorial: false, historial,
    })),
    on(UsuariosActions.cargarHistorialFallido, (state, { error }) => ({
      ...state, loadingHistorial: false, error,
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
