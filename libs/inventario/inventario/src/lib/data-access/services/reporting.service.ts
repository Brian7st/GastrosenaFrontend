import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConsumoItem, TrazabilidadDocumental } from '../../models/reporting.model';
import { ConsumoItemResponse, TrazabilidadDocumentalItemResponse } from '../api/reporting.api';
import { consumoFromApi, trazabilidadFromApi } from '../mappers/reporting.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  private http = inject(HttpClient);

  /** GET /reporting/consumo?fichaId?&instructorId?&desde?&hasta? (ISO_DATE) */
  getConsumo(params?: {
    fichaId?:      string;
    instructorId?: string;
    desde?:        string;
    hasta?:        string;
  }): Observable<ConsumoItem[]> {
    let httpParams = new HttpParams();
    if (params?.fichaId)      httpParams = httpParams.set('fichaId',      params.fichaId);
    if (params?.instructorId) httpParams = httpParams.set('instructorId', params.instructorId);
    if (params?.desde)        httpParams = httpParams.set('desde',        params.desde);
    if (params?.hasta)        httpParams = httpParams.set('hasta',        params.hasta);
    return this.http
      .get<ConsumoItemResponse[]>(`${API}/reporting/consumo`, { params: httpParams })
      .pipe(
        map(list => list.map(consumoFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /reporting/trazabilidad?fichaId?&desde?&hasta? (ISO_DATE) */
  getTrazabilidad(params?: {
    fichaId?: string;
    desde?:   string;
    hasta?:   string;
  }): Observable<TrazabilidadDocumental[]> {
    let httpParams = new HttpParams();
    if (params?.fichaId) httpParams = httpParams.set('fichaId', params.fichaId);
    if (params?.desde)   httpParams = httpParams.set('desde',   params.desde);
    if (params?.hasta)   httpParams = httpParams.set('hasta',   params.hasta);
    return this.http
      .get<TrazabilidadDocumentalItemResponse[]>(`${API}/reporting/trazabilidad`, { params: httpParams })
      .pipe(
        map(list => list.map(trazabilidadFromApi)),
        catchError(err => throwError(() => err))
      );
  }
}
