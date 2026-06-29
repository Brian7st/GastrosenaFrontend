import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActividadService, ActividadDTO, FichaService, FichaDTO, AprendizService } from './actividad.service';
import { EvaluacionService } from './evaluacion.service';

// ── Tipos exportados ──────────────────────────────────────────────────────────
export interface AprendizMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  ficha: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
  estado: 'Pendiente' | 'Aprobó' | 'No Aprobó';
  inactivo: boolean;
}

export type ActividadMock = ActividadDTO;
export type { FichaDTO };

@Injectable({ providedIn: 'root' })
export class CocinaFacade {
  private actividadService  = inject(ActividadService);
  private fichaService      = inject(FichaService);
  private aprendizService   = inject(AprendizService);
  private evaluacionService = inject(EvaluacionService);

  readonly aprendices     = signal<AprendizMock[]>([]);
  readonly actividades    = signal<ActividadMock[]>([]);
  readonly fichas         = signal<FichaDTO[]>([]);
  readonly fichasCargando = signal<boolean>(false);
  readonly aprendicesCargando = signal<boolean>(false);

  constructor() {
    this.cargarActividades();
    this.cargarFichas();
    this.cargarAprendices();
  }

  // ── Carga de aprendices (solo rol AUXILIAR_COCINA, sin mocks) ─────────────
  cargarAprendices(): void {
    this.aprendicesCargando.set(true);
    this.aprendizService.getAll().subscribe({
      next: (data) => {
        const mapeados: AprendizMock[] = (data || []).map(a => ({
          id:             a.id,
          nombreCompleto: a.nombreCompleto,
          inicial:        a.inicial || a.nombreCompleto.charAt(0).toUpperCase(),
          ficha:          a.ficha,
          jornada:        (a.jornada as 'Diurna' | 'Nocturna' | 'Mixta') || 'Diurna',
          estado:         'Pendiente' as const,
          inactivo:       a.inactivo,
        }));
        this.aprendices.set(mapeados);
        this.aprendicesCargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar aprendices con rol AUXILIAR_COCINA:', err);
        this.aprendices.set([]);
        this.aprendicesCargando.set(false);
      }
    });
  }

  // ── Carga de actividades ──────────────────────────────────────────────────
  cargarActividades(): void {
    this.actividadService.getAll().subscribe({
      next: (data) => this.actividades.set(data || []),
      error: (err) => console.error('Error cargando actividades:', err)
    });
  }

  // ── Carga de fichas (sin fallback a mock) ─────────────────────────────────
  cargarFichas(): void {
    this.fichasCargando.set(true);
    this.fichaService.getAll().subscribe({
      next: (data) => {
        this.fichas.set(data || []);
        this.fichasCargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar fichas desde el microservicio de usuarios:', err);
        this.fichas.set([]);
        this.fichasCargando.set(false);
      }
    });
  }

  // ── Actualizar estado de un aprendiz (evaluación) ────────────────────────
  actualizarEstado(id: number, estado: 'Aprobó' | 'No Aprobó'): void {
    this.aprendices.update(lista =>
      lista.map(a => a.id === id ? { ...a, estado } : a)
    );
  }

  // ── Crear actividad — devuelve el Observable para que el caller navegue
  //    DESPUÉS de tener el id real asignado por el backend ───────────────────
  crearActividad(data: Omit<ActividadMock, 'id' | 'estado'>): Observable<ActividadDTO> {
    return this.actividadService.create(data).pipe(
      tap((nueva) => this.actividades.update(list => [nueva, ...list]))
    );
  }

  // ── Actualizar estado de actividad ────────────────────────────────────────
  actualizarEstadoActividad(id: number, estado: 'Activa' | 'Finalizada' | 'Pendiente'): void {
    this.actividadService.updateEstado(id, estado).subscribe({
      next: (actualizada) => {
        this.actividades.update(list =>
          list.map(a => a.id === id ? actualizada : a)
        );
      },
      error: (err) => console.error('Error al actualizar estado de actividad:', err)
    });
  }

  // ── Eliminar actividad ────────────────────────────────────────────────────
  eliminarActividad(id: number): void {
    this.actividadService.delete(id).subscribe({
      next: () => this.actividades.update(list => list.filter(a => a.id !== id)),
      error: (err) => console.error('Error al eliminar actividad:', err)
    });
  }
}
