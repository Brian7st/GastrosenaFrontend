import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import {
  ConfiguracionCompleta,
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

  actualizarSeguridad(
    data: ConfiguracionSeguridad,
  ): Observable<ConfiguracionSeguridad> {
    return this.http.put<ConfiguracionSeguridad>(
      this.buildUrl(`${this.resource}/seguridad`),
      data,
    );
  }
}
