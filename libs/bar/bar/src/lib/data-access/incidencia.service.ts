import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuditoriaIncidencia } from '../models/incidencia.model';

// DTOs tal como los devuelve el backend
interface CancelacionResponseDTO {
  idHistorialCancelacion: string;
  idDetalleComanda: string;
  nombreReceta: string;
  motivoCancelacion: string;
  fechaCancelacion: string;
  estado: string;
}

interface DevolucionResponseDTO {
  idDevolucion: string;
  nombreBebida: string;
  motivo: string;
  fechaDevolucion: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);

  // Endpoints reales del backend de bar y barismo
  private urlCancelaciones = '/api/barybarismo/pedidos/cancelados';
  private urlDevoluciones  = '/api/barybarismo/devoluciones';

  obtenerPorTipo(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'): Observable<AuditoriaIncidencia[]> {
    if (tipo === 'CANCELACION') {
      return this.http.get<CancelacionResponseDTO[]>(this.urlCancelaciones).pipe(
        map(items => items.map(c => ({
          idAuditoria: c.idHistorialCancelacion ?? '',
          comanda: { idComanda: c.idDetalleComanda ?? '' },
          fechaRegistro: c.fechaCancelacion ?? '',
          tipoIncidencia: 'CANCELACION' as const,
          motivo: c.motivoCancelacion ?? '',
          detalleModificado: c.nombreReceta
        })))
      );
    }

    if (tipo === 'DEVOLUCION') {
      return this.http.get<DevolucionResponseDTO[]>(this.urlDevoluciones).pipe(
        map(items => items.map(d => ({
          idAuditoria: d.idDevolucion ?? '',
          comanda: { idComanda: '' },
          fechaRegistro: d.fechaDevolucion ?? '',
          tipoIncidencia: 'DEVOLUCION' as const,
          motivo: d.motivo ?? '',
          detalleModificado: d.nombreBebida
        })))
      );
    }

    // MODIFICACION: no hay endpoint aún en el backend, retorna vacío
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }
}
