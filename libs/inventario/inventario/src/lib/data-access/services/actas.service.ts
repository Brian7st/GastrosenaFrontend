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
import { ActasPageResponse, CrearActaRequest } from '../api/legalization.api';
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
      .get<ActasPageResponse>(`${API}/legalization/actas`)
      .pipe(
        map(resp => resp.contenido.map(actaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** Backend no expone GET /actas/{id}: busca en la lista paginada por ID. */
  getActaById(id: string): Observable<ActaLegalizacion | undefined> {
    return this.http
      .get<ActasPageResponse>(`${API}/legalization/actas`, { params: { size: 100 } })
      .pipe(
        map(resp => {
          const found = resp.contenido.find(a => a.id === id);
          return found ? actaFromApi(found) : undefined;
        }),
        catchError(err => throwError(() => err))
      );
  }

  crearActa(data: CrearActaRequest): Observable<string> {
    return this.http
      .post<{ id: string }>(`${API}/legalization/actas`, data)
      .pipe(
        map(resp => resp.id),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /legalization/actas/{id}/{accion} — para PENDIENTE_FIRMAS, FIRMADA, ARCHIVADA (sin body) */
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

  /** POST /legalization/actas/{id}/revisar — revisorId es @NotBlank en backend */
  revisarActa(id: string, revisorId: string): Observable<boolean> {
    return this.http
      .post<void>(`${API}/legalization/actas/${id}/revisar`, { revisorId })
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** TODO: insumos/compromisos/firmantes — verificar si el backend los expone por separado */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getInsumosByActa(_id: string): Observable<InsumoActa[]> {
    return throwError(() => new Error('getInsumosByActa: endpoint pendiente de confirmación'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCompromisosByActa(_id: string): Observable<CompromisoActa[]> {
    return throwError(() => new Error('getCompromisosByActa: endpoint pendiente de confirmación'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFirmantesByActa(_id: string): Observable<FirmanteActa[]> {
    return throwError(() => new Error('getFirmantesByActa: endpoint pendiente de confirmación'));
  }
}
