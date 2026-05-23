import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Factura, FacturaFiltros, FacturaKpis, SolicitudGIL } from '../../models/facturas.model';
import { FACTURAS_MOCK, FACTURAS_KPIS_MOCK, SOLICITUD_GIL_MOCK } from '../../models/facturas.mock';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  /**
   * Obtiene el listado de facturas con filtros opcionales.
   */
  getFacturas(filtros?: FacturaFiltros): Observable<Factura[]> {
    let result = [...FACTURAS_MOCK];

    if (filtros?.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      result = result.filter(f =>
        f.proveedorNombre.toLowerCase().includes(q) ||
        f.numeroFactura.toLowerCase().includes(q) ||
        (f.ordenCompra ?? '').toLowerCase().includes(q)
      );
    }
    if (filtros?.estado) {
      result = result.filter(f => f.estado === filtros.estado);
    }

    return of(result).pipe(delay(500));
  }

  /**
   * Obtiene los KPIs del panel de facturación.
   */
  getKpis(): Observable<FacturaKpis> {
    return of(FACTURAS_KPIS_MOCK).pipe(delay(300));
  }

  /**
   * Obtiene una factura por ID.
   */
  getFacturaById(id: string | number): Observable<Factura | undefined> {
    const factura = FACTURAS_MOCK.find(f => f.id.toString() === id.toString());
    return of(factura).pipe(delay(300));
  }

  /**
   * Crea una nueva factura FEL.
   */
  createFactura(data: Partial<Factura>): Observable<Factura> {
    const nueva = {
      ...data,
      id: Math.floor(Math.random() * 10000),
      estado: 'REGISTRADA',
      subtotal: 0,
      totalIva: 0,
      total: 0,
      lineas: [],
    } as Factura;
    return of(nueva).pipe(delay(800));
  }

  /**
   * Actualiza una factura existente.
   */
  updateFactura(id: string | number, data: Partial<Factura>): Observable<Factura> {
    const original = FACTURAS_MOCK.find(f => f.id.toString() === id.toString());
    const actualizada = { ...original, ...data } as Factura;
    return of(actualizada).pipe(delay(800));
  }

  /**
   * Anula una factura.
   */
  anularFactura(id: string | number): Observable<void> {
    return of(undefined).pipe(delay(800));
  }

  /**
   * Obtiene una solicitud GIL por ID.
   */
  getSolicitudGIL(id: string): Observable<SolicitudGIL | undefined> {
    if (id === SOLICITUD_GIL_MOCK.id) return of(SOLICITUD_GIL_MOCK).pipe(delay(300));
    return of(undefined).pipe(delay(300));
  }
}
