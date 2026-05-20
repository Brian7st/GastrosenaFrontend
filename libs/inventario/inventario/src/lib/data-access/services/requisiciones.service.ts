import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Requisicion, MOCK_REQUISICIONES } from '../../models/requisicion.model';

@Injectable({ providedIn: 'root' })
export class RequisicionesService {

  getRequisiciones(): Observable<Requisicion[]> {
    return of([...MOCK_REQUISICIONES]).pipe(delay(300));
  }

  getRequisicionById(id: string): Observable<Requisicion | undefined> {
    return of(MOCK_REQUISICIONES.find(r => r.id === id)).pipe(delay(200));
  }

  crearRequisicion(data: Partial<Requisicion>): Observable<Requisicion> {
    const nueva = { ...data, id: String(Date.now()) } as Requisicion;
    return of(nueva).pipe(delay(800));
  }

  cambiarEstado(id: string, estado: Requisicion['estado']): Observable<boolean> {
    console.log(`[RequisicionesService] Cambiar estado req ${id} → ${estado}`);
    return of(true).pipe(delay(400));
  }

  eliminarRequisicion(id: string): Observable<boolean> {
    console.log(`[RequisicionesService] Eliminando req ${id}`);
    return of(true).pipe(delay(400));
  }
}
