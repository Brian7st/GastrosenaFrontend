import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';  // ← cambiar esta línea
import { AuthService } from '@restaurant/shared/auth';

export const mockSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  const userId   = user?.id  ?? '00000000-0000-0000-0000-000000000001';
  const userRole = user?.rol ?? 'MESERO';

  const secureReq = req.clone({
    setHeaders: {
      'X-Mock-User-Id':   userId,
      'X-Mock-User-Role': userRole,
    },
  });

  return next(secureReq);
};