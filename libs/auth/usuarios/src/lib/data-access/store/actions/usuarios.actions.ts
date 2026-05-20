import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaginatedResponse } from '@restaurant/shared/models';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ExportarConfig,
  FiltrosUsuarios,
  ImportarUsuariosRequest,
  ImportarUsuariosResponse,
  RolOpcion,
  UsuarioDetalle,
} from '../../../models/usuarios.model';

export const UsuariosActions = createActionGroup({
  source: 'Usuarios',
  events: {
    // ── Cargar lista ──────────────────────────────────────────────────────────
    'Cargar Usuarios':          props<{ filtros?: Partial<FiltrosUsuarios> }>(),
    'Cargar Usuarios Exitoso':  props<{ response: PaginatedResponse<UsuarioDetalle> }>(),
    'Cargar Usuarios Fallido':  props<{ error: string }>(),

    // ── Cargar roles ──────────────────────────────────────────────────────────
    'Cargar Roles':             emptyProps(),
    'Cargar Roles Exitoso':     props<{ roles: RolOpcion[] }>(),
    'Cargar Roles Fallido':     props<{ error: string }>(),

    // ── Crear ─────────────────────────────────────────────────────────────────
    'Crear Usuario':            props<{ data: CrearUsuarioRequest }>(),
    'Crear Usuario Exitoso':    props<{ usuario: UsuarioDetalle }>(),
    'Crear Usuario Fallido':    props<{ error: string }>(),

    // ── Actualizar ────────────────────────────────────────────────────────────
    'Actualizar Usuario':           props<{ id: string; data: ActualizarUsuarioRequest }>(),
    'Actualizar Usuario Exitoso':   props<{ usuario: UsuarioDetalle }>(),
    'Actualizar Usuario Fallido':   props<{ error: string }>(),

    // ── Eliminar ──────────────────────────────────────────────────────────────
    'Eliminar Usuario':             props<{ id: string }>(),
    'Eliminar Usuario Exitoso':     props<{ id: string }>(),
    'Eliminar Usuario Fallido':     props<{ error: string }>(),

    // ── Activar ───────────────────────────────────────────────────────────────
    'Activar Usuario':              props<{ id: string }>(),
    'Activar Usuario Exitoso':      props<{ usuario: UsuarioDetalle }>(),
    'Activar Usuario Fallido':      props<{ error: string }>(),

    // ── Desactivar ────────────────────────────────────────────────────────────
    'Desactivar Usuario':           props<{ id: string }>(),
    'Desactivar Usuario Exitoso':   props<{ usuario: UsuarioDetalle }>(),
    'Desactivar Usuario Fallido':   props<{ error: string }>(),

    // ── Desbloquear cuenta ────────────────────────────────────────────────────
    'Desbloquear Cuenta':           props<{ id: string }>(),
    'Desbloquear Cuenta Exitoso':   props<{ usuario: UsuarioDetalle }>(),
    'Desbloquear Cuenta Fallido':   props<{ error: string }>(),

    // ── Importar masivo ───────────────────────────────────────────────────────
    'Importar Masivo':              props<{ request: ImportarUsuariosRequest }>(),
    'Importar Masivo Exitoso':      props<{ resultado: ImportarUsuariosResponse }>(),
    'Importar Masivo Fallido':      props<{ error: string }>(),

    // ── Exportar ──────────────────────────────────────────────────────────────
    'Exportar Usuarios':            props<{ config: ExportarConfig }>(),
    'Exportar Usuarios Exitoso':    emptyProps(),
    'Exportar Usuarios Fallido':    props<{ error: string }>(),

    // ── Selección local ───────────────────────────────────────────────────────
    'Seleccionar Usuario':          props<{ usuario: UsuarioDetalle }>(),
    'Limpiar Seleccion':            emptyProps(),
  },
});
