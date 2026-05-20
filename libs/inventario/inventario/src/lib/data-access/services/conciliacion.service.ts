import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface ConciliacionRegistro {
  id: string;
  fecha: string;
  ubicacion: string;
  itemsTotal: number;
  itemsDif: number;
  precision: number;
  estado: string;
  estadoColor: 'success' | 'info' | 'warning' | 'error';
}

export interface ConciliacionDetalle {
  id: string;
  fecha: string;
  responsable: string;
  almacen: string;
  estado: string;
  totalItems: number;
  itemsCorrectos: number;
  diferencias: number;
  precision: number;
  valoracionMonetaria: number;
  perdidas: number;
  sobrantes: number;
}

// ─────────────── MOCK DATA ───────────────
const CONCILIACIONES_MOCK: ConciliacionRegistro[] = [
  {
    id: 'CONC-001',
    fecha: '12 Oct, 08:30',
    ubicacion: 'Cocina Principal',
    itemsTotal: 145,
    itemsDif: 12,
    precision: 92,
    estado: 'Completada',
    estadoColor: 'success',
  },
  {
    id: 'CONC-002',
    fecha: '11 Oct, 14:15',
    ubicacion: 'Bodega Refrigerados',
    itemsTotal: 89,
    itemsDif: 3,
    precision: 97,
    estado: 'En Proceso',
    estadoColor: 'info',
  },
  {
    id: 'CONC-003',
    fecha: '10 Oct, 09:00',
    ubicacion: 'Almacén Seco',
    itemsTotal: 320,
    itemsDif: 45,
    precision: 86,
    estado: 'Pendiente Ajustes',
    estadoColor: 'warning',
  },
];

const CONCILIACION_DETALLE_MOCK: ConciliacionDetalle = {
  id: 'CONC-2024-012',
  fecha: '24 Oct 2024',
  responsable: 'Carlos Ruiz',
  almacen: 'Almacén Seco',
  estado: 'Completada',
  totalItems: 120,
  itemsCorrectos: 112,
  diferencias: 8,
  precision: 93.3,
  valoracionMonetaria: -340000,
  perdidas: -320000,
  sobrantes: 20000,
};

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService {
  /**
   * Obtiene el listado de todas las conciliaciones.
   */
  getConciliaciones(): Observable<ConciliacionRegistro[]> {
    return of([...CONCILIACIONES_MOCK]).pipe(delay(400));
  }

  /**
   * Obtiene el detalle de una conciliación por su ID.
   */
  getConciliacionById(id: string): Observable<ConciliacionDetalle | undefined> {
    // En implementación real: return this.http.get<ConciliacionDetalle>(`/api/conciliaciones/${id}`)
    const detalle =
      id === CONCILIACION_DETALLE_MOCK.id ? CONCILIACION_DETALLE_MOCK : undefined;
    return of(detalle).pipe(delay(300));
  }

  /**
   * Inicia una nueva toma física (crea la sesión en el servidor).
   */
  iniciarTomaFisica(): Observable<{ sesionId: string }> {
    return of({ sesionId: `TF-${Date.now()}` }).pipe(delay(500));
  }

  /**
   * Cierra y finaliza una conciliación existente.
   */
  cerrarConciliacion(id: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }
}
