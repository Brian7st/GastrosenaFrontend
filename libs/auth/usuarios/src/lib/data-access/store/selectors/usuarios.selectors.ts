import { createSelector } from '@ngrx/store';
import { usuariosFeature } from '../reducers/usuarios.reducer';

export const {
  selectUsuarios,
  selectRoles,
  selectUsuarioSeleccionado,
  selectTotalElements,
  selectTotalPages,
  selectPaginaActual,
  selectLoading,
  selectLoadingAccion,
  selectError,
  selectImportando,
  selectResultadoImport,
  selectMensajeExport,
  selectHistorial,
  selectLoadingHistorial,
} = usuariosFeature;

export const selectTotalActivos = createSelector(
  selectUsuarios,
  usuarios => usuarios.filter(u => u.activo).length,
);

export const selectTotalInactivos = createSelector(
  selectUsuarios,
  usuarios => usuarios.filter(u => !u.activo).length,
);

export const selectUsuariosCargados = createSelector(
  selectUsuarios,
  usuarios => usuarios.length > 0,
);

export const selectHayError = createSelector(
  selectError,
  error => error !== null,
);
