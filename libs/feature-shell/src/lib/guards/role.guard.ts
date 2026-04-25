import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@restaurant/shared/auth';
import { Rol } from '@restaurant/shared/models';

export const roleGuard = (allowedRoles: Rol[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser();

  if (currentUser && allowedRoles.includes(currentUser.rol)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
