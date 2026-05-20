import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ConciliacionRegistro,
  ConciliacionDetalle,
} from '../../models/conciliacion.model';
import {
  CONCILIACIONES_MOCK,
  CONCILIACION_DETALLE_MOCK,
} from '../../models/conciliacion.mock';

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService {
  /**
   * Obtiene el listado de todas las conciliaciones.
   */
  getConciliaciones(): Observable<ConciliacionRegistro[]> {
    return of([...CONCILIACIONES_MOCK]).pipe(delay(400));
  }

  /**
   * Obtiene el detalle de una conciliación por su ID.
   */
  getConciliacionById(id: string): Observable<ConciliacionDetalle | undefined> {
    // En implementación real: return this.http.get<ConciliacionDetalle>(`/api/conciliaciones/${id}`)
    const detalle =
      id === CONCILIACION_DETALLE_MOCK.id ? CONCILIACION_DETALLE_MOCK : undefined;
    return of(detalle).pipe(delay(300));
  }

  /**
   * Inicia una nueva toma física (crea la sesión en el servidor).
   */
  iniciarTomaFisica(): Observable<{ sesionId: string }> {
    return of({ sesionId: `TF-${Date.now()}` }).pipe(delay(500));
  }

  /**
   * Cierra y finaliza una conciliación existente.
   */
  cerrarConciliacion(id: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }
}
