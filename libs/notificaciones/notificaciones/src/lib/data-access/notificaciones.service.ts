import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import { Notificacion } from '../models/notificaciones.model'; // ✅ importa desde el modelo

export interface NotificacionPageResponse {
  content: Notificacion[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService extends BaseHttpService {
  private readonly resource = 'notificaciones';

  obtenerNotificaciones(page: number = 0, size: number = 20): Observable<NotificacionPageResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<NotificacionPageResponse>(this.buildUrl(this.resource), { params });
  }

  contarNoLeidas(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.buildUrl(`${this.resource}/no-leidas/count`));
  }

  marcarComoLeida(id: string): Observable<Notificacion> {
    return this.http.put<Notificacion>(this.buildUrl(`${this.resource}/${id}/leer`), {});
  }

  marcarTodasComoLeidas(): Observable<{ actualizadas: number }> {
    return this.http.put<{ actualizadas: number }>(this.buildUrl(`${this.resource}/leer-todas`), {});
  }
}