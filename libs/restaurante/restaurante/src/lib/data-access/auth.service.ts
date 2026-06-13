import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly FALLBACK_ID = '00000000-0000-0000-0000-000000000001';

  /**
   * Intenta leer el token JWT del localStorage.
   * Si existe y es válido, extrae el ID del payload.
   * En caso de error o ausencia de token, retorna el FALLBACK_ID.
   */
  getUsuarioId(): string {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        return this.FALLBACK_ID;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return this.FALLBACK_ID; // Token mal formado
      }

      const payload = parts[1];
      const decodedPayload = atob(payload);
      const jsonPayload = JSON.parse(decodedPayload);

      // Verificamos las propiedades comunes donde suele venir el ID del usuario
      if (jsonPayload.id) {
        return jsonPayload.id;
      }
      if (jsonPayload.sub) {
        return jsonPayload.sub;
      }
      if (jsonPayload.usuarioId) {
        return jsonPayload.usuarioId;
      }

      return this.FALLBACK_ID;
    } catch (e) {
      console.error('[AuthService] Error al decodificar el token JWT', e);
      return this.FALLBACK_ID;
    }
  }

  getUsuarioNombre(): string {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) return 'Usuario Activo';

      const parts = token.split('.');
      if (parts.length !== 3) return 'Usuario Activo';

      const jsonPayload = JSON.parse(atob(parts[1]));

      if (jsonPayload.nombre) return jsonPayload.nombre;
      if (jsonPayload.nombreCompleto) return jsonPayload.nombreCompleto;
      if (jsonPayload.name) return jsonPayload.name;
      if (jsonPayload.username) return jsonPayload.username;
      if (jsonPayload.email) return jsonPayload.email;
      if (jsonPayload.preferred_username) return jsonPayload.preferred_username;
      if (jsonPayload.given_name) return jsonPayload.given_name;
      
      const nombreGuardado = localStorage.getItem('auth_nombre');
      if (nombreGuardado) return nombreGuardado;

      if (jsonPayload.sub) {
        const namePart = jsonPayload.sub.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/\./g, ' ');
      }

      return 'Usuario (ID: ' + this.getUsuarioId().substring(0,8) + ')';
    } catch (e) {
      return 'Usuario Activo';
    }
  }

  getRoles(): string[] {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) return [];

      const parts = token.split('.');
      if (parts.length !== 3) return [];

      const jsonPayload = JSON.parse(atob(parts[1]));

      let roles: any = [];
      if (jsonPayload.authorities) roles = jsonPayload.authorities;
      else if (jsonPayload.roles) roles = jsonPayload.roles;
      else if (jsonPayload.role) roles = [jsonPayload.role];
      else if (jsonPayload.realm_access?.roles) roles = jsonPayload.realm_access.roles;

      if (!Array.isArray(roles)) {
        if (typeof roles === 'string') {
          roles = [roles];
        } else {
          roles = [];
        }
      }

      return roles.map((r: string) => r.toUpperCase());
    } catch (e) {
      console.error('[AuthService] Error al extraer roles del token JWT', e);
      return [];
    }
  }

  hasAnyRole(allowedRoles: string[]): boolean {
    const userRoles = this.getRoles();
    return allowedRoles.some(r => userRoles.includes(r.toUpperCase()));
  }
}
