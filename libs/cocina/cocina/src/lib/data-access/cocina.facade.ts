import { Injectable, signal, inject, computed } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ActividadService,
  ActividadDTO,
  FichaService,
  FichaDTO,
  AprendizService,
  AprendizDTO,
  UsuarioFichaDTO,
} from './actividad.service';
import { EvaluacionService } from './evaluacion.service';

// ── Tipos públicos exportados ──────────────────────────────────────────────────

export type ActividadMock = ActividadDTO;
export type { FichaDTO, AprendizDTO };
export type AprendizMock = AprendizDTO;

const APRENDICES_MOCK: AprendizMock[] = [
  {
    id: 1,
    nombreCompleto: 'Juan Pérez',
    inicial: 'J',
    ficha: '2561234',
    jornada: 'Diurna',
    inactivo: false,
    estado: 'Pendiente'
  },
  {
    id: 2,
    nombreCompleto: 'María Gómez',
    inicial: 'M',
    ficha: '2561234',
    jornada: 'Diurna',
    inactivo: false,
    estado: 'Pendiente'
  },
  {
    id: 3,
    nombreCompleto: 'Carlos Ruiz',
    inicial: 'C',
    ficha: '2561235',
    jornada: 'Mixta',
    inactivo: true,
    estado: 'Pendiente'
  },
  {
    id: 4,
    nombreCompleto: 'Ana Martínez',
    inicial: 'A',
    ficha: '2561235',
    jornada: 'Mixta',
    inactivo: false,
    estado: 'Pendiente'
  }
];

@Injectable({ providedIn: 'root' })
export class CocinaFacade {
  private actividadService  = inject(ActividadService);
  private fichaService      = inject(FichaService);
  private aprendizService   = inject(AprendizService);
  private evaluacionService = inject(EvaluacionService);

  // ── Estado ────────────────────────────────────────────────────────────────
  readonly aprendices        = signal<AprendizDTO[]>([]);
  readonly actividades       = signal<ActividadDTO[]>([]);
  readonly fichas            = signal<FichaDTO[]>([]);
  readonly fichasCargando    = signal<boolean>(false);
  readonly aprendicesCargando = signal<boolean>(false);

  constructor() {
    this.cargarActividades();
    this.cargarFichas();
  }

  // ── Fichas (microservicio de usuarios vía API Gateway) ───────────────────

  cargarFichas(): void {
    this.fichasCargando.set(true);
    this.fichaService.getAll().subscribe({
      next: (data) => {
        this.fichas.set(data || []);
        this.fichasCargando.set(false);
        // Una vez que tenemos las fichas, cargamos los aprendices (desde el mock temporalmente)
        this.cargarAprendices(data || []);
      },
      error: (err) => {
        console.error('Error al cargar fichas desde el microservicio de usuarios:', err);
        this.fichasCargando.set(false);
        // Aún si falla, cargamos el mock para que la vista funcione
        this.cargarAprendices([]);
      }
    });
  }

  // ── Aprendices (Mock temporal) ─────────────────────────────────────────────

  cargarAprendices(fichas: FichaDTO[] = []): void {
    this.aprendicesCargando.set(true);
    // Generar el mock para las fichas reales cargadas, para que el filtro por ficha coincida
    setTimeout(() => {
      const todos = fichas.length > 0 
        ? fichas.flatMap((f, fIdx) => APRENDICES_MOCK.map((a, aIdx) => ({
            ...a,
            id: a.id + (fIdx * 100), // IDs únicos
            ficha: f.numero // Asignamos la ficha real para que coincida en la vista
          })))
        : APRENDICES_MOCK;
        
      this.aprendices.set(todos);
      this.aprendicesCargando.set(false);
    }, 300);
  }

  // ── Actividades ───────────────────────────────────────────────────────────

  cargarActividades(): void {
    this.actividadService.getAll().subscribe({
      next: (data) => this.actividades.set(data || []),
      error: (err) => console.error('Error cargando actividades:', err)
    });
  }

  // ── Evaluaciones ──────────────────────────────────────────────────────────

  /**
   * Actualiza el estado de evaluación de un aprendiz en el estado local.
   * Se llama tras un submit exitoso al backend de cocina.
   */
  actualizarEstado(id: number, estado: 'Aprobó' | 'No Aprobó'): void {
    this.aprendices.update(lista =>
      lista.map(a => a.id === id ? { ...a, estado } : a)
    );
  }

  // ── Actividades CRUD ──────────────────────────────────────────────────────

  crearActividad(data: Omit<ActividadMock, 'id' | 'estado'>): void {
    this.actividadService.create(data).subscribe({
      next: (nueva) => {
        this.actividades.update(list => [nueva, ...list]);
      },
      error: (err) => console.error('Error al crear actividad:', err)
    });
  }

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

  eliminarActividad(id: number): void {
    this.actividadService.delete(id).subscribe({
      next: () => {
        this.actividades.update(list => list.filter(a => a.id !== id));
      },
      error: (err) => console.error('Error al eliminar actividad:', err)
    });
  }
}
