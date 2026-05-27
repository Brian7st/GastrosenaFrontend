import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  SolicitudGil,
  SolicitudesGilFiltros,
  SolicitudesPaginacion,
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

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private http = inject(HttpClient);

  // ─────────────────────────────────────────────────────────────────────────
  // Procurement — /api/v1/procurement/giles
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /procurement/giles — solo se envían los filtros que el backend admite */
  getSolicitudes(filtros?: SolicitudesGilFiltros): Observable<{ solicitudes: SolicitudGil[]; paginacion: SolicitudesPaginacion }> {
    let params = new HttpParams();
    // Parámetros soportados por el backend:
    if (filtros?.estado)               params = params.set('estado', filtros.estado);
    if (filtros?.fichaCaracterizacion) params = params.set('fichaCaracterizacion', filtros.fichaCaracterizacion);
    params = params.set('page', String(filtros?.page ?? 0));
    params = params.set('size', String(filtros?.size ?? 10));
    // Nota: busqueda, instructor y fechaRango NO existen en el backend — se omiten.

    return this.http
      .get<{ content: GilResponse[]; totalElements: number; totalPages: number; number: number; size: number }>(
        `${API}/procurement/giles`, { params }
      )
      .pipe(
        map(res => ({
          solicitudes: res.content.map(gilFromApi),
          paginacion: {
            totalElements: res.totalElements,
            totalPages:    res.totalPages,
            page:          res.number,
            size:          res.size,
          },
        })),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /procurement/giles/{id} */
  getSolicitudById(id: string | number): Observable<SolicitudGil | undefined> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /procurement/giles — crea un GIL en estado BORRADOR */
  crearSolicitud(data: CrearSolicitudData): Observable<{ success: boolean }> {
    return this.http
      .post<GilResponse>(`${API}/procurement/giles`, data)
      .pipe(
        map(() => ({ success: true })),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * PATCH /procurement/giles/{id} — actualiza un GIL en BORRADOR.
   * NOTA: este endpoint aún NO existe en el backend (pendiente tarea BACKEND #3).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  actualizarSolicitud(_id: string, _data: ActualizarSolicitudData): Observable<{ success: boolean }> {
    return throwError(() => new Error('actualizarSolicitud: PATCH /procurement/giles/{id} no existe en backend — pendiente tarea BACKEND #3'));
  }

  /**
   * PATCH /procurement/giles/{id} — alias usado por facturas facade.
   * NOTA: mismo endpoint inexistente — pendiente tarea BACKEND #3.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateSolicitud(_id: string | number, _payload: Partial<SolicitudGil>): Observable<SolicitudGil> {
    return throwError(() => new Error('updateSolicitud: PATCH /procurement/giles/{id} no existe en backend — pendiente tarea BACKEND #3'));
  }

  /** PATCH /procurement/giles/{id}/emitir o /cerrar */
  cambiarEstado(id: string, estado: EstadoGil): Observable<boolean> {
    const accionMap: Record<EstadoGil, string> = {
      BORRADOR:          '',
      EMITIDO:           'emitir',
      ENVIADO_PROVEEDOR: '', // usa enviarAProveedor() — requiere PATCH con body
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

  /** PATCH /procurement/giles/{id}/enviar-proveedor — requiere body con proveedorDestinatarioId y fechaEnvio */
  enviarAProveedor(id: string, data: EnviarProveedorRequest): Observable<boolean> {
    return this.http
      .patch<GilResponse>(`${API}/procurement/giles/${id}/enviar-proveedor`, data) // era: http.put — corregido a PATCH
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** DELETE — endpoint NO disponible en backend */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteSolicitud(_codigo: string): Observable<boolean> {
    return throwError(() => new Error('deleteSolicitud: endpoint DELETE no disponible en backend'));
  }

  /** Generar GILs desde solicitudes aprobadas — endpoint NO disponible en backend */
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
}
