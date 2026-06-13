import { signal } from '@angular/core';
import { AuthenticatedUser } from './auth.models';

function getUserFromStorage(): AuthenticatedUser | null {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const permisosGuardados = localStorage.getItem('auth_permisos');
    const nombreGuardado = localStorage.getItem('auth_nombre');

    return {
      id:       payload.userId,
      nombre:   nombreGuardado || payload.sub,
      email:    payload.sub,
      rol:      payload.nombreRol,
      permisos: permisosGuardados ? JSON.parse(permisosGuardados) : [],
    };
  } catch {
    return null;
  }
}

export const currentUserSignal = signal<AuthenticatedUser | null>(getUserFromStorage());