import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PaqueteProbatorio, MOCK_PAQUETES } from '../../models/paquete.model';

@Injectable({ providedIn: 'root' })
export class PaqueteService {

  getPaquetes(): Observable<PaqueteProbatorio[]> {
    return of([...MOCK_PAQUETES]).pipe(delay(300));
  }

  getPaqueteById(id: string): Observable<PaqueteProbatorio | undefined> {
    return of(MOCK_PAQUETES.find(p => p.id === id)).pipe(delay(200));
  }

  crearPaquete(data: Partial<PaqueteProbatorio>): Observable<PaqueteProbatorio> {
    const nuevo = { ...data, id: String(Date.now()) } as PaqueteProbatorio;
    return of(nuevo).pipe(delay(800));
  }

  adjuntarDocumento(paqueteId: string, file: File): Observable<boolean> {
    console.log(`[PaqueteService] Adjuntando ${file.name} a paquete ${paqueteId}`);
    return of(true).pipe(delay(600));
  }

  incluirRequisicion(paqueteId: string, reqId: string): Observable<boolean> {
    console.log(`[PaqueteService] Incluyendo req ${reqId} en paquete ${paqueteId}`);
    return of(true).pipe(delay(400));
  }
}
