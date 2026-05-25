import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaqueteProbatorio } from '../../models/paquete.model';
import { PaqueteResponse, CrearPaqueteRequest, TrazabilidadRequest } from '../api/legalization.api';
import { paqueteFromApi } from '../mappers/legalization.mapper';

const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class PaqueteService {
  private http = inject(HttpClient);

  getPaquetes(): Observable<PaqueteProbatorio[]> {
    return this.http
      .get<PaqueteResponse[]>(`${API}/legalization/paquetes`)
      .pipe(
        map(list => list.map(paqueteFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getPaqueteById(id: string): Observable<PaqueteProbatorio | undefined> {
    return this.http
      .get<PaqueteResponse>(`${API}/legalization/paquetes/${id}`)
      .pipe(
        map(paqueteFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** La facade pasa Partial<PaqueteProbatorio> — el service construye el request tipado. */
  crearPaquete(data: Partial<PaqueteProbatorio>): Observable<PaqueteProbatorio> {
    const request: CrearPaqueteRequest = {
      actaId:       data.actaId       ?? '',
      requisicionId: data.requisicionId ?? '',
      fichaId:      data.fichaId      ?? '',
      instructorId: data.instructorId ?? '',
      titulo:       data.titulo,
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
  adjuntarDocumento(paqueteId: string, _file: File): Observable<boolean> {
    return this.adjuntarAsistencia(paqueteId);
  }

  /** TODO: vincular requisición — usar vincularTrazabilidad con requisicionId */
  incluirRequisicion(paqueteId: string, reqId: string): Observable<boolean> {
    return this.vincularTrazabilidad(paqueteId, { requisicionId: reqId });
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
