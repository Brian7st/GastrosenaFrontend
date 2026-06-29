import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  inactivo: boolean; // true = inactivo (activo === false en el backend de usuarios)
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

/** Forma en que el microservicio de usuarios devuelve cada usuario */
interface UsuarioRaw {
  idUsuario?: number | string;
  id?:        number | string;
  nombre:     string;
  apellidos?: string;
  email:      string;
  activo?:    boolean;
  estado?:    boolean;
  ficha?:     string;
  jornada?:   string;
  rol?:       string | { nombreRol: string };
}

@Injectable({ providedIn: 'root' })
export class AprendizService {
  private http = inject(HttpClient);
  // Consumir únicamente usuarios con rol AUXILIAR_COCINA desde el microservicio de usuarios
  private readonly BASE = `${GATEWAY}/api/usuarios?rol=AUXILIAR_COCINA&tamano=500`;

  /** Obtiene aprendices con rol AUXILIAR_COCINA desde el microservicio de usuarios vía el gateway */
  getAll(): Observable<AprendizDTO[]> {
    return this.http.get<any>(this.BASE).pipe(
      map((res: any) => {
        const raw: UsuarioRaw[] = Array.isArray(res) ? res : (res.content ?? []);
        return raw.map((u) => {
          const id      = Number(u.idUsuario ?? u.id ?? 0);
          const nombre  = u.nombre ?? '';
          const ape     = u.apellidos ? ` ${u.apellidos}` : '';
          const fullName = `${nombre}${ape}`.trim();
          const inicial = fullName.charAt(0).toUpperCase();
          // activo puede venir como boolean `activo` o `estado`
          const esActivo = u.activo !== undefined ? u.activo : (u.estado !== undefined ? u.estado : true);
          return {
            id,
            nombreCompleto: fullName,
            inicial,
            ficha:    u.ficha    ?? '',
            jornada:  u.jornada  ?? 'Diurna',
            inactivo: !esActivo,
          } as AprendizDTO;
        });
      })
    );
  }
}
