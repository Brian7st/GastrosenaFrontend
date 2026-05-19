import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Consolidado, ConsolidadoMock } from '../../models/consolidado.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoService {
  
  getConsolidados(): Observable<Consolidado[]> {
    return of(ConsolidadoMock).pipe(delay(500));
  }

  getConsolidado(id: string): Observable<Consolidado | undefined> {
    const found = ConsolidadoMock.find(c => c.id === id);
    return of(found).pipe(delay(500));
  }

  generarConsolidado(gils: string[]): Observable<Consolidado> {
    const newId = `CON-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newConsolidado: Consolidado = {
      id: newId,
      mes: 'Mes Actual',
      tipo: 'Generado',
      total: '$0.00',
      estado: 'Borrador',
      variant: 'warning'
    };
    // Mute mock for local demo purposes
    ConsolidadoMock.unshift(newConsolidado);
    return of(newConsolidado).pipe(delay(800));
  }

  reversarConsolidado(id: string): Observable<boolean> {
    const found = ConsolidadoMock.find(c => c.id === id);
    if (found) {
      found.estado = 'Reversado';
      found.variant = 'danger';
    }
    return of(true).pipe(delay(500));
  }
}
