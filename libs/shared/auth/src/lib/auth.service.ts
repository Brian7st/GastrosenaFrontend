import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { currentUserSignal } from './current-user.signal';
import { AuthenticatedUser } from './auth.models';
import { Rol } from '@restaurant/shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = '/api/auth';

  constructor() {}

  currentUser(): AuthenticatedUser | null {
    return currentUserSignal();
  }

  isAuthenticated(): boolean {
    return !!currentUserSignal();
  }

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    try {
      const response = await firstValueFrom(
        this.http.post<{
          token: string;
          idUsuario: string;
          nombreCompleto: string;
          email: string;
          rol: string;
          permisos: string[];
        }>(
          `${this.authUrl}/login`,
          { email, contrasena: password }
        )
      );
      if (response && response.token) {
        const usuario: AuthenticatedUser = {
          id:       response.idUsuario,
          nombre:   response.nombreCompleto,
          email:    response.email,
          rol:      response.rol as Rol,
          permisos: response.permisos ?? [],
        };
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_permisos', JSON.stringify(response.permisos ?? []));
        currentUserSignal.set(usuario);
        return usuario;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  recuperarContrasena(email: string): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${this.authUrl}/recuperar`, { email })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_permisos');
    currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasPermiso(permiso: string): boolean {
    return this.currentUser()?.permisos.includes(permiso) ?? false;
  }

  hasAlgunPermiso(permisos: string[]): boolean {
    return permisos.some(p => this.hasPermiso(p));
  }

  resetPassword(token: string, newPassword: string): Promise<void> {
  return firstValueFrom(
    this.http.post<void>(`${this.authUrl}/reset-password`, { token, nuevaPassword: newPassword })
  );
}
}