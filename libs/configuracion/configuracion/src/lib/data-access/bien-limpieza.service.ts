import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@restaurant/shared/api';
import {
  BienInactivo,
  PagedResponse,
  RespuestaLimpieza,
} from '../models/bien-limpieza.model';

const CATALOG_PRODUCTOS = 'api/v1/catalog/productos';

@Injectable({ providedIn: 'root' })
export class BienLimpiezaService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private buildUrl(path: string): string {
    return `${this.apiBaseUrl}/${path}`;
  }

  listarInactivos(page = 0, size = 100): Observable<PagedResponse<BienInactivo>> {
    const params = new HttpParams()
      .set('activo', 'false')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PagedResponse<BienInactivo>>(
      this.buildUrl(CATALOG_PRODUCTOS),
      { params },
    );
  }

  limpiarDesactivados(): Observable<RespuestaLimpieza> {
    const body: { confirmacion: string } = { confirmacion: 'LIMPIAR' };
    return this.http.post<RespuestaLimpieza>(
      this.buildUrl(`${CATALOG_PRODUCTOS}/limpiar-desactivados`),
      body,
    );
  }
}
