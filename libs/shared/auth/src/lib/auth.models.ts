import { Rol } from '@restaurant/shared/models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  rol: Rol;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  permisos: string[];
}