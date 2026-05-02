import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Bien, BienFiltros, BienKpis, BienFormDto } from '../../models/inventario.model';
import { BIENES_MOCK, BIENES_KPIS_MOCK } from '../../models/inventario.mock';

@Injectable({
  providedIn: 'root'
})
export class BienesService {
  // En una implementación real, aquí inyectaríamos HttpClient
  // private http = inject(HttpClient);
  // private apiUrl = 'api/bienes';

  /**
   * Obtiene la lista de bienes filtrada.
   */
  getBienes(filtros?: BienFiltros): Observable<Bien[]> {
    let result = [...BIENES_MOCK];

    if (filtros) {
      if (filtros.busqueda) {
        const query = filtros.busqueda.toLowerCase();
        result = result.filter(b => 
          b.nombre.toLowerCase().includes(query) || 
          b.codigoSena.toLowerCase().includes(query) ||
          b.codigoProveedor.toLowerCase().includes(query)
        );
      }
      if (filtros.categoria) {
        result = result.filter(b => b.categoria === filtros.categoria);
      }
      if (filtros.estado) {
        result = result.filter(b => b.estado === filtros.estado);
      }
    }

    return of(result).pipe(delay(500)); // Simulamos latencia
  }

  /**
   * Obtiene los indicadores clave (KPIs) del inventario.
   */
  getKpis(): Observable<BienKpis> {
    return of(BIENES_KPIS_MOCK).pipe(delay(300));
  }

  /**
   * Obtiene un bien por su ID.
   */
  getBienById(id: string | number): Observable<Bien | undefined> {
    const bien = BIENES_MOCK.find(b => b.id.toString() === id.toString());
    return of(bien).pipe(delay(300));
  }

  /**
   * Crea un nuevo bien.
   */
  createBien(bien: Partial<Bien>): Observable<Bien> {
    const nuevoBien = {
      ...bien,
      id: Math.floor(Math.random() * 1000), // ID temporal
      estado: 'Activo',
      tieneHistorial: false
    } as Bien;
    
    // Aquí iría el POST al API
    return of(nuevoBien).pipe(delay(800));
  }

  /**
   * Actualiza un bien existente.
   */
  updateBien(id: string | number, data: Partial<Bien>): Observable<Bien> {
    const bienOriginal = BIENES_MOCK.find(b => b.id.toString() === id.toString());
    const actualizado = { ...bienOriginal, ...data } as Bien;
    return of(actualizado).pipe(delay(800));
  }

  /**
   * Elimina un bien.
   */
  deleteBien(id: string | number): Observable<void> {
    // Aquí iría el DELETE al API
    return of(undefined).pipe(delay(800));
  }
}
