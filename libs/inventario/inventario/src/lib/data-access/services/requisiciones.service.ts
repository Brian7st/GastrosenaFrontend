import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Requisicion } from '../../models/requisicion.model';
import { RequisicionResponse } from '../api/legalization.api';
import { requisicionFromApi } from '../mappers/legalization.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class RequisicionesService {
  private http = inject(HttpClient);

  getRequisiciones(): Observable<Requisicion[]> {
    return this.http
      .get<RequisicionResponse[]>(`${API}/legalization/requisiciones`)
      .pipe(
        map(list => list.map(requisicionFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /legalization/requisiciones?estado=X
   *  Para salidas de Kardex usar estado 'DESPACHADA'.
   *  Pendiente backend B-04: confirmar el enum de estados válidos. */
  getRequisicionesByEstado(estado: string): Observable<Requisicion[]> {
    const params = new HttpParams().set('estado', estado);
    return this.http
      .get<RequisicionResponse[]>(`${API}/legalization/requisiciones`, { params })
      .pipe(
        map(list => list.map(requisicionFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getRequisicionById(id: string): Observable<Requisicion | undefined> {
    return this.http
      .get<RequisicionResponse>(`${API}/legalization/requisiciones/${id}`)
      .pipe(
        map(requisicionFromApi),
        catchError(err => throwError(() => err))
      );
  }

  crearRequisicion(data: Partial<Requisicion>): Observable<Requisicion> {
    // Mapeo al contrato exacto del backend CrearRequisicionHttpRequest
    const instructorNombre = data.instructorNombre?.trim()
      || data.instructorId  // fallback: usa el ID si no hay nombre
      || 'Instructor';

    const body = {
      sufijo:           data.fichaId ?? '',           // identificador de la ficha
      fecha:            data.fecha ?? '',             // ISO date "yyyy-MM-dd"
      horaSesion:       this.toLocalTime(data.horaSesion ?? ''),
      fichaId:          data.fichaId ?? '',
      instructorId:     data.instructorId ?? '',
      instructorNombre,
      items: (data.items ?? []).map(item => ({
        codigoSena:   item.productoId,      // backend espera codigoSena
        descripcion:  item.productoNombre,  // backend espera descripcion
        cantidad:     item.cantidad,
        unidadMedida: item.unidadMedida,
        categoria:    item.categoria,       // ya viene como CategoriaInsumo del draft
      })),
    };

    return this.http
      .post<{ id: string }>(`${API}/legalization/requisiciones`, body)
      .pipe(
        map(() => ({ ...data } as Requisicion)),
        catchError(err => throwError(() => err))
      );
  }

  /** Convierte "HH:mm" a "HH:mm:ss" que espera LocalTime en Spring Boot. */
  private toLocalTime(hora: string): string {
    if (!hora) return '00:00:00';
    return hora.length === 5 ? `${hora}:00` : hora;
  }

  /** PATCH /legalization/requisiciones/{id}/enviar — transición BORRADOR → ENVIADA */
  enviarRequisicion(id: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/enviar`, {})
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /legalization/requisiciones/{id}/despachar — economoId es @NotBlank en backend */
  despacharRequisicion(id: string, economoId: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/despachar`, { economoId })
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /legalization/requisiciones/{id}/firmar — voceroId es @NotBlank en backend */
  firmarRequisicion(id: string, voceroId: string): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/legalization/requisiciones/${id}/firmar`, { voceroId })
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /legalization/requisiciones/{id}/exportar — genera el .docx del acta */
  exportarRequisicion(id: string): Observable<{ exportId: string }> {
    return this.http
      .post<{ exportId: string }>(`${API}/legalization/requisiciones/${id}/exportar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eliminarRequisicion(_id: string): Observable<boolean> {
    return throwError(() => new Error('eliminarRequisicion: endpoint DELETE no disponible en backend'));
  }
}
