export interface CrearUsuarioRequest {
  documento:  string;
  nombre:     string;
  apellidos:  string;
  email:      string;
  telefono:   string;
  contrasena: string;
  idRol:      string;
}

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
