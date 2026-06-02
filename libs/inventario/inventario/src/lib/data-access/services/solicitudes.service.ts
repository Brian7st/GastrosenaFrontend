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
  GenerarGilData,
} from '../../models/solicitudes-gil.model';
import {
  SolicitudSesion,
  CrearSolicitudSesionData,
  ActualizarSolicitudSesionData,
  AprobarSesionData,
  RechazarSesionData,
} from '../../models/solicitud-sesion.model';
import { GilResponse, EnviarProveedorRequest, GenerarGilRequest } from '../api/sourcing.api';
import {
  SolicitudSesionResponse,
  SolicitudesSesionFiltros,
  PagedSolicitudSesionResponse,
  CrearSolicitudSesionRequest,
  ActualizarSolicitudSesionRequest,
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
    if (filtros?.estado)        params = params.set('estado', filtros.estado);
    if (filtros?.codigoGrupo)  params = params.set('codigoGrupo', filtros.codigoGrupo);
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

  /** PATCH /procurement/giles/{id} — actualiza un GIL en estado BORRADOR */
  actualizarSolicitud(id: string, data: ActualizarSolicitudData): Observable<{ success: boolean }> {
    return this.http
      .patch<GilResponse>(`${API}/procurement/giles/${id}`, data)
      .pipe(
        map(() => ({ success: true })),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /procurement/giles/{id} — alias usado por facturas facade */
  updateSolicitud(id: string | number, payload: Partial<SolicitudGil>): Observable<SolicitudGil> {
    return this.http
      .patch<GilResponse>(`${API}/procurement/giles/${id}`, payload)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /procurement/giles/{id}/emitir o /cerrar */
  cambiarEstado(id: string, estado: EstadoGil): Observable<boolean> {
    // BORRADOR: estado inicial, no hay transición de vuelta a él.
    // ENVIADO_PROVEEDOR: usa enviarAProveedor() — requiere body con proveedorDestinatarioId.
    const accionMap: Partial<Record<EstadoGil, string>> = {
      EMITIDO: 'emitir',
      CERRADO: 'cerrar',
    };
    const accion = accionMap[estado];
    if (!accion) return throwError(() => new Error(`Estado ${estado} no tiene endpoint de transición directa. Usá el método específico para este estado.`));

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

  /** DELETE /procurement/giles/{id} — elimina un GIL en estado BORRADOR */
  deleteSolicitud(id: string): Observable<void> {
    return this.http
      .delete<void>(`${API}/procurement/giles/${id}`)
      .pipe(
        catchError(err => throwError(() => err))
      );
  }

  /** POST /procurement/giles/generar — genera un GIL desde solicitudes de sesión aprobadas */
  generarGils(data: GenerarGilData): Observable<SolicitudGil> {
    const body: GenerarGilRequest = {
      solicitudSesionIds:     data.solicitudSesionIds,
      fechaSolicitud:         data.fechaSolicitud,
      regionalCodigo:         data.regionalCodigo,
      regionalNombre:         data.regionalNombre,
      centroCostosCodigo:     data.centroCostosCodigo,
      centroCostosNombre:     data.centroCostosNombre,
      area:                   data.area,
      destinoBienes:          data.destinoBienes,
      jefeOficinaCoordinador: data.jefeOficinaCoordinador,
      cuentadantes:           data.cuentadantes,
      solicitante:            data.solicitante,
      codigoGrupo:            data.codigoGrupo,
      fichaCaracterizacion:   data.codigoGrupo,
      observaciones:          data.observaciones,
    };
    return this.http
      .post<GilResponse>(`${API}/procurement/giles/generar`, body)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Training — /api/v1/training/solicitudes
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /training/solicitudes — lista solicitudes de sesión paginadas */
  getSolicitudesSesion(filtros?: SolicitudesSesionFiltros): Observable<{ solicitudes: SolicitudSesion[]; paginacion: SolicitudesPaginacion }> {
    let params = new HttpParams();
    if (filtros?.instructorId) params = params.set('instructorId', filtros.instructorId);
    if (filtros?.estado)       params = params.set('estado', filtros.estado);
    params = params.set('page', String(filtros?.page ?? 0));
    params = params.set('size', String(filtros?.size ?? 20));

    return this.http
      .get<PagedSolicitudSesionResponse | SolicitudSesionResponse[]>(`${API}/training/solicitudes`, { params })
      .pipe(
        map(res => {
          const items = Array.isArray(res) ? res : res.content;
          const total = Array.isArray(res) ? items.length : res.totalElements;
          const pages = Array.isArray(res) ? 1 : res.totalPages;
          const page  = Array.isArray(res) ? 0 : res.number;
          const size  = Array.isArray(res) ? items.length : res.size;
          return {
            solicitudes: items.map(solicitudSesionFromApi),
            paginacion: { totalElements: total, totalPages: pages, page, size },
          };
        }),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /training/solicitudes/{id} */
  getSolicitudSesionById(id: string): Observable<SolicitudSesion> {
    return this.http
      .get<SolicitudSesionResponse>(`${API}/training/solicitudes/${id}`)
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /training/solicitudes — crea una solicitud de sesión — 201 Created */
  crearSolicitudSesion(data: CrearSolicitudSesionData): Observable<SolicitudSesion> {
    const body: CrearSolicitudSesionRequest = {
      fechaSolicitud:           data.fechaSolicitud,
      numeroSolicitud:          data.numeroSolicitud,
      fichaId:                  data.fichaId,
      programaId:               data.programaId,
      instructorId:             data.instructorId,
      identificacionInstructor: data.identificacionInstructor,
      valorTotalDeSolicitud:    data.valorTotalDeSolicitud,
      items: data.items.map(i => ({
        codigoSena:              i.codigoSena,
        nombreBien:              i.nombreBien,
        descripcion:             i.descripcion,
        cantidad:                i.cantidad,
        valorUnitarioAdjudicado: i.valorUnitarioAdjudicado,
        codigoAlmacen:           i.codigoAlmacen,
        unidadMedida:            i.unidadMedida,
        valorUnitario:           i.valorUnitario,
        total:                   i.total,
        iva:                     i.iva,
      })),
    };
    return this.http
      .post<SolicitudSesionResponse>(`${API}/training/solicitudes`, body)
      .pipe(
        map(solicitudSesionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PUT /training/solicitudes/{id} — actualiza una solicitud de sesión existente */
  actualizarSolicitudSesion(id: string, data: ActualizarSolicitudSesionData): Observable<SolicitudSesion> {
    const body: ActualizarSolicitudSesionRequest = {
      fechaSolicitud:           data.fechaSolicitud,
      fichaId:                  data.fichaId,
      programaId:               data.programaId,
      instructorId:             data.instructorId,
      identificacionInstructor: data.identificacionInstructor,
      valorTotalDeSolicitud:    data.valorTotalDeSolicitud,
      items: data.items.map(i => ({
        codigoSena:              i.codigoSena,
        nombreBien:              i.nombreBien,
        descripcion:             i.descripcion,
        cantidad:                i.cantidad,
        valorUnitarioAdjudicado: i.valorUnitarioAdjudicado,
        codigoAlmacen:           i.codigoAlmacen,
        unidadMedida:            i.unidadMedida,
        valorUnitario:           i.valorUnitario,
        total:                   i.total,
        iva:                     i.iva,
      })),
    };
    return this.http
      .patch<SolicitudSesionResponse>(`${API}/training/solicitudes/${id}`, body)
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
