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

// ─────────────────────────────────────────────────────────────────────────────

/** Gateway único de entrada — apunta al API Gateway en lugar de cada microservicio directamente */
const GATEWAY = 'http://localhost:8088';

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private http = inject(HttpClient);
  private readonly BASE = `${GATEWAY}/api/actividades`;

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
  private readonly BASE = `${GATEWAY}/api/fichas`;

  /** Obtiene todas las fichas desde el microservicio de usuarios vía el gateway */
  getAll(): Observable<FichaDTO[]> {
    return this.http.get<FichaDTO[]>(this.BASE);
  }
}
