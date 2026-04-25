import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '@restaurant/shared/models';
import { AuthService } from './auth.service';

export const sharedRoleGuard = (roles: Rol[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  return user && roles.includes(user.rol) ? true : router.createUrlTree(['/']);
};
