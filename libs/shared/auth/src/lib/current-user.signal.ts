import { signal } from '@angular/core';
import { AuthenticatedUser } from './auth.models';

function getUserFromStorage(): AuthenticatedUser | null {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id:     payload.userId,
      nombre: payload.sub,
      email:  payload.sub,
      rol:    payload.nombreRol,
    };
  } catch {
    return null;
  }
}

export const currentUserSignal = signal<AuthenticatedUser | null>(getUserFromStorage());