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
      
      // Solo expulsamos al login si el 401 ocurre DENTRO del área protegida (/app).
      // En páginas públicas (home, etc.) un 401 de un endpoint no debe sacar al visitante.
      const enAreaProtegida = router.url.startsWith('/app');
      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        enAreaProtegida
      ) {
         authService.logout();
         router.navigate(['/auth/login']);
      }
      
      return throwError(() => error);
    })
  );
};