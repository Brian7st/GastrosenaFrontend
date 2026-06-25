import { Injectable, signal, inject } from '@angular/core';
import { ActividadService, ActividadDTO, FichaService, FichaDTO } from './actividad.service';
import { EvaluacionService } from './evaluacion.service';

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
export type { FichaDTO };

const APRENDICES_MOCK: AprendizMock[] = [
  { id: 1, nombreCompleto: 'Camila Rodriguez Torres',  inicial: 'C', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 2, nombreCompleto: 'Andrés Felipe Mora',       inicial: 'A', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 3, nombreCompleto: 'Laura Valentina Gómez',    inicial: 'L', ficha: '2489012', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 4, nombreCompleto: 'María Fernanda Castro',    inicial: 'M', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 5, nombreCompleto: 'Valeria Ospina Herrera',   inicial: 'V', ficha: '2632456', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 6, nombreCompleto: 'Juan Pérez Inactivo',      inicial: 'J', ficha: '0000000', jornada: 'Diurna',   estado: 'Pendiente', inactivo: true },
  { id: 7, nombreCompleto: 'Ana López Inactiva',       inicial: 'A', ficha: '0000000', jornada: 'Nocturna', estado: 'Pendiente', inactivo: true }
];

@Injectable({ providedIn: 'root' })
export class CocinaFacade {
  private actividadService = inject(ActividadService);
  private fichaService     = inject(FichaService);
  private evaluacionService = inject(EvaluacionService);

  readonly aprendices = signal<AprendizMock[]>(APRENDICES_MOCK);
  readonly actividades = signal<ActividadMock[]>([]);
  readonly fichas      = signal<FichaDTO[]>([]);
  readonly fichasCargando = signal<boolean>(false);

  constructor() {
    this.cargarActividades();
    this.cargarFichas();
  }

  cargarActividades(): void {
    this.actividadService.getAll().subscribe({
      next: (data) => this.actividades.set(data || []),
      error: (err) => console.error('Error cargando actividades:', err)
    });
  }

  cargarFichas(): void {
    this.fichasCargando.set(true);
    this.fichaService.getAll().subscribe({
      next: (data) => {
        this.fichas.set(data || []);
        this.fichasCargando.set(false);
      },
      error: (err) => {
        console.warn('No se pudieron cargar fichas desde el microservicio de usuarios:', err);
        this.fichasCargando.set(false);
      }
    });
  }

  actualizarEstado(id: number, estado: 'Aprobó' | 'No Aprobó'): void {
    this.aprendices.update(aprendices =>
      aprendices.map(a => a.id === id ? { ...a, estado } : a)
    );
  }

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
