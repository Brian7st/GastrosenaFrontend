import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Requisicion } from '../../models/requisicion.model';
import { RequisicionResponse } from '../api/legalization.api';
import { requisicionFromApi } from '../mappers/legalization.mapper';

const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class RequisicionesService {
  private http = inject(HttpClient);

  getRequisiciones(): Observable<Requisicion[]> {
    return this.http
      .get<RequisicionResponse[]>(`${API}/legalization/requisiciones`)
      .pipe(
        map(list => list.map(requisicionFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getRequisicionById(id: string): Observable<Requisicion | undefined> {
    return this.http
      .get<RequisicionResponse>(`${API}/legalization/requisiciones/${id}`)
      .pipe(
        map(requisicionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  crearRequisicion(data: Partial<Requisicion>): Observable<Requisicion> {
    return this.http
      .post<RequisicionResponse>(`${API}/legalization/requisiciones`, data)
      .pipe(
        map(requisicionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  cambiarEstado(id: string, estado: Requisicion['estado']): Observable<boolean> {
    const accionMap: Partial<Record<Requisicion['estado'], string>> = {
      DESPACHADA: 'despachar',
      FIRMADA:    'firmar',
    };
    const accion = accionMap[estado];
    if (!accion) return throwError(() => new Error(`Estado ${estado} sin endpoint de transición`));

    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/${accion}`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  eliminarRequisicion(_id: string): Observable<boolean> {
    return throwError(() => new Error('eliminarRequisicion: endpoint DELETE no disponible en backend'));
  }
}
