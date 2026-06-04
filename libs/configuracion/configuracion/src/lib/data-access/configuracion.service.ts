import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import {
  ConfiguracionCompleta,
  ConfiguracionFacturacion,
  ConfiguracionGeneral,
  ConfiguracionInventario,
  ConfiguracionNotificaciones,
  ConfiguracionSeguridad,
} from '../models/configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService extends BaseHttpService {
  private readonly resource = 'configuracion';

  obtenerConfig(): Observable<ConfiguracionCompleta> {
    return this.http.get<ConfiguracionCompleta>(
      this.buildUrl(this.resource),
    );
  }

  actualizarGeneral(
    data: ConfiguracionGeneral,
  ): Observable<ConfiguracionGeneral> {
    return this.http.put<ConfiguracionGeneral>(
      this.buildUrl(`${this.resource}/general`),
      data,
    );
  }

  actualizarSeguridad(
    data: ConfiguracionSeguridad,
  ): Observable<ConfiguracionSeguridad> {
    return this.http.put<ConfiguracionSeguridad>(
      this.buildUrl(`${this.resource}/seguridad`),
      data,
    );
  }

  actualizarFacturacion(
    data: ConfiguracionFacturacion,
  ): Observable<ConfiguracionFacturacion> {
    return this.http.put<ConfiguracionFacturacion>(
      this.buildUrl(`${this.resource}/facturacion`),
      data,
    );
  }

  actualizarInventario(
    data: ConfiguracionInventario,
  ): Observable<ConfiguracionInventario> {
    return this.http.put<ConfiguracionInventario>(
      this.buildUrl(`${this.resource}/inventario`),
      data,
    );
  }

  actualizarNotificaciones(
    data: ConfiguracionNotificaciones,
  ): Observable<ConfiguracionNotificaciones> {
    return this.http.put<ConfiguracionNotificaciones>(
      this.buildUrl(`${this.resource}/notificaciones`),
      data,
    );
  }
}
