import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@restaurant/shared/auth';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  // Verifica si el usuario tiene al menos uno de los permisos requeridos
  const tienePermiso = requiredPermissions.some(permiso =>
    user.permisos?.includes(permiso)
  );

  return tienePermiso ? true : router.createUrlTree(['/auth/unauthorized']);
};