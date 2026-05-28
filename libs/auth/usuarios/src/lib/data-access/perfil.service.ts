import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import {
  PerfilUsuario,
  ActualizarPerfilRequest,
  CambiarContrasenaRequest,
  ActividadReciente,
} from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService extends BaseHttpService {
  private readonly resource = 'usuarios';

  getPerfil(userId: string): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(
      this.buildUrl(`${this.resource}/${userId}/perfil`)
    );
  }

  actualizarPerfil(userId: string, data: ActualizarPerfilRequest): Observable<PerfilUsuario> {
    return this.http.put<PerfilUsuario>(
      this.buildUrl(`${this.resource}/${userId}/perfil`), data
    );
  }

  cambiarContrasena(userId: string, data: CambiarContrasenaRequest): Observable<void> {
    return this.http.patch<void>(
      this.buildUrl(`${this.resource}/${userId}/contrasena`), data
    );
  }

  getActividadReciente(userId: string): Observable<ActividadReciente[]> {
    return this.http.get<ActividadReciente[]>(
      this.buildUrl(`${this.resource}/${userId}/actividad`)
    );
  }

  subirFoto(userId: string, foto: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.post<{ fotoUrl: string }>(
      this.buildUrl(`${this.resource}/${userId}/foto`), formData
    );
  }
}