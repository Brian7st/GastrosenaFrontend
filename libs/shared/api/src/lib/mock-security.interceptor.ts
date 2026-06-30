import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@restaurant/shared/auth';

export const mockSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  // Se asume que el usuario siempre tendrá un ID si está logueado en la aplicación.
  // En este punto, no usaremos fallbacks quemados, si no hay user, se usa null temporalmente 
  // o se deja fallar la petición para detectar errores en el ciclo de autenticación real.
  const userId   = user?.id || '';
  const userRole = user?.rol || 'MESERO';

  const secureReq = req.clone({
    setHeaders: {
      'X-Mock-User-Id':   userId,
      'X-Mock-User-Role': userRole,
    },
  });

  return next(secureReq);
};
