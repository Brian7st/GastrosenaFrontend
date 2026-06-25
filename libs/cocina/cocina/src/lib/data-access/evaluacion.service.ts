import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── DTOs alineados con el backend ─────────────────────────────────────────────

/**
 * Registro de evaluación guardado en la BD.
 * El frontend cruza este dato con su lista de aprendices (mock o microservicio externo).
 */
export interface EvaluacionResponseDTO {
  aprendizId: number;
  estado: 'Aprobó' | 'No Aprobó';
  observaciones: string;
}

export interface EvaluacionRequestDTO {
  aprendizId: number;
  observaciones: string;
  /** 'aprobo' | 'no_aprobo' */
  resultado: 'aprobo' | 'no_aprobo';
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class EvaluacionService {
  private http = inject(HttpClient);
  private readonly BASE = 'http://localhost:8088/api/actividades';

  /**
   * Obtiene los registros de evaluación persistidos en BD para una actividad.
   * El frontend usa esta lista para actualizar el estado de cada aprendiz del mock.
   */
  getEvaluacionesPorActividad(actividadId: number): Observable<EvaluacionResponseDTO[]> {
    return this.http.get<EvaluacionResponseDTO[]>(`${this.BASE}/${actividadId}/evaluaciones`);
  }

  /**
   * Persiste la evaluación de uno o más aprendices en la BD.
   * Funciona para evaluación individual y masiva.
   */
  evaluarAprendices(actividadId: number, requests: EvaluacionRequestDTO[]): Observable<void> {
    return this.http.post<void>(`${this.BASE}/${actividadId}/evaluar`, requests);
  }
}
