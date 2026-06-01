export interface PerfilUsuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  documento: string;
  telefono: string;
  rol: string;
  estado: boolean;
  fotoUrl?: string;
}

export interface ActualizarPerfilRequest {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmar: string;
}

export interface ActividadReciente {
  id: string;
  accion: string;
  fecha: string;
  modulo: string;
}