import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@restaurant/shared/auth';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP error captured by shared/api:', error);
      
      // Si es 401 y la petición NO es de login (para evitar bucle)
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      
      return throwError(() => error);
    })
  );
};