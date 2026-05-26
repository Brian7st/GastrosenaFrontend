import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';
import { UsuariosActions } from '../actions/usuarios.actions';
import { UsuariosService } from '../../usuarios.service';

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Error inesperado. Intente nuevamente.';
}

export const cargarUsuarios$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.cargarUsuarios),
      switchMap(({ filtros }) =>
        svc.getUsuarios(filtros).pipe(
          map(response => UsuariosActions.cargarUsuariosExitoso({ response })),
          catchError((err: unknown) =>
            of(UsuariosActions.cargarUsuariosFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const cargarRoles$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.cargarRoles),
      switchMap(() =>
        svc.getRoles().pipe(
          map(roles => UsuariosActions.cargarRolesExitoso({ roles })),
          catchError((err: unknown) =>
            of(UsuariosActions.cargarRolesFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const crearUsuario$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.crearUsuario),
      concatMap(({ data }) =>
        svc.crearUsuario(data).pipe(
          map(usuario => UsuariosActions.crearUsuarioExitoso({ usuario })),
          catchError((err: unknown) =>
            of(UsuariosActions.crearUsuarioFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const actualizarUsuario$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.actualizarUsuario),
      concatMap(({ id, data }) =>
        svc.actualizarUsuario(id, data).pipe(
          map(usuario => UsuariosActions.actualizarUsuarioExitoso({ usuario })),
          catchError((err: unknown) =>
            of(UsuariosActions.actualizarUsuarioFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const eliminarUsuario$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.eliminarUsuario),
      concatMap(({ id }) =>
        svc.eliminarUsuario(id).pipe(
          map(() => UsuariosActions.eliminarUsuarioExitoso({ id })),
          catchError((err: unknown) =>
            of(UsuariosActions.eliminarUsuarioFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const activarUsuario$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.activarUsuario),
      concatMap(({ id }) =>
        svc.activarUsuario(id).pipe(
          map(usuario => UsuariosActions.activarUsuarioExitoso({ usuario })),
          catchError((err: unknown) =>
            of(UsuariosActions.activarUsuarioFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const desactivarUsuario$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.desactivarUsuario),
      concatMap(({ id }) =>
        svc.desactivarUsuario(id).pipe(
          map(usuario => UsuariosActions.desactivarUsuarioExitoso({ usuario })),
          catchError((err: unknown) =>
            of(UsuariosActions.desactivarUsuarioFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const desbloquearCuenta$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.desbloquearCuenta),
      concatMap(({ id }) =>
        svc.desbloquearCuenta(id).pipe(
          map(usuario => UsuariosActions.desbloquearCuentaExitoso({ usuario })),
          catchError((err: unknown) =>
            of(UsuariosActions.desbloquearCuentaFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const importarMasivo$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.importarMasivo),
      concatMap(({ request }) =>
        svc.importarMasivo(request).pipe(
          map(resultado => UsuariosActions.importarMasivoExitoso({ resultado })),
          catchError((err: unknown) =>
            of(UsuariosActions.importarMasivoFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Corrección 1 — exportarUsuarios con parámetros
export const exportarUsuarios$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.exportarUsuarios),
      concatMap(({ config }) =>
        svc.exportarUsuarios(config).pipe(
          map(blob => {
            const ext    = config.formato === 'csv' ? 'csv' : 'xlsx';
            const url    = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href     = url;
            anchor.download = `usuarios_${new Date().toISOString().split('T')[0]}.${ext}`;
            anchor.click();
            URL.revokeObjectURL(url);
            return UsuariosActions.exportarUsuariosExitoso();
          }),
          catchError((err: unknown) =>
            of(UsuariosActions.exportarUsuariosFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const cargarRolesDetalle$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.cargarRolesDetalle),
      switchMap(() =>
        svc.getRolesDetalle().pipe(
          map(roles => UsuariosActions.cargarRolesDetalleExitoso({ roles })),
          catchError((err: unknown) =>
            of(UsuariosActions.cargarRolesDetalleFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const cargarHistorial$ = createEffect(
  (actions$ = inject(Actions), svc = inject(UsuariosService)) =>
    actions$.pipe(
      ofType(UsuariosActions.cargarHistorial),
      switchMap(() =>
        svc.getHistorial().pipe(
          map(historial => UsuariosActions.cargarHistorialExitoso({ historial })),
          catchError((err: unknown) =>
            of(UsuariosActions.cargarHistorialFallido({ error: extractErrorMessage(err) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Corrección 4 — recargar lista tras crear/eliminar
export const recargarTrasCrear$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(UsuariosActions.crearUsuarioExitoso),
      map(() => UsuariosActions.cargarUsuarios({})),
    ),
  { functional: true },
);

export const recargarTrasEliminar$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(UsuariosActions.eliminarUsuarioExitoso),
      map(() => UsuariosActions.cargarUsuarios({})),
    ),
  { functional: true },
);
