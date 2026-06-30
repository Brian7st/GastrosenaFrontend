import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── DTOs alineados con el backend ─────────────────────────────────────────────

export interface ActividadDTO {
  id: number;
  nombre: string;
  /** formato ISO: 'YYYY-MM-DD' */
  fecha: string;
  jornada: string;
  ficha: string;
  trimestre: string;
  estado: 'Activa' | 'Finalizada' | 'Pendiente';
}

export type CreateActividadDTO = Omit<ActividadDTO, 'id' | 'estado'>;

/** DTO de ficha devuelto por el microservicio de usuarios vía API Gateway */
export interface FichaDTO {
  /** UUID de la ficha */
  id: string;
  numero: string;
  nombre?: string;
  programa?: string;
}

/** DTO de aprendiz mapeado desde el microservicio de usuarios vía API Gateway.
 *  El campo `inactivo` se deriva del campo `estado` del usuario:
 *  inactivo = !usuario.estado (false = activo, true = inactivo).
 */
export interface AprendizDTO {
  /** ID numérico del aprendiz en el microservicio de cocina (Long del backend) */
  id: number;
  nombreCompleto: string;
  inicial: string;
  /** Número de ficha al que pertenece (string del número visible) */
  ficha: string;
  jornada: string;
  /** true = inactivo (estado desactivado en el microservicio de usuarios) */
  inactivo: boolean;
  /** Estado de evaluación — se llena dinámicamente en el frontend */
  estado: 'Pendiente' | 'Aprobó' | 'No Aprobó';
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/actividades';

  /** Obtiene todas las actividades ordenadas por fecha desc */
  getAll(): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(this.BASE);
  }

  /** Crea una nueva actividad; el backend asigna id y estado='Pendiente' */
  create(dto: CreateActividadDTO): Observable<ActividadDTO> {
    return this.http.post<ActividadDTO>(this.BASE, dto);
  }

  /** Actualiza solo el estado de una actividad */
  updateEstado(id: number, estado: string): Observable<ActividadDTO> {
    return this.http.patch<ActividadDTO>(`${this.BASE}/${id}/estado`, { estado });
  }

  /** Elimina una actividad */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class FichaService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/fichas';

  /** Obtiene todas las fichas desde el microservicio de usuarios vía el gateway */
  getAll(): Observable<FichaDTO[]> {
    return this.http.get<FichaDTO[]>(this.BASE);
  }
}

/** DTO que devuelve el microservicio de usuarios para cada usuario/aprendiz */
export interface UsuarioFichaDTO {
  idUsuario: string;
  documento: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  /** true = activo, false = inactivo */
  estado: boolean;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AprendizService {
  private http = inject(HttpClient);
  private readonly BASE = `${GATEWAY}/api/fichas`;

  /**
   * Obtiene los aprendices (rol AUXILIAR_COCINA) de una ficha dado su UUID.
   * El microservicio de usuarios los expone en:
   * GET /api/fichas/{fichaUuid}/aprendices
   */
  getByFichaId(fichaId: string): Observable<UsuarioFichaDTO[]> {
    return this.http.get<UsuarioFichaDTO[]>(`${this.BASE}/${fichaId}/aprendices`);
  }
}
