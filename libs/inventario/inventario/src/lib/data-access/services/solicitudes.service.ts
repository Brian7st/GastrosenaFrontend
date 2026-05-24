import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  SolicitudGil,
  SolicitudesGilFiltros,
  EstadoGil,
  CrearSolicitudData,
  ActualizarSolicitudData,
} from '../../models/solicitudes-gil.model';
import { GilResponse, EnviarProveedorRequest } from '../api/sourcing.api';
import { gilFromApi } from '../mappers/sourcing.mapper';

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
        map(list => list.map(gilFromApi)),
        catchError(err => throwError(() => err))
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

  deleteSolicitud(_codigo: string): Observable<boolean> {
    return throwError(() => new Error('deleteSolicitud: endpoint DELETE no disponible en backend'));
  }

  generarGils(_ids: (string | number)[]): Observable<boolean> {
    return throwError(() => new Error('generarGils: endpoint no disponible — revisar con backend'));
  }
}
