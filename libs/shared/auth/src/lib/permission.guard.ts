import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route guard that allows activation when the current user holds at least one
 * of the required permissions. Lives in shared/auth so any domain lib (e.g.
 * inventario) can gate its own routes without depending on the shell.
 */
export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  const tienePermiso = requiredPermissions.some(permiso =>
    user.permisos?.includes(permiso)
  );

  return tienePermiso ? true : router.createUrlTree(['/auth/unauthorized']);
};
