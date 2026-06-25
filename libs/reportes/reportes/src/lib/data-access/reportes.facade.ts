import { Injectable, inject, signal, computed } from '@angular/core';
import { ReportesService } from './reportes.service';
import {
  ReporteReciente,
  ReportesFilter,
  GenerarReporteRequest,
  GenerarReporteResponse,
} from '../models/reportes.model';

@Injectable({ providedIn: 'root' })
export class ReportesFacade {
  private readonly service = inject(ReportesService);

  // ── Estado ────────────────────────────────────────────────────────────────
  readonly reportesRecientes = signal<ReporteReciente[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly generando = signal(false);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly tieneReportesRecientes = computed(() => this.reportesRecientes().length > 0);

  // ── Métodos ───────────────────────────────────────────────────────────────
  cargarReportesRecientes(filtros?: ReportesFilter): void {
    this.cargando.set(true);
    this.error.set(null);

    this.service.getReportesRecientes(filtros).subscribe({
      next: (data) => {
        this.reportesRecientes.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando reportes recientes:', err);
        this.error.set('Error al cargar los reportes recientes');
        this.cargando.set(false);
      },
    });
  }

  generarReporte(request: GenerarReporteRequest): void {
    this.generando.set(true);
    this.error.set(null);

    this.service.generarReporte(request).subscribe({
      next: (response: GenerarReporteResponse) => {
        this.reportesRecientes.update(list => [
          {
            id: Date.now(),
            reporteId: response.id,
            formato: 'PDF',
            fechaGeneracion: new Date().toISOString(),
          },
          ...list.slice(0, 9),
        ]);
        this.generando.set(false);
      },
      error: (err) => {
        console.error('Error generando reporte:', err);
        this.error.set('Error al generar el reporte');
        this.generando.set(false);
      },
    });
  }

  descargarPdf(reporteId: string): void {
    this.service.descargarPdf(reporteId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${reporteId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando PDF:', err);
        this.error.set('Error al descargar el PDF');
      },
    });
  }

  descargarReporte(reporteId: string): void {
    this.service.descargarReporte(reporteId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${reporteId}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando reporte:', err);
        this.error.set('Error al descargar el reporte');
      },
    });
  }

  limpiarError(): void {
    this.error.set(null);
  }
}