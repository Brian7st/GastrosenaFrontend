import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GilResponse, PagedGilResponse, EstadoGil } from '../api/procurement.api';

const API = '/api/v1';

export interface GilesParams {
  estado?:       EstadoGil;
  codigoGrupo?:  string;
  page?:         number;
  size?:         number;
}

@Injectable({ providedIn: 'root' })
export class GilesService {
  private http = inject(HttpClient);

  /** GET /api/v1/procurement/giles
   *  Para entradas de Kardex usar estado: 'VERIFICADO' (conciliación FEL vs GIL completa). */
  getGiles(params: GilesParams = {}): Observable<PagedGilResponse> {
    let httpParams = new HttpParams();
    if (params.estado)       httpParams = httpParams.set('estado',       params.estado);
    if (params.codigoGrupo) httpParams = httpParams.set('codigoGrupo',  params.codigoGrupo);
    if (params.page != null)         httpParams = httpParams.set('page',                 String(params.page));
    if (params.size != null)         httpParams = httpParams.set('size',                 String(params.size));

    return this.http
      .get<PagedGilResponse>(`${API}/procurement/giles`, { params: httpParams })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** GET /api/v1/procurement/giles/{id} */
  getGilById(id: string): Observable<GilResponse> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /api/v1/procurement/giles/{id}/cerrar */
  cerrarGil(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/procurement/giles/${id}/cerrar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }
}
