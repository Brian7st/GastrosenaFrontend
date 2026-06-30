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

export interface FichaDTO {
  id: number;
  numero: string;
  nombre?: string;
  programa?: string;
}

export interface AprendizDTO {
  id: number;
  nombreCompleto: string;
  inicial: string;
  ficha: string;
  jornada: string;
  inactivo?: boolean;
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

@Injectable({ providedIn: 'root' })
export class AprendizService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/aprendices';

  /** Obtiene todos los aprendices desde el microservicio de usuarios vía el gateway */
  getAll(): Observable<AprendizDTO[]> {
    return this.http.get<AprendizDTO[]>(this.BASE);
  }
}
