import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaqueteProbatorio } from '../../models/paquete.model';
import { PaqueteResponse, PaquetesPageResponse, CrearPaqueteRequest, TrazabilidadRequest } from '../api/legalization.api';
import { paqueteFromApi } from '../mappers/legalization.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class PaqueteService {
  private http = inject(HttpClient);

  getPaquetes(): Observable<PaqueteProbatorio[]> {
    return this.http
      .get<PaquetesPageResponse>(`${API}/legalization/paquetes`)
      .pipe(
        map(resp => resp.contenido.map(paqueteFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** Backend no expone GET /paquetes/{id}: busca en la lista paginada por ID. */
  getPaqueteById(id: string): Observable<PaqueteProbatorio | undefined> {
    return this.http
      .get<PaquetesPageResponse>(`${API}/legalization/paquetes`, { params: { size: 100 } })
      .pipe(
        map(resp => {
          const found = resp.contenido.find(p => p.id === id);
          return found ? paqueteFromApi(found) : undefined;
        }),
        catchError(err => throwError(() => err))
      );
  }

  /** La facade pasa Partial<PaqueteProbatorio> — el service construye el request tipado.
   *  Nota: el backend no expone `titulo` en CrearPaqueteHttpRequest — solo los 4 IDs. */
  crearPaquete(data: Partial<PaqueteProbatorio>): Observable<PaqueteProbatorio> {
    const request: CrearPaqueteRequest = {
      actaId:        data.actaId        ?? '',
      requisicionId: data.requisicionId ?? '',
      fichaId:       data.fichaId       ?? '',
      instructorId:  data.instructorId  ?? '',
    };
    return this.http
      .post<PaqueteResponse>(`${API}/legalization/paquetes`, request)
      .pipe(
        map(paqueteFromApi),
        catchError(err => throwError(() => err))
      );
  }

  adjuntarAsistencia(paqueteId: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/paquetes/${paqueteId}/adjuntar-asistencia`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  vincularTrazabilidad(paqueteId: string, datos: TrazabilidadRequest): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/paquetes/${paqueteId}/trazabilidad`, datos)
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** Firma anterior: adjuntarDocumento(paqueteId, file) → ahora adjuntarAsistencia */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adjuntarDocumento(paqueteId: string, _file: File): Observable<boolean> {
    return this.adjuntarAsistencia(paqueteId);
  }

  /** POST /legalization/paquetes/{id}/exportar */
  exportarPaquete(id: string): Observable<boolean> {
    return this.http
      .post<void>(`${API}/legalization/paquetes/${id}/exportar`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** @deprecated TrazabilidadRequest ahora requiere los 3 campos — usar vincularTrazabilidad directamente */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  incluirRequisicion(paqueteId: string, reqId: string): Observable<boolean> {
    return this.archivarPaquete(paqueteId);
  }

  /** PATCH /legalization/paquetes/{id}/archivar */
  archivarPaquete(id: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/paquetes/${id}/archivar`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }
}
