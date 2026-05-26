import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  SolicitudGil,
  SolicitudesGilFiltros,
  EstadoGil,
  CrearSolicitudData,
  ActualizarSolicitudData,
} from '../../models/solicitudes-gil.model';
import {
  SolicitudSesion,
  CrearSolicitudSesionData,
  AprobarSesionData,
  RechazarSesionData,
} from '../../models/solicitud-sesion.model';
import { GilResponse, EnviarProveedorRequest } from '../api/sourcing.api';
import {
  SolicitudSesionResponse,
  CrearSolicitudSesionRequest,
  AprobarSolicitudSesionRequest,
  RechazarSolicitudSesionRequest,
} from '../api/training.api';
import { gilFromApi } from '../mappers/sourcing.mapper';
import { solicitudSesionFromApi } from '../mappers/training.mapper';
import { SOLICITUDES_MOCK } from '../../models/solicitudes-gil.mock';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private http = inject(HttpClient);

  getSolicitudes(filtros?: SolicitudesGilFiltros): Observable<SolicitudGil[]> {
    let params = new HttpParams();
    if (filtros?.busqueda)   params = params.set('q', filtros.busqueda);
    if (filtros?.estado)     params = params.set('estado', filtros.estado);
    if (filtros?.instructor) params = params.set('instructor', filtros.instructor);
    if (filtros?.fechaRango) params = params.set('fechaRango', filtros.fechaRango);

    return this.http
      .get<GilResponse[]>(`${API}/procurement/giles`, { params })
      .pipe(
        map(list => list && list.length > 0 ? list.map(gilFromApi) : SOLICITUDES_MOCK),
        catchError(() => {
          console.warn('Backend not running or request failed. Falling back to SOLICITUDES_MOCK');
          return of(SOLICITUDES_MOCK);
        })
      );
  }

  getSolicitudById(id: string | number): Observable<SolicitudGil | undefined> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  crearSolicitud(data: CrearSolicitudData): Observable<{ success: boolean }> {
    return this.http
      .post<GilResponse>(`${API}/procurement/giles`, data)
      .pipe(
        map(() => ({ success: true })),
        catchError(err => throwError(() => err))
      );
  }

  actualizarSolicitud(id: string, data: ActualizarSolicitudData): Observable<{ success: boolean }> {
    return this.http
      .patch<GilResponse>(`${API}/procurement/giles/${id}`, data)
      .pipe(
        map(() => ({ success: true })),
        catchError(err => throwError(() => err))
      );
  }

  cambiarEstado(id: string, estado: EstadoGil): Observable<boolean> {
    const accionMap: Record<EstadoGil, string> = {
      BORRADOR:          '',
      EMITIDO:           'emitir',
      ENVIADO_PROVEEDOR: '', // usa enviarAProveedor() — requiere PUT con body
      CERRADO:           'cerrar',
    };
    const accion = accionMap[estado];
    if (!accion) return throwError(() => new Error(`Estado ${estado} sin endpoint de transición PATCH`));

    return this.http
      .patch<void>(`${API}/procurement/giles/${id}/${accion}`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** PUT /procurement/giles/{id}/enviar-proveedor — requiere body con proveedorDestinatarioId y fechaEnvio */
  enviarAProveedor(id: string, data: EnviarProveedorRequest): Observable<boolean> {
    return this.http
      .put<GilResponse>(`${API}/procurement/giles/${id}/enviar-proveedor`, data)
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteSolicitud(_codigo: string): Observable<boolean> {
    return throwError(() => new Error('deleteSolicitud: endpoint DELETE no disponible en backend'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generarGils(_ids: (string | number)[]): Observable<boolean> {
    return throwError(() => new Error('generarGils: endpoint no disponible — revisar con backend'));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Training — /api/v1/training/solicitudes
  // ─────────────────────────────────────────────────────────────────────────

  /** POST /training/solicitudes — crea una solicitud de sesión — 201 Created */
  crearSolicitudSesion(data: CrearSolicitudSesionData): Observable<SolicitudSesion> {
    const body: CrearSolicitudSesionRequest = {
      fichaId:              data.fichaId,
      programaId:           data.programaId,
      instructorId:         data.instructorId,
      resultadoAprendizaje: data.resultadoAprendizaje,
      actividades:          data.actividades,
      voceroId:             data.voceroId,
      items: data.items.map(i => ({
        productoId:    i.productoId,
        cantidad:      i.cantidad,
        unidadMedida:  i.unidadMedida,
        justificacion: i.justificacion,
      })),
    };
    return this.http
      .post<SolicitudSesionResponse>(`${API}/training/solicitudes`, body)
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /training/solicitudes/{id}/aprobar */
  aprobarSolicitudSesion(id: string, data: AprobarSesionData): Observable<SolicitudSesion> {
    const body: AprobarSolicitudSesionRequest = {
      aprobadorId:   data.aprobadorId,
      observaciones: data.observaciones,
    };
    return this.http
      .patch<SolicitudSesionResponse>(`${API}/training/solicitudes/${id}/aprobar`, body)
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /training/solicitudes/{id}/rechazar */
  rechazarSolicitudSesion(id: string, data: RechazarSesionData): Observable<SolicitudSesion> {
    const body: RechazarSolicitudSesionRequest = {
      aprobadorId: data.aprobadorId,
      motivo:      data.motivo,
    };
    return this.http
      .patch<SolicitudSesionResponse>(`${API}/training/solicitudes/${id}/rechazar`, body)
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /training/solicitudes/{id}/comprometer — sin body — 204 No Content */
  comprometerSolicitudSesion(id: string): Observable<SolicitudSesion> {
    return this.http
      .patch<SolicitudSesionResponse>(`${API}/training/solicitudes/${id}/comprometer`, {})
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  updateSolicitud(id: string | number, payload: Partial<SolicitudGil>): Observable<SolicitudGil> {
    return this.http
      .patch<GilResponse>(`${API}/procurement/giles/${id}`, payload)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }
}
