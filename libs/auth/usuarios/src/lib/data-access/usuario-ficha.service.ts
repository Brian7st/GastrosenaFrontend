import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import { Usuario } from '@restaurant/shared/models';
 
@Injectable({ providedIn: 'root' })
export class UsuarioFichaService extends BaseHttpService {
 
  // GET /api/fichas/{fichaId}/aprendices  — via UsuarioFichaController bajo /usuarios/{usuarioId}/fichas
  // El controller real es /api/usuarios/{usuarioId}/fichas/{fichaId}/aprendices
  // Pero como necesitamos los aprendices por ficha, hay un endpoint propio en FichaController
  getAprendicesByFicha(fichaId: string): Observable<Usuario[]> {
    // Endpoint: GET /api/fichas/{fichaId}/aprendices  (debe existir en FichaController o usar el de UsuarioFichaController)
    // Basado en el backend actual: GET /api/usuarios/{usuarioId}/fichas/{fichaId}/aprendices
    // Como no hay usuarioId aquí, el backend necesita exponer: GET /api/fichas/{fichaId}/aprendices
    return this.http.get<Usuario[]>(this.buildUrl(`fichas/${fichaId}/aprendices`));
  }
 
  // Vocero y Subvocero: el backend no tiene GET para estos, los inferimos desde UsuarioFicha
  // Necesitamos un endpoint: GET /api/fichas/{fichaId}/vocero  y  GET /api/fichas/{fichaId}/subvocero
  getVocero(fichaId: string): Observable<Usuario | null> {
    return this.http.get<Usuario | null>(this.buildUrl(`fichas/${fichaId}/vocero`));
  }
 
  getSubvocero(fichaId: string): Observable<Usuario | null> {
    return this.http.get<Usuario | null>(this.buildUrl(`fichas/${fichaId}/subvocero`));
  }
 
  // PUT /api/usuarios/{usuarioId}/fichas/{fichaId}/vocero/{voceroId}
  // voceroId es el aprendiz que se va a hacer vocero, usuarioId también (misma persona)
  asignarVocero(fichaId: string, voceroId: string): Observable<void> {
    return this.http.put<void>(
      this.buildUrl(`usuarios/${voceroId}/fichas/${fichaId}/vocero/${voceroId}`),
      {}
    );
  }
 
  // PUT /api/usuarios/{usuarioId}/fichas/{fichaId}/subvocero/{subvoceroId}
  asignarSubvocero(fichaId: string, subvoceroId: string): Observable<void> {
    return this.http.put<void>(
      this.buildUrl(`usuarios/${subvoceroId}/fichas/${fichaId}/subvocero/${subvoceroId}`),
      {}
    );
  }
 
  // DELETE /api/usuarios/{usuarioId}/fichas/{fichaId}/aprendiz/{aprendizId}/rol
  removerRol(fichaId: string, aprendizId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`usuarios/${aprendizId}/fichas/${fichaId}/aprendiz/${aprendizId}/rol`)
    );
  }
 
  // POST /api/usuarios/{usuarioId}/fichas/{fichaId}
  asignarAprendiz(fichaId: string, usuarioId: string): Observable<void> {
    return this.http.post<void>(
      this.buildUrl(`usuarios/${usuarioId}/fichas/${fichaId}`),
      {}
    );
  }

  // DELETE /api/usuarios/{usuarioId}/fichas/{fichaId}
  eliminarAprendiz(fichaId: string, usuarioId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`usuarios/${usuarioId}/fichas/${fichaId}`)
    );
  }
}