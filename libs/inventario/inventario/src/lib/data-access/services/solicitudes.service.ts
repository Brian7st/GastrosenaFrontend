import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { SolicitudGil, SolicitudesGilFiltros, EstadoGil, CrearSolicitudData, ActualizarSolicitudData } from '../../models/solicitudes-gil.model';
import { SOLICITUDES_GIL_MOCK } from '../../models/solicitudes-gil.mock';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  getSolicitudes(filtros?: SolicitudesGilFiltros): Observable<SolicitudGil[]> {
    let result = [...SOLICITUDES_GIL_MOCK];

    if (filtros) {
      if (filtros.busqueda) {
        const query = filtros.busqueda.toLowerCase();
        result = result.filter(s => 
          s.codigo.toLowerCase().includes(query) || 
          s.cuentadante.toLowerCase().includes(query) ||
          s.destino.toLowerCase().includes(query)
        );
      }
      if (filtros.estado) {
        result = result.filter(s => s.estado === filtros.estado);
      }
      if (filtros.instructor) {
        const instr = filtros.instructor.toLowerCase();
        result = result.filter(s => s.cuentadante.toLowerCase().includes(instr));
      }
    }

    return of(result).pipe(delay(500));
  }

  getSolicitudById(id: string | number): Observable<SolicitudGil | undefined> {
    const solicitud = SOLICITUDES_GIL_MOCK.find(s => s.codigo === id || s.id.toString() === id.toString());
    return of(solicitud).pipe(delay(300));
  }

  deleteSolicitud(codigo: string): Observable<boolean> {
    // Simulated delete
    return of(true).pipe(delay(800));
  }

  crearSolicitud(_data: CrearSolicitudData): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(600));
  }

  actualizarSolicitud(_id: string, _data: ActualizarSolicitudData): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(600));
  }

  cambiarEstado(_id: string, _estado: EstadoGil): Observable<boolean> {
    return of(true).pipe(delay(400));
  }

  generarGils(ids: (string | number)[]): Observable<boolean> {
    return of(true).pipe(delay(500));
  }
}
