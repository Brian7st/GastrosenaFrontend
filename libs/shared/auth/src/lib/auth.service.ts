import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currentUserSignal } from './current-user.signal';
import { AuthenticatedUser } from './auth.models';
import { Rol } from '@restaurant/shared/models';
import { API_BASE_URL } from '@restaurant/shared/api';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly fallbackUser: AuthenticatedUser = {
    id: 'seed-admin',
    nombre: 'Administrador Base',
    email: 'admin@gastrosena.local',
    rol: Rol.ADMINISTRADOR,
  };

  constructor() {
    if (!currentUserSignal()) {
      currentUserSignal.set(this.fallbackUser);
    }
  }

  currentUser(): AuthenticatedUser | null {
    return currentUserSignal();
  }

  isAuthenticated(): boolean {
    return !!currentUserSignal();
  }

  login(_email: string, _password: string): void {
    // TODO: replace with real HTTP call
    currentUserSignal.set(this.fallbackUser);
  }

  recuperarContrasena(email: string): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${this.apiBaseUrl}/auth/recuperar`, { email })
    );
  }

  logout(): void {
    currentUserSignal.set(null);
  }
}