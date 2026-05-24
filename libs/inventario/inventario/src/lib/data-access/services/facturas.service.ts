import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Factura, FacturaFiltros, FacturaKpis, FacturaFormDto } from '../../models/facturas.model';
import { SolicitudGil } from '../../models/solicitudes-gil.model';
import { FacturaResponse, FacturaResumenResponse, GilResponse } from '../api/sourcing.api';
import { facturaFromApi, facturaFormToRequest, gilFromApi } from '../mappers/sourcing.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private http = inject(HttpClient);

  getFacturas(filtros?: FacturaFiltros): Observable<Factura[]> {
    let params = new HttpParams();
    if (filtros?.busqueda)    params = params.set('q', filtros.busqueda);
    if (filtros?.estado)      params = params.set('estado', filtros.estado);
    if (filtros?.proveedor)   params = params.set('proveedor', filtros.proveedor);
    if (filtros?.fechaDesde)  params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros?.fechaHasta)  params = params.set('fechaHasta', filtros.fechaHasta);

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

  createFactura(form: FacturaFormDto): Observable<Factura> {
    return this.http
      .post<FacturaResponse>(`${API}/sourcing/facturas`, facturaFormToRequest(form))
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  updateFactura(id: string | number, form: FacturaFormDto): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}`, facturaFormToRequest(form))
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

  getSolicitudGIL(id: string): Observable<SolicitudGil | undefined> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(
        map(gilFromApi),
        catchError(err => throwError(() => err))
      );
  }
}
