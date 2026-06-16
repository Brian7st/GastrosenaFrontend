import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API = '/api/v1';

/** Programa de Formación del catálogo cerrado (Eje 1 del presupuesto). */
export interface Programa {
  codigo: string;
  nombre: string;
}

/**
 * Catálogo de Programas de Formación.
 * Fuente única para los selectores de programa (solicitud, GIL, presupuesto),
 * de modo que sólo puedan elegirse los programas válidos por normativa.
 */
@Injectable({ providedIn: 'root' })
export class ProgramasService {
  private http = inject(HttpClient);

  /** GET /catalog/programas → los 5 programas fijos */
  getProgramas(): Observable<Programa[]> {
    return this.http
      .get<Programa[]>(`${API}/catalog/programas`)
      .pipe(catchError(err => throwError(() => err)));
  }
}
