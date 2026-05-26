import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import { PaginatedResponse } from '@restaurant/shared/models';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ExportarConfig,
  FiltrosUsuarios,
  HistorialItem,
  ImportarUsuariosRequest,
  ImportarUsuariosResponse,
  RolDetalle,
  RolOpcion,
  UsuarioDetalle,
} from '../models/usuarios.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseHttpService {
  private readonly resource = 'usuarios';

  getUsuarios(filtros?: Partial<FiltrosUsuarios>): Observable<PaginatedResponse<UsuarioDetalle>> {
    let params = new HttpParams();
    if (filtros?.busqueda)  params = params.set('busqueda', filtros.busqueda);
    if (filtros?.rol)       params = params.set('rol', filtros.rol);
    if (filtros?.pagina  !== undefined) params = params.set('pagina',  String(filtros.pagina));
    if (filtros?.tamano  !== undefined) params = params.set('tamano',  String(filtros.tamano));
    return this.http.get<PaginatedResponse<UsuarioDetalle>>(this.buildUrl(this.resource), { params });
  }

  getUsuarioPorId(id: string): Observable<UsuarioDetalle> {
    return this.http.get<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}`));
  }

  getRoles(): Observable<RolOpcion[]> {
    return this.http.get<RolOpcion[]>(this.buildUrl('roles'));
  }

  getRolesDetalle(): Observable<RolDetalle[]> {
    return this.http.get<RolDetalle[]>(this.buildUrl('roles'));
  }

  crearUsuario(data: CrearUsuarioRequest): Observable<UsuarioDetalle> {
    return this.http.post<UsuarioDetalle>(this.buildUrl(this.resource), data);
  }

  actualizarUsuario(id: string, data: ActualizarUsuarioRequest): Observable<UsuarioDetalle> {
    return this.http.put<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}`), data);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.resource}/${id}`));
  }

  activarUsuario(id: string): Observable<UsuarioDetalle> {
    return this.http.patch<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}/activar`), {});
  }

  desactivarUsuario(id: string): Observable<UsuarioDetalle> {
    return this.http.patch<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}/desactivar`), {});
  }

  desbloquearCuenta(id: string): Observable<UsuarioDetalle> {
    return this.http.patch<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}/desbloquear`), {});
  }

  importarMasivo(request: ImportarUsuariosRequest): Observable<ImportarUsuariosResponse> {
    const formData = new FormData();
    formData.append('archivo', request.archivo);
    formData.append('tipo', request.tipo);
    return this.http.post<ImportarUsuariosResponse>(
      this.buildUrl(`${this.resource}/importar`),
      formData,
    );
  }

  getHistorial(): Observable<HistorialItem[]> {
    return this.http.get<HistorialItem[]>(this.buildUrl(`${this.resource}/historial`));
  }

  exportarUsuarios(config: ExportarConfig): Observable<Blob> {
    const params = new HttpParams()
      .set('formato',          config.formato)
      .set('incluirInactivos', String(config.incluirInactivos))
      .set('rol',              config.rol);
    return this.http.get(
      this.buildUrl(`${this.resource}/exportar`),
      { params, responseType: 'blob' },
    );
  }
}
