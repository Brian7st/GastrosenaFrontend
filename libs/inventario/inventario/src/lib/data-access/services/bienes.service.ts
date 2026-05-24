import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Bien, BienFiltros, BienKpis, BienFormDto, EstadoBien } from '../../models/inventario.model';
import { PagedResponse, ProductoResponse } from '../api/catalog.api';
import { bienFormToRequest } from '../mappers/catalog.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class BienesService {
  private http = inject(HttpClient);

  getBienes(filtros?: BienFiltros): Observable<Bien[]> {
    let params = new HttpParams();
    if (filtros?.busqueda)  params = params.set('q', filtros.busqueda);
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.estado)    params = params.set('estado', filtros.estado);

    return this.http
      .get<PagedResponse<ProductoResponse>>(`${API}/catalog/productos`, { params })
      .pipe(
        map(res => res.content.map(p => this.toUiModel(p))),
        catchError(err => throwError(() => err))
      );
  }

  /** TODO: endpoint dedicado pendiente en backend — RF por confirmar */
  getKpis(): Observable<BienKpis> {
    return of({ valorTotal: 0, totalAlertas: 0, movimientosHoy: 0 });
  }

  getBienById(id: string | number): Observable<Bien | undefined> {
    return this.http
      .get<ProductoResponse>(`${API}/catalog/productos/${id}`)
      .pipe(
        map(p => this.toUiModel(p)),
        catchError(err => throwError(() => err))
      );
  }

  createBien(form: BienFormDto): Observable<Bien> {
    return this.http
      .post<ProductoResponse>(`${API}/catalog/productos`, bienFormToRequest(form))
      .pipe(
        map(p => this.toUiModel(p)),
        catchError(err => throwError(() => err))
      );
  }

  updateBien(id: string | number, form: BienFormDto): Observable<Bien> {
    return this.http
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}`, bienFormToRequest(form))
      .pipe(
        map(p => this.toUiModel(p)),
        catchError(err => throwError(() => err))
      );
  }

  deleteBien(id: string | number): Observable<void> {
    return this.http
      .delete<void>(`${API}/catalog/productos/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** Adapta ProductoResponse a Bien con defaults para campos de UI.
   *  FE-04 completará valor y estado con /inventory/existencias. */
  private toUiModel(dto: ProductoResponse): Bien {
    return {
      id: dto.id,
      nombre: dto.nombre,
      codigoSena: dto.codigoSena,
      codigoProveedor: dto.codigoProveedor ?? '',
      descripcion: dto.descripcion ?? '',
      categoria: dto.categoria,
      unidadMedida: dto.unidadMedida,
      valor: 0,
      estado: (dto.activo ? 'Activo' : 'Inactivo') as EstadoBien,
    } as Bien;
  }
}
