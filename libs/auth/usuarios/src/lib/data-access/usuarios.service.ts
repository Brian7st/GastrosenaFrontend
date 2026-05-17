import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import { Usuario, PaginatedResponse } from '@restaurant/shared/models';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  FiltrosUsuarios,
  ImportarUsuariosRequest,
  ImportarUsuariosResponse,
  RolOpcion,
} from '../models/usuarios.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseHttpService {
  private readonly resource = 'usuarios';

  getUsuarios(filtros?: Partial<FiltrosUsuarios>): Observable<PaginatedResponse<Usuario>> {
    let params = new HttpParams();
    if (filtros?.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros?.rol)      params = params.set('rol', filtros.rol);
    if (filtros?.pagina  !== undefined) params = params.set('pagina',  String(filtros.pagina));
    if (filtros?.tamano  !== undefined) params = params.set('tamano',  String(filtros.tamano));
    return this.http.get<PaginatedResponse<Usuario>>(this.buildUrl(this.resource), { params });
  }

  getUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.buildUrl(`${this.resource}/${id}`));
  }

  getRoles(): Observable<RolOpcion[]> {
    return this.http.get<RolOpcion[]>(this.buildUrl('roles'));
  }

  crearUsuario(data: CrearUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.buildUrl(this.resource), data);
  }

  actualizarUsuario(id: string, data: ActualizarUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(this.buildUrl(`${this.resource}/${id}`), data);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.resource}/${id}`));
  }

  activarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(this.buildUrl(`${this.resource}/${id}/activar`), {});
  }

  desactivarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(this.buildUrl(`${this.resource}/${id}/desactivar`), {});
  }

  desbloquearCuenta(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(this.buildUrl(`${this.resource}/${id}/desbloquear`), {});
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

  exportarUsuarios(): Observable<Blob> {
    return this.http.get(this.buildUrl(`${this.resource}/exportar`), {
      responseType: 'blob',
    });
  }
}
