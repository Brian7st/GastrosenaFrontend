import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { currentUserSignal } from './current-user.signal';
import { AuthenticatedUser } from './auth.models';
import { Rol } from '@restaurant/shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // ✅ Ruta relativa para que el proxy la intercepte
  private readonly authUrl = '/api/auth';

  constructor() {
    // ❌ Elimina cualquier asignación de usuario por defecto
  }

  currentUser(): AuthenticatedUser | null {
    return currentUserSignal();
  }

  isAuthenticated(): boolean {
    return !!currentUserSignal();
  }

  // ✅ Método login REAL que llama al backend
  async login(email: string, password: string): Promise<AuthenticatedUser> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; idUsuario: string; nombreCompleto: string; email: string; rol: string }>(
          `${this.authUrl}/login`,
          { email, contrasena: password }
        )
      );
      if (response && response.token) {
        const usuario: AuthenticatedUser = {
          id: response.idUsuario,
          nombre: response.nombreCompleto,
          email: response.email,
          rol: response.rol as Rol
        };
        localStorage.setItem('auth_token', response.token);
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
    currentUserSignal.set(null);
  }

  // ✅ NUEVO MÉTODO: obtiene el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}