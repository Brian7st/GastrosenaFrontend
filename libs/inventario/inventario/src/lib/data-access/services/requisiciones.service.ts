import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Requisicion } from '../../models/requisicion.model';
import { RequisicionResponse } from '../api/legalization.api';
import { requisicionFromApi } from '../mappers/legalization.mapper';

const API = '/api/v1';

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

  /** PATCH /legalization/requisiciones/{id}/despachar — economoId es @NotBlank en backend */
  despacharRequisicion(id: string, economoId: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/despachar`, { economoId })
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /legalization/requisiciones/{id}/firmar — voceroId es @NotBlank en backend */
  firmarRequisicion(id: string, voceroId: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/firmar`, { voceroId })
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eliminarRequisicion(_id: string): Observable<boolean> {
    return throwError(() => new Error('eliminarRequisicion: endpoint DELETE no disponible en backend'));
  }
}
