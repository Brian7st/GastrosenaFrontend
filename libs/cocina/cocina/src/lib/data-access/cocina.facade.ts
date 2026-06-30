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

// ─────────────────────────────────────────────────────────────────────────────

/** Rol del microservicio de usuarios que representa a un auxiliar de cocina */
const ROL_AUXILIAR_COCINA = 'AUXILIAR_COCINA';

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
        // Una vez que tenemos las fichas, cargamos los aprendices de todas ellas
        this.cargarAprendices(data || []);
      },
      error: (err) => {
        console.error('Error al cargar fichas desde el microservicio de usuarios:', err);
        this.fichasCargando.set(false);
      }
    });
  }

  // ── Aprendices (solo rol AUXILIAR_COCINA, desde microservicio de usuarios) ─

  /**
   * Carga los aprendices de todas las fichas disponibles en paralelo.
   * Filtra únicamente los usuarios con rol AUXILIAR_COCINA.
   * El campo `inactivo` se deriva de `!usuario.estado` (el módulo de usuarios
   * gestiona los estados activo/inactivo).
   */
  cargarAprendices(fichas: FichaDTO[]): void {
    if (fichas.length === 0) {
      this.aprendices.set([]);
      return;
    }

    this.aprendicesCargando.set(true);

    // Obtener aprendices de cada ficha en paralelo
    const peticiones = fichas.map(ficha =>
      this.aprendizService.getByFichaId(ficha.id).pipe(
        catchError((err) => {
          console.error(`Error al cargar aprendices de ficha ${ficha.numero}:`, err);
          return of([] as UsuarioFichaDTO[]);
        }),
        map((usuarios: UsuarioFichaDTO[]) =>
          usuarios
            .filter(u => u.rol === ROL_AUXILIAR_COCINA)
            .map((u): AprendizDTO => ({
              // El backend de cocina usa Long para aprendizId. Como el id del
              // usuario en su microservicio viaja como string (ej. "1", "2"),
              // lo parseamos a Number para que coincida con el Long de BD.
              id: Number(u.idUsuario) || 0,
              nombreCompleto: `${u.nombre} ${u.apellidos}`.trim(),
              inicial: u.nombre.charAt(0).toUpperCase(),
              ficha: ficha.numero,
              jornada: 'Diurna', // La jornada viene de la ficha, no del usuario
              inactivo: !u.estado, // estado=false en usuarios → inactivo en cocina
              estado: 'Pendiente', // se actualizará al cruzar con evaluaciones
            }))
        )
      )
    );

    forkJoin(peticiones).subscribe({
      next: (resultados) => {
        // Aplanar resultados de todas las fichas
        const todos = resultados.flat();
        this.aprendices.set(todos);
        this.aprendicesCargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar aprendices:', err);
        this.aprendices.set([]);
        this.aprendicesCargando.set(false);
      }
    });
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
