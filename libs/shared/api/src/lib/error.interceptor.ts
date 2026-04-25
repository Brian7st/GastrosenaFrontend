import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError(error => {
      console.error('HTTP error captured by shared/api:', error);
      return throwError(() => error);
    }),
  );
