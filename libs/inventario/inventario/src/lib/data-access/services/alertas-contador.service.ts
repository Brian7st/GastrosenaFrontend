import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertasService } from './alertas.service';

/**
 * Punto de acceso público y liviano para que el host (shell) consulte el número
 * de alertas de stock activas sin acoplarse a toda la AlertasFacade.
 *
 * Única responsabilidad: devolver un contador. No mantiene estado.
 */
@Injectable({ providedIn: 'root' })
export class AlertasContadorService {
  private alertasService = inject(AlertasService);

  /**
   * Cantidad de alertas de stock activas (no resueltas).
   * Devuelve 0 ante cualquier error para no romper el badge del topbar.
   */
  contarActivas(destinatarioId?: string): Observable<number> {
    return this.alertasService.getResumenAlertas(destinatarioId).pipe(
      map(resumen => resumen.alertasPendientes),
      catchError(() => of(0)),
    );
  }
}
