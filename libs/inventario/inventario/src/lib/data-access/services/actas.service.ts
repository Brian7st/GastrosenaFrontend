import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ActaLegalizacion,
  InsumoActa,
  CompromisoActa,
  FirmanteActa,
  MOCK_ACTAS,
  MOCK_INSUMOS,
  MOCK_COMPROMISOS,
  MOCK_FIRMANTES,
} from '../../models/acta.model';

@Injectable({ providedIn: 'root' })
export class ActasService {

  getActas(): Observable<ActaLegalizacion[]> {
    return of([...MOCK_ACTAS]).pipe(delay(300));
  }

  getActaById(id: string): Observable<ActaLegalizacion | undefined> {
    return of(MOCK_ACTAS.find(a => a.id === id)).pipe(delay(200));
  }

  getInsumosByActa(_id: string): Observable<InsumoActa[]> {
    return of([...MOCK_INSUMOS]).pipe(delay(200));
  }

  getCompromisosByActa(_id: string): Observable<CompromisoActa[]> {
    return of([...MOCK_COMPROMISOS]).pipe(delay(200));
  }

  getFirmantesByActa(_id: string): Observable<FirmanteActa[]> {
    return of([...MOCK_FIRMANTES]).pipe(delay(200));
  }

  crearActa(data: Partial<ActaLegalizacion>): Observable<ActaLegalizacion> {
    const nueva = { ...data, id: String(Date.now()) } as ActaLegalizacion;
    return of(nueva).pipe(delay(800));
  }

  cambiarEstado(id: string, estado: ActaLegalizacion['estado']): Observable<boolean> {
    console.log(`[ActasService] Cambiar estado acta ${id} → ${estado}`);
    return of(true).pipe(delay(400));
  }
}
