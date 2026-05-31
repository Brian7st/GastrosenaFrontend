import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import {
  GenerarReporteRequest,
  GenerarReporteResponse,
  ReporteReciente,
  ReportesFilter,
} from '../models/reportes.model';

@Injectable({ providedIn: 'root' })
export class ReportesService extends BaseHttpService {
  private readonly resource = 'reportes';

  getReportesRecientes(filtros?: ReportesFilter): Observable<ReporteReciente[]> {
    let params = new HttpParams();
    if (filtros?.tipo)        params = params.set('tipo',        filtros.tipo);
    if (filtros?.periodicidad) params = params.set('periodicidad', filtros.periodicidad);
    if (filtros?.pagina !== undefined) params = params.set('pagina', String(filtros.pagina));
    if (filtros?.tamano !== undefined) params = params.set('tamano', String(filtros.tamano));

    return this.http.get<ReporteReciente[]>(
      this.buildUrl(`${this.resource}/recientes`), { params }
    );
  }

  generarReporte(request: GenerarReporteRequest): Observable<GenerarReporteResponse> {
    return this.http.post<GenerarReporteResponse>(
      this.buildUrl(`${this.resource}/generar`), request
    );
  }

  descargarPdf(reporteId: string): Observable<Blob> {
    return this.http.get(
      this.buildUrl(`${this.resource}/${reporteId}/pdf`),
      { responseType: 'blob' }
    );
  }

  descargarReporte(reporteId: string): Observable<Blob> {
    return this.http.get(
      this.buildUrl(`${this.resource}/${reporteId}/descargar`),
      { responseType: 'blob' }
    );
  }
}