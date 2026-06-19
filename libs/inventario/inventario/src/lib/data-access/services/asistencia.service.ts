import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  FichaResponseDTO,
  UsuarioResponseDTO,
  RegistrarAsistenciaRequest,
  AsistenciaResponse,
} from '../api/legalization.api';

const API_USUARIOS = '/api';
const API_V1       = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private http = inject(HttpClient);

  // ── Fichas ──────────────────────────────────────────────────────────────

  getFichas(): Observable<FichaResponseDTO[]> {
    return this.http
      .get<FichaResponseDTO[]>(`${API_USUARIOS}/fichas`)
      .pipe(catchError(err => throwError(() => err)));
  }

  getFichaPorNumero(numero: string): Observable<FichaResponseDTO> {
    return this.http
      .get<FichaResponseDTO>(`${API_USUARIOS}/fichas/numero/${numero}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** Resuelve aprendices activos de una ficha.
   *  Requiere el UUID de la ficha (no el número); usar getFichaPorNumero() para resolver. */
  getAprendicesByFichaId(fichaUuid: string): Observable<UsuarioResponseDTO[]> {
    return this.http
      .get<UsuarioResponseDTO[]>(`${API_USUARIOS}/fichas/${fichaUuid}/aprendices`)
      .pipe(
        map(lista => lista.filter(u => u.estado)),
        catchError(err => throwError(() => err))
      );
  }

  // ── Asistencia ──────────────────────────────────────────────────────────

  registrarAsistencia(
    paqueteId: string,
    request: RegistrarAsistenciaRequest
  ): Observable<AsistenciaResponse> {
    return this.http
      .post<AsistenciaResponse>(
        `${API_V1}/legalization/paquetes/${paqueteId}/asistencia`,
        request
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  getAsistencia(paqueteId: string): Observable<AsistenciaResponse> {
    return this.http
      .get<AsistenciaResponse>(
        `${API_V1}/legalization/paquetes/${paqueteId}/asistencia`
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  actualizarAsistencia(
    paqueteId: string,
    request: RegistrarAsistenciaRequest
  ): Observable<AsistenciaResponse> {
    return this.http
      .put<AsistenciaResponse>(
        `${API_V1}/legalization/paquetes/${paqueteId}/asistencia`,
        request
      )
      .pipe(catchError(err => throwError(() => err)));
  }
}
