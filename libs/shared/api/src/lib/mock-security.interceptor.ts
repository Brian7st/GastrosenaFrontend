import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor de seguridad para el perfil de desarrollo.
 *
 * Inyecta los headers que consume MockSecurityFilter.java en el backend
 * (activo con @Profile("dev")):
 *   - X-Mock-User-Id:   UUID del usuario simulado (por defecto: el UUID de seed)
 *   - X-Mock-User-Role: Rol del usuario simulado   (por defecto: MESERO)
 *
 * Para probar con un rol diferente (ej. INSTRUCTOR), cambia los valores
 * de las constantes o inyéctalos desde un servicio de contexto de usuario.
 */
const MOCK_USER_ID   = '00000000-0000-0000-0000-000000000001';
const MOCK_USER_ROLE = 'MESERO';

export const mockSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    setHeaders: {
      'X-Mock-User-Id':   MOCK_USER_ID,
      'X-Mock-User-Role': MOCK_USER_ROLE,
    },
  });

  return next(secureReq);
};
