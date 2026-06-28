import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService } from '@restaurant/shared/api';
import { PaginatedResponse } from '@restaurant/shared/models';
import { AuthService } from '@restaurant/shared/auth';
import { Usuario } from '@restaurant/shared/models';
import {
  ActualizarUsuarioRequest,
  AsignacionMasivaRequest,
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

export interface EstadoImportacion {
  estado: 'EN_PROCESO' | 'COMPLETADO' | 'FALLIDO';
  errores?: Array<{ fila?: number; campo?: string; mensaje: string }>;
  registrosGuardados?: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseHttpService {
  private readonly resource = 'usuarios';
  private readonly authService = inject(AuthService);

  getUsuarios(filtros?: Partial<FiltrosUsuarios>): Observable<PaginatedResponse<UsuarioDetalle>> {
    let params = new HttpParams();
    if (filtros?.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros?.rol)      params = params.set('rol',      filtros.rol);
    if (filtros?.pagina  !== undefined) params = params.set('pagina',  String(filtros.pagina));
    if (filtros?.tamano  !== undefined) params = params.set('tamano',  String(filtros.tamano));

    return this.http.get<any>(this.buildUrl(this.resource), { params }).pipe(
      map(res => {
        const raw = Array.isArray(res) ? res : (res.content ?? []);
        const content = raw.map((u: any) => ({
          ...u,
          id:     u.idUsuario  ?? u.id,
          activo: u.estado     ?? u.activo,
          rol:    u.rol?.nombreRol ?? u.rol,
        }));
        return {
          content,
          totalElements: res.totalElements ?? content.length,
          totalPages:    res.totalPages    ?? 1,
          currentPage:   res.currentPage   ?? res.page ?? 0,
          size:          res.size          ?? content.length,
        };
      })
    );
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
    console.log('📤 Enviando POST /api/usuarios:', data);
    return this.http.post<UsuarioDetalle>(this.buildUrl(this.resource), data);
  }

  actualizarUsuario(id: string, data: ActualizarUsuarioRequest): Observable<UsuarioDetalle> {
    return this.http.put<UsuarioDetalle>(this.buildUrl(`${this.resource}/${id}`), data);
  }

  eliminarUsuario(id: string): Observable<void> {
    const userId = this.authService.currentUser()?.id;
    return this.http.delete<void>(this.buildUrl(`${this.resource}/${id}`), {
      headers: { 'X-User-ID': userId || '' }
    });
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
    const url = request.tipo === 'APRENDIZ'
      ? this.buildUrl('usuarios/masivo/aprendices')
      : this.buildUrl('usuarios/masivo/instructores');
    return this.http.post<ImportarUsuariosResponse>(url, formData);
  }

  obtenerEstadoImportacion(tareaId: string, tipo: 'APRENDIZ' | 'INSTRUCTOR'): Observable<EstadoImportacion> {
    const url = tipo === 'APRENDIZ'
      ? this.buildUrl(`usuarios/masivo/estado-aprendices/${tareaId}`)
      : this.buildUrl(`usuarios/masivo/estado-instructores/${tareaId}`);
    return this.http.get<EstadoImportacion>(url);
  }

  asignarRolMasivo(request: AsignacionMasivaRequest): Observable<void> {
    return this.http.put<void>(this.buildUrl(`${this.resource}/roles/masivo`), request);
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

  // ==================== PERFIL ====================
  obtenerPerfil(): Observable<UsuarioDetalle> {
    return this.http.get<UsuarioDetalle>(this.buildUrl('perfil'));
  }

  actualizarPerfil(data: Partial<UsuarioDetalle>): Observable<UsuarioDetalle> {
    return this.http.put<UsuarioDetalle>(this.buildUrl('perfil'), data);
  }

  cambiarContrasena(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(this.buildUrl('perfil/cambiar-contrasena'), {
      passwordActual: oldPassword,
      passwordNueva: newPassword
    });
  }

  actualizarFoto(userId: string, fotoUrl: string): Observable<void> {
    return this.http.patch<void>(
      this.buildUrl(`${this.resource}/${userId}/foto`),
      { fotoUrl }
    );
  }

  obtenerAprendices(): Observable<Usuario[]> {
    return this.http.get<any>(this.buildUrl(`${this.resource}?rol=APRENDIZ`)).pipe(
      map((res: any) => {
        const raw: any[] = Array.isArray(res) ? res : (res.content ?? []);
        return raw.map((u: any) => ({
          ...u,
          id:     u.idUsuario ?? u.id,
          activo: u.estado    ?? u.activo,
          rol:    u.rol?.nombreRol ?? u.rol,
        }));
      })
    );
  }
}