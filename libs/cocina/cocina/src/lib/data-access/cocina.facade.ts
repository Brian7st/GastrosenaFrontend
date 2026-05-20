import { Injectable, signal } from '@angular/core';

export interface AprendizMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  ficha: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
  estado: 'Pendiente' | 'Aprobó' | 'No Aprobó';
  inactivo?: boolean;
}

export interface ActividadMock {
  id: number;
  nombre: string;
  fecha: string;
  jornada: string;
  ficha: string;
  trimestre: string;
  estado: 'Activa' | 'Finalizada' | 'Pendiente';
}

const APRENDICES_MOCK: AprendizMock[] = [
  { id: 1, nombreCompleto: 'Camila Rodriguez Torres',  inicial: 'C', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 2, nombreCompleto: 'Andrés Felipe Mora',       inicial: 'A', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 3, nombreCompleto: 'Laura Valentina Gómez',    inicial: 'L', ficha: '2489012', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 4, nombreCompleto: 'María Fernanda Castro',    inicial: 'M', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 5, nombreCompleto: 'Valeria Ospina Herrera',   inicial: 'V', ficha: '2632456', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 6, nombreCompleto: 'Juan Pérez Inactivo',      inicial: 'J', ficha: '0000000', jornada: 'Diurna',   estado: 'Pendiente', inactivo: true },
  { id: 7, nombreCompleto: 'Ana López Inactiva',       inicial: 'A', ficha: '0000000', jornada: 'Nocturna', estado: 'Pendiente', inactivo: true }
];

const ACTIVIDADES_MOCK: ActividadMock[] = [
  { id: 1, nombre: 'Fundamentos de Cocina',       fecha: '2026-05-10', jornada: 'Diurna',   ficha: '2561234', trimestre: 'Trimestre 1', estado: 'Activa' },
  { id: 2, nombre: 'Técnicas de Corte',           fecha: '2026-05-08', jornada: 'Mixta',     ficha: '2489012', trimestre: 'Trimestre 1', estado: 'Activa' },
  { id: 3, nombre: 'Preparación de Salsas',       fecha: '2026-05-05', jornada: 'Diurna',    ficha: '2561234', trimestre: 'Trimestre 2', estado: 'Pendiente' },
  { id: 4, nombre: 'Repostería Básica',           fecha: '2026-04-28', jornada: 'Nocturna',  ficha: '2632456', trimestre: 'Trimestre 1', estado: 'Finalizada' },
  { id: 5, nombre: 'Higiene y Manipulación',      fecha: '2026-04-20', jornada: 'Diurna',    ficha: '2561234', trimestre: 'Trimestre 2', estado: 'Finalizada' },
];

@Injectable({ providedIn: 'root' })
export class CocinaFacade {
  readonly aprendices = signal<AprendizMock[]>(APRENDICES_MOCK);
  readonly actividades = signal<ActividadMock[]>(ACTIVIDADES_MOCK);

  actualizarEstado(id: number, estado: 'Aprobó' | 'No Aprobó'): void {
    this.aprendices.update(aprendices => 
      aprendices.map(a => a.id === id ? { ...a, estado } : a)
    );
  }

  crearActividad(data: Omit<ActividadMock, 'id' | 'estado'>): void {
    const nextId = Math.max(...this.actividades().map(a => a.id), 0) + 1;
    const nueva: ActividadMock = { ...data, id: nextId, estado: 'Pendiente' };
    this.actividades.update(list => [nueva, ...list]);
  }

  actualizarEstadoActividad(id: number, estado: 'Activa' | 'Finalizada' | 'Pendiente'): void {
    this.actividades.update(list =>
      list.map(a => a.id === id ? { ...a, estado } : a)
    );
  }

  eliminarActividad(id: number): void {
    this.actividades.update(list => list.filter(a => a.id !== id));
  }
}
