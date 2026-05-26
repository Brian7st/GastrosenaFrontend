import { Usuario } from '@restaurant/shared/models';

export interface UsuarioDetalle extends Usuario {
  apellidos:        string;
  documento:        string;
  telefono:         string;
  ultimoAcceso:     string | null;
  cuentaBloqueada:  boolean;
  intentosFallidos: number;
}

export interface CrearUsuarioRequest {
  documento:  string;
  nombre:     string;
  apellidos:  string;
  email:      string;
  telefono:   string;
  contrasena: string;
  idRol:      string;
}

/**
 * DTO para actualizar datos de un usuario.
 * NOTA: email y documento NO son modificables por seguridad.
 * Para cambiar el email se requiere un flujo de verificación separado.
 */
export interface ActualizarUsuarioRequest {
  nombre:    string;
  apellidos: string;
  telefono:  string;
  idRol:     string;
}

export interface RolOpcion {
  idRol:     string;
  nombreRol: string;
}

export interface FiltrosUsuarios {
  busqueda: string;
  rol:      string;
  pagina:   number;
  tamano:   number;
}

export interface ImportarUsuariosRequest {
  archivo: File;
  tipo:    'INSTRUCTOR' | 'APRENDIZ';
}

export interface ImportarUsuariosResponse {
  exitosos: number;
  fallidos: number;
  errores:  string[];
}

export interface ExportarConfig {
  formato:          'excel' | 'csv';
  incluirInactivos: boolean;
  rol:              string;
}

export interface PermisoItem {
  id:          string;
  nombre:      string;
  descripcion: string;
  activo:      boolean;
}

export interface RolDetalle {
  id:            string;
  nombre:        string;
  descripcion:   string;
  permisos:      PermisoItem[];
  totalUsuarios: number;
}

export interface HistorialItem {
  id:            string;
  usuarioNombre: string;
  usuarioEmail:  string;
  accion:        'LOGIN' | 'LOGOUT' | 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'BLOQUEO';
  fecha:         string;
  ip:            string;
  detalles:      string;
}
