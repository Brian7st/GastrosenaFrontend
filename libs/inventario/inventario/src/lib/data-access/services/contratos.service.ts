import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Contrato,
  PrecioVigente,
  RegistrarContratoData,
  ResultadoImportacion,
} from '../../models/contrato.model';
import {
  ContratoResponse,
  ContratoCreatedResponse,
  ImportacionContratoResponse,
  PrecioVigenteResponse,
} from '../api/catalog.api';
import {
  contratoFromApi,
  contratoToRequest,
  precioVigenteFromApi,
} from '../mappers/catalog.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ContratosService {
  private http = inject(HttpClient);

  /** GET /catalog/contratos — opcionalmente filtrado por vigencia. */
  getContratos(vigencia?: number): Observable<Contrato[]> {
    let params = new HttpParams();
    if (vigencia !== undefined) params = params.set('vigencia', String(vigencia));

    return this.http
      .get<ContratoResponse[]>(`${API}/catalog/contratos`, { params })
      .pipe(
        map(res => res.map(contratoFromApi)),
        catchError(err => throwError(() => err)),
      );
  }

  /** GET /catalog/contratos/{id} */
  getContratoById(id: string): Observable<Contrato> {
    return this.http
      .get<ContratoResponse>(`${API}/catalog/contratos/${id}`)
      .pipe(
        map(contratoFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /** POST /catalog/contratos — registra el contrato y retorna su id. */
  registrarContrato(data: RegistrarContratoData): Observable<string> {
    return this.http
      .post<ContratoCreatedResponse>(`${API}/catalog/contratos`, contratoToRequest(data))
      .pipe(
        map(res => res.id),
        catchError(err => throwError(() => err)),
      );
  }

  /** POST /catalog/contratos/importar — registra el contrato y hace upsert de productos. */
  importarContrato(data: RegistrarContratoData): Observable<ResultadoImportacion> {
    return this.http
      .post<ImportacionContratoResponse>(`${API}/catalog/contratos/importar`, contratoToRequest(data))
      .pipe(
        map(res => ({
          contratoId: res.contratoId,
          productosCreados: res.productosCreados,
          productosActualizados: res.productosActualizados,
        })),
        catchError(err => throwError(() => err)),
      );
  }

  /** GET /catalog/contratos/precio?codigoSena&vigencia — precio adjudicado vigente (cascada VLOOKUP). */
  consultarPrecioVigente(codigoSena: string, vigencia: number): Observable<PrecioVigente> {
    const params = new HttpParams()
      .set('codigoSena', codigoSena)
      .set('vigencia', String(vigencia));

    return this.http
      .get<PrecioVigenteResponse>(`${API}/catalog/contratos/precio`, { params })
      .pipe(
        map(precioVigenteFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /** PATCH /catalog/contratos/{id}/cerrar — marca el contrato como CERRADO. */
  cerrarContrato(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/catalog/contratos/${id}/cerrar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }
}
