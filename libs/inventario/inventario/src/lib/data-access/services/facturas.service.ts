import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Factura, FacturaFiltros, FacturaKpis, SolicitudGIL, EstadoGIL } from '../../models/facturas.model';
import { FacturaResponse, FacturaResumenResponse, GilResponse } from '../api/sourcing.api';
import { facturaFromApi } from '../mappers/sourcing.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private http = inject(HttpClient);

  getFacturas(filtros?: FacturaFiltros): Observable<Factura[]> {
    let params = new HttpParams();
    if (filtros?.busqueda)   params = params.set('q', filtros.busqueda);
    if (filtros?.estado)     params = params.set('estado', filtros.estado);
    if (filtros?.proveedor)  params = params.set('proveedor', filtros.proveedor);
    if (filtros?.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros?.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta);

    return this.http
      .get<FacturaResponse[]>(`${API}/sourcing/facturas`, { params })
      .pipe(
        map(list => list.map(facturaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getKpis(): Observable<FacturaKpis> {
    return this.http
      .get<FacturaResumenResponse>(`${API}/sourcing/facturas/resumen`)
      .pipe(
        map(r => ({
          totalFacturas:          r.totalFacturas,
          tendenciaTotalFacturas: r.tendenciaTotalFacturas,
          montoMensual:           r.montoMensual,
          tendenciaMonto:         r.tendenciaMonto,
          registradas:            r.registradas,
          verificadas:            r.verificadas,
          pagadas:                r.pagadas,
          anuladas:               r.anuladas,
        })),
        catchError(err => throwError(() => err))
      );
  }

  getFacturaById(id: string | number): Observable<Factura | undefined> {
    return this.http
      .get<FacturaResponse>(`${API}/sourcing/facturas/${id}`)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** La facade pasa Partial<Factura> — el service lo envía al backend tal cual.
   *  FE-04/FE-06 ajustarán el DTO de request cuando el contrato esté confirmado. */
  createFactura(data: Partial<Factura>): Observable<Factura> {
    return this.http
      .post<FacturaResponse>(`${API}/sourcing/facturas`, data)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  updateFactura(id: string | number, data: Partial<Factura>): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}`, data)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  anularFactura(id: string | number): Observable<void> {
    return this.http
      .patch<void>(`${API}/sourcing/facturas/${id}/anular`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** Mapea GilResponse al tipo SolicitudGIL que usa la FacturasFacade.
   *  SolicitudGIL (facturas.model) y SolicitudGil (solicitudes-gil.model) son dos
   *  tipos distintos — unificarlos es trabajo de un refactor posterior. */
  getSolicitudGIL(id: string): Observable<SolicitudGIL | undefined> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(
        map(g => this.gilResponseToSolicitudGIL(g)),
        catchError(err => throwError(() => err))
      );
  }

  private gilResponseToSolicitudGIL(g: GilResponse): SolicitudGIL {
    return {
      id: g.id,
      nombreVocero:            g.voceroNombre ?? '',
      horarios:                '',   // sin campo equivalente aún
      resultadoAprendizaje:    g.resultadoAprendizaje ?? '',
      estadoSolicitud:         g.estado as EstadoGIL,
      fechaCreacion:           g.fecha,
      totalEstimado:           0,    // calculado en backend
      responsable:             g.emitidoPor ?? '',
      regional:                '',
      centroFormacion:         g.centroFormacionId,
      areaPrograma:            g.area,
      cuentadanteResponsable:  g.cuentadantes?.[0]?.nombre ?? '',
      destinoBien:             g.destino,
      preFacturas:             [],
      observaciones:           g.observaciones ?? '',
      hashTransaccion:         '',
      idTransaccion:           '',
    };
  }
}
