import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Consolidado, MOCK_CONSOLIDADOS } from '../../models/consolidado.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoService {

  getConsolidados(): Observable<Consolidado[]> {
    return of(MOCK_CONSOLIDADOS).pipe(delay(500));
  }

  getConsolidado(id: string): Observable<Consolidado | undefined> {
    const found = MOCK_CONSOLIDADOS.find(c => c.id === id);
    return of(found).pipe(delay(500));
  }

  generarConsolidado(gils: string[]): Observable<Consolidado> {
    const newId = `CON-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newConsolidado: Consolidado = {
      id:              newId,
      numero:          MOCK_CONSOLIDADOS.length + 1,
      fechaGeneracion: new Date().toISOString().split('T')[0],
      generadoPor:     'SISTEMA',
      estado:          'GENERADO',
      lineas:          [],
      totales:         { totalBienes: 0, totalServicios: 0, totalGeneral: 0 },
    };
    MOCK_CONSOLIDADOS.unshift(newConsolidado);
    return of(newConsolidado).pipe(delay(800));
  }

  reversarConsolidado(id: string): Observable<boolean> {
    const found = MOCK_CONSOLIDADOS.find(c => c.id === id);
    if (found) {
      found.estado = 'REVERSADO';
    }
    return of(true).pipe(delay(500));
  }
}
