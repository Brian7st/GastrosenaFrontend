import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ActaLegalizacion,
  InsumoActa,
  CompromisoActa,
  FirmanteActa,
} from '../../models/acta.model';
import { ActaResponse } from '../api/legalization.api';
import { actaFromApi } from '../mappers/legalization.mapper';

const API = '/api/v1';

const ACCION_ESTADO: Record<string, string> = {
  PENDIENTE_FIRMAS: 'enviar-a-firmas',
  FIRMADA:          'firmar',
  REVISADA:         'revisar',
  ARCHIVADA:        'archivar',
};

@Injectable({ providedIn: 'root' })
export class ActasService {
  private http = inject(HttpClient);

  getActas(): Observable<ActaLegalizacion[]> {
    return this.http
      .get<ActaResponse[]>(`${API}/legalization/actas`)
      .pipe(
        map(list => list.map(actaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getActaById(id: string): Observable<ActaLegalizacion | undefined> {
    return this.http
      .get<ActaResponse>(`${API}/legalization/actas/${id}`)
      .pipe(
        map(actaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  crearActa(data: Partial<ActaLegalizacion>): Observable<ActaLegalizacion> {
    return this.http
      .post<ActaResponse>(`${API}/legalization/actas`, data)
      .pipe(
        map(actaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  cambiarEstado(id: string, estado: ActaLegalizacion['estado']): Observable<boolean> {
    const accion = ACCION_ESTADO[estado];
    if (!accion) return throwError(() => new Error(`Estado ${estado} sin transición de endpoint`));

    return this.http
      .post<void>(`${API}/legalization/actas/${id}/${accion}`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** TODO: insumos/compromisos/firmantes — verificar si el backend los expone por separado */
  getInsumosByActa(_id: string): Observable<InsumoActa[]> {
    return throwError(() => new Error('getInsumosByActa: endpoint pendiente de confirmación'));
  }

  getCompromisosByActa(_id: string): Observable<CompromisoActa[]> {
    return throwError(() => new Error('getCompromisosByActa: endpoint pendiente de confirmación'));
  }

  getFirmantesByActa(_id: string): Observable<FirmanteActa[]> {
    return throwError(() => new Error('getFirmantesByActa: endpoint pendiente de confirmación'));
  }
}
