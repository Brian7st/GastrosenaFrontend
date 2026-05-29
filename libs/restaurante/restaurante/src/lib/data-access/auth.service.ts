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
      const token = localStorage.getItem('token');
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
}
