import { inject, Injectable, signal, computed } from '@angular/core';
import { AlertasService } from './services/alertas.service';
import { Alerta, UmbralConfig } from '../models/alerta.model';
import { ResumenAlertas } from '../models/reporting.model';
import { finalize, catchError, of, firstValueFrom, forkJoin } from 'rxjs';
import { descargarBlob } from '../util';

@Injectable({
  providedIn: 'root'
})
export class AlertasFacade {
  private alertasService = inject(AlertasService);

  // ── Estado interno ────────────────────────────────────────────────────────
  private _alertas              = signal<Alerta[]>([]);
  private _alertaSeleccionada   = signal<Alerta | undefined>(undefined);
  private _resumenAlertas       = signal<ResumenAlertas | null>(null);
  private _umbrales             = signal<UmbralConfig[]>([]);
  private _loading              = signal<boolean>(false);
  private _error                = signal<string | null>(null);

  // ── Exposición pública ────────────────────────────────────────────────────
  public alertas            = computed(() => this._alertas());
  public alertaSeleccionada = computed(() => this._alertaSeleccionada());
  public resumenAlertas     = computed(() => this._resumenAlertas());
  public umbrales           = computed(() => this._umbrales());
  public loading            = computed(() => this._loading());
  public error              = computed(() => this._error());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this._loading.set(true);
    this.alertasService.getAlertas()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de alertas');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._alertas.set(data));
  }

  /**
   * Carga una alerta específica por su ID.
   */
  async cargarAlerta(id: string): Promise<Alerta | undefined> {
    this._loading.set(true);
    try {
      const data = await firstValueFrom(this.alertasService.getAlertaById(id));
      this._alertaSeleccionada.set(data);
      return data;
    } catch {
      this._error.set('Error al cargar el detalle de la alerta');
      return undefined;
    } finally {
      this._loading.set(false);
    }
  }

  /** GET /reporting/alertas/resumen — carga el resumen real de alertas (conteos + por tipo). */
  cargarResumen(destinatarioId?: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.alertasService.getResumenAlertas(destinatarioId)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el resumen de alertas');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => { if (data) this._resumenAlertas.set(data); });
  }

  /** Carga la configuración de umbrales. */
  cargarUmbrales(): void {
    this._loading.set(true);
    this.alertasService.getUmbrales()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los umbrales');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._umbrales.set(data));
  }

  /**
   * Guarda los umbrales de configuración.
   * Llama PUT /alerts/alertas/umbrales/{productoId} por cada umbral modificado.
   */
  guardarUmbrales(nuevosUmbrales: UmbralConfig[]): void {
    if (!nuevosUmbrales.length) return;
    this._loading.set(true);
    const requests$ = nuevosUmbrales.map(u =>
      this.alertasService.updateUmbral(u.id, u.stockMinimo)
    );
    forkJoin(requests$)
      .pipe(
        catchError(() => {
          this._error.set('Error al guardar umbrales');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res.length) this._umbrales.set(nuevosUmbrales);
      });
  }

  /**
   * Exporta el historial de alertas a CSV. Se genera en el cliente a partir de
   * la lista ya cargada (no hay endpoint en reportes para alertas), siguiendo el
   * mismo patrón que la exportación CSV de bienes.
   */
  exportarHistorialCSV(): void {
    const alertas = this._alertas();
    if (alertas.length === 0) {
      this._error.set('No hay alertas para exportar');
      return;
    }
    const headers = [
      'ID', 'Tipo', 'Prioridad', 'Descripción', 'Estado', 'Fecha generación',
      'Código SENA', 'Bien', 'Stock actual', 'Stock mínimo', 'Unidad',
    ];
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const filas = alertas.map(a => [
      a.id, a.tipo, a.prioridad, a.descripcion, a.estado, a.fechaGeneracion,
      a.codigoSena ?? '', a.nombreBien ?? '', a.stockActual ?? '', a.stockMinimo ?? '', a.unidad ?? '',
    ].map(escape).join(','));
    const csv = [headers.map(escape).join(','), ...filas].join('\n');
    // BOM (﻿) para que Excel respete acentos/UTF-8.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    descargarBlob(blob, `historial_alertas_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  /** Resuelve una alerta con datos tipados. */
  resolverAlerta(id: string, data: Record<string, unknown>): void {
    this._loading.set(true);
    this.alertasService.resolverAlerta(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al resolver la alerta');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this.loadAll();
          if (this._alertaSeleccionada()?.id === id) {
            this.cargarAlerta(id);
          }
        }
      });
  }
}
