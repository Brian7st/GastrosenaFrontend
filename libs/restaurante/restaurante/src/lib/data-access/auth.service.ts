import { Injectable } from '@angular/core';
import { currentUserSignal } from '@restaurant/shared/auth';

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
      // 1. Intentar leer desde el objeto 'user' del localStorage (usado por ga-web-inicio-general y mocks)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.nombreCompleto) return userObj.nombreCompleto;
        } catch(e) {}
      }

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
      // 0. Intentar extraer del shared signal (fuente principal de verdad)
      try {
        const signalUser = currentUserSignal();
        if (signalUser) {
          let rolesAndPerms = [...(signalUser.permisos || [])];
          if (signalUser.rol) {
            rolesAndPerms.push(signalUser.rol);
          }
          if (rolesAndPerms.length > 0) {
            return rolesAndPerms.map((r: string) => r.toUpperCase());
          }
        }
      } catch (e) {}

      // 1. Intentar leer desde el objeto 'user' del localStorage (usado por ga-web-inicio-general y mocks)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.rol) {
            return [userObj.rol.toUpperCase()];
          }
        } catch(e) {}
      }

      // 2. Intentar extraer del JWT real
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      let roles: any = [];

      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            const jsonPayload = JSON.parse(atob(parts[1]));
            if (jsonPayload.authorities) roles = roles.concat(jsonPayload.authorities);
            if (jsonPayload.roles) roles = roles.concat(jsonPayload.roles);
            if (jsonPayload.role) roles.push(jsonPayload.role);
            if (jsonPayload.realm_access?.roles) roles = roles.concat(jsonPayload.realm_access.roles);
            if (jsonPayload.rol) roles.push(jsonPayload.rol);
            if (jsonPayload.nombreRol) roles.push(jsonPayload.nombreRol);
          } catch(e) {}
        }
      }

      // 3. Fallback: extraer desde auth_permisos (shared auth service de Gastrosena guarda permisos aquí)
      const authPermisosStr = localStorage.getItem('auth_permisos');
      if (authPermisosStr) {
        try {
          const permisosObj = JSON.parse(authPermisosStr);
          if (Array.isArray(permisosObj)) {
            roles = roles.concat(permisosObj);
          }
        } catch(e) {}
      }

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
