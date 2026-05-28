import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import {
  Notificacion,
  FiltrosNotificacion,
} from '../models/notificaciones.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesService extends BaseHttpService {
  private readonly resource = 'notificaciones';

  getNotificaciones(filtros?: FiltrosNotificacion): Observable<Notificacion[]> {
    let params = new HttpParams();
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.tipo)   params = params.set('tipo',   filtros.tipo);

    return this.http.get<Notificacion[]>(
      this.buildUrl(this.resource), { params }
    );
  }

  marcarComoLeida(id: string): Observable<void> {
    return this.http.patch<void>(
      this.buildUrl(`${this.resource}/${id}/leer`), {}
    );
  }

  marcarTodasLeidas(): Observable<void> {
    return this.http.patch<void>(
      this.buildUrl(`${this.resource}/leer-todas`), {}
    );
  }
}