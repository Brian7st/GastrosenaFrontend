import { Injectable, inject, signal } from '@angular/core';
import { ActividadService, ActividadDTO, CreateActividadDTO } from './actividad.service';
import { EvaluacionService, EvaluacionRequestDTO } from './evaluacion.service';

// ── Interfaces públicas ───────────────────────────────────────────────────────

export interface AprendizMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  ficha: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
  estado: 'Pendiente' | 'Aprobó' | 'No Aprobó';
  inactivo?: boolean;
}

export type ActividadMock = ActividadDTO;

// ── Mock de aprendices ────────────────────────────────────────────────────────
// Los aprendices pertenecen a otro microservicio.
// Este mock se usa mientras ese servicio no esté disponible.
// Cuando esté listo, simplemente se reemplaza APRENDICES_MOCK por una llamada HTTP.
const APRENDICES_MOCK: AprendizMock[] = [
  { id: 1, nombreCompleto: 'Camila Rodriguez Torres',  inicial: 'C', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 2, nombreCompleto: 'Andrés Felipe Mora',       inicial: 'A', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 3, nombreCompleto: 'Laura Valentina Gómez',    inicial: 'L', ficha: '2489012', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 4, nombreCompleto: 'María Fernanda Castro',    inicial: 'M', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 5, nombreCompleto: 'Valeria Ospina Herrera',   inicial: 'V', ficha: '2632456', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 6, nombreCompleto: 'Juan Pérez',               inicial: 'J', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente', inactivo: true },
  { id: 7, nombreCompleto: 'Ana López',                inicial: 'A', ficha: '2489012', jornada: 'Nocturna', estado: 'Pendiente', inactivo: true },
];

// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class CocinaFacade {

  private actividadService = inject(ActividadService);
  private evaluacionService = inject(EvaluacionService);

  // ── Estado reactivo ─────────────────────────────────────────────────────────
  readonly actividades = signal<ActividadMock[]>([]);

  /**
   * Lista de aprendices con sus estados de evaluación.
   * Inicia desde el mock; los estados se actualizan consultando la BD.
   */
  readonly aprendices = signal<AprendizMock[]>([...APRENDICES_MOCK]);

  // ── Loading / error ─────────────────────────────────────────────────────────
  readonly cargandoActividades = signal<boolean>(false);
  readonly errorActividades = signal<string | null>(null);
  readonly cargandoAprendices = signal<boolean>(false);

  // ── Actividades (propiedad de este microservicio) ────────────────────────────

  /** Carga actividades desde el backend */
  cargarActividades(): void {
    this.cargandoActividades.set(true);
    this.errorActividades.set(null);

    this.actividadService.getAll().subscribe({
      next: (data) => {
        this.actividades.set(data as ActividadMock[]);
        this.cargandoActividades.set(false);
      },
      error: (err) => {
        console.error('[CocinaFacade] Error cargando actividades:', err);
        this.errorActividades.set('No se pudieron cargar las actividades. Verifica que el backend esté activo.');
        this.cargandoActividades.set(false);
      },
    });
  }

  /** Crea una nueva actividad y la refleja en el estado local */
  crearActividad(data: CreateActividadDTO): void {
    this.actividadService.create(data).subscribe({
      next: (nueva) => {
        this.actividades.update(list => [nueva as ActividadMock, ...list]);
      },
      error: (err) => {
        console.error('[CocinaFacade] Error creando actividad:', err);
      },
    });
  }

  /** Actualiza el estado de una actividad */
  actualizarEstadoActividad(id: number, estado: 'Activa' | 'Finalizada' | 'Pendiente'): void {
    this.actividadService.updateEstado(id, estado).subscribe({
      next: (updated) => {
        this.actividades.update(list =>
          list.map(a => a.id === id ? { ...a, estado: updated.estado } : a)
        );
      },
      error: (err) => {
        console.error('[CocinaFacade] Error actualizando estado de actividad:', err);
      },
    });
  }

  /** Elimina una actividad */
  eliminarActividad(id: number): void {
    this.actividadService.delete(id).subscribe({
      next: () => {
        this.actividades.update(list => list.filter(a => a.id !== id));
      },
      error: (err) => {
        console.error('[CocinaFacade] Error eliminando actividad:', err);
      },
    });
  }

  // ── Evaluaciones ─────────────────────────────────────────────────────────────

  /**
   * Carga los estados de evaluación persistidos en BD para una actividad
   * y los cruza con el mock de aprendices.
   * Esto garantiza que al recargar la página se vean los estados correctos.
   */
  cargarEstadosEvaluacion(actividadId: number): void {
    this.cargandoAprendices.set(true);
    // Siempre arrancamos desde el mock limpio
    this.aprendices.set([...APRENDICES_MOCK]);

    this.evaluacionService.getEvaluacionesPorActividad(actividadId).subscribe({
      next: (evaluaciones) => {
        if (evaluaciones.length > 0) {
          // Actualizar estado de cada aprendiz según lo que está en BD
          this.aprendices.update(lista =>
            lista.map(aprendiz => {
              const eval_ = evaluaciones.find(e => e.aprendizId === aprendiz.id);
              if (eval_) {
                return { ...aprendiz, estado: eval_.estado };
              }
              return aprendiz;
            })
          );
        }
        this.cargandoAprendices.set(false);
      },
      error: (err) => {
        // Si el backend falla, seguimos mostrando el mock sin estados
        console.warn('[CocinaFacade] No se pudieron cargar evaluaciones previas:', err);
        this.cargandoAprendices.set(false);
      },
    });
  }

  /**
   * Persiste la evaluación en el backend y actualiza el estado local del aprendiz.
   * Funciona para evaluación individual y masiva.
   */
  evaluarAprendices(actividadId: number, requests: EvaluacionRequestDTO[]): void {
    this.evaluacionService.evaluarAprendices(actividadId, requests).subscribe({
      next: () => {
        // Actualización optimista del estado local
        this.aprendices.update(lista =>
          lista.map(aprendiz => {
            const req = requests.find(r => r.aprendizId === aprendiz.id);
            if (req) {
              const nuevoEstado: 'Aprobó' | 'No Aprobó' =
                req.resultado === 'aprobo' ? 'Aprobó' : 'No Aprobó';
              return { ...aprendiz, estado: nuevoEstado };
            }
            return aprendiz;
          })
        );
        console.log('[CocinaFacade] Evaluación guardada en BD ✅');
      },
      error: (err) => {
        console.error('[CocinaFacade] Error al guardar evaluación:', err);
      },
    });
  }

  /**
   * Evaluación individual sin actividadId (actualización solo local).
   * Se usa como fallback cuando no hay contexto de actividad.
   */
  actualizarEstado(aprendizId: number, estado: 'Aprobó' | 'No Aprobó'): void {
    this.aprendices.update(lista =>
      lista.map(a => a.id === aprendizId ? { ...a, estado } : a)
    );
  }
}
