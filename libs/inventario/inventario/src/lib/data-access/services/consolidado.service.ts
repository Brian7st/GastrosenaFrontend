import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Consolidado } from '../../models/consolidado.model';
import { ConsolidadoResponse } from '../api/budget.api';
import { consolidadoFromApi } from '../mappers/budget.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ConsolidadoService {
  private http = inject(HttpClient);

  getConsolidados(): Observable<Consolidado[]> {
    return this.http
      .get<ConsolidadoResponse[]>(`${API}/budget/consolidados`)
      .pipe(
        map(list => list.map(consolidadoFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getConsolidado(id: string): Observable<Consolidado | undefined> {
    return this.http
      .get<ConsolidadoResponse>(`${API}/budget/consolidados/${id}`)
      .pipe(
        map(consolidadoFromApi),
        catchError(err => throwError(() => err))
      );
  }

  generarConsolidado(gilIds: string[]): Observable<Consolidado> {
    return this.http
      .post<ConsolidadoResponse>(`${API}/budget/consolidados`, { gilIds })
      .pipe(
        map(consolidadoFromApi),
        catchError(err => throwError(() => err))
      );
  }

  reversarConsolidado(id: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/budget/consolidados/${id}/reversar`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }
}
