import { Injectable } from '@angular/core';
import { currentUserSignal } from './current-user.signal';
import { AuthenticatedUser } from './auth.models';
import { Rol } from '@restaurant/shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
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
    // TODO: replace with real HTTP call using BaseHttpService and LoginRequest
    currentUserSignal.set(this.fallbackUser);
  }

  logout(): void {
    currentUserSignal.set(null);
  }
}
