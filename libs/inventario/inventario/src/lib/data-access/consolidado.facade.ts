import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ConsolidadoService } from './services/consolidado.service';
import { ConciliacionService } from './services/conciliacion.service';
import { Consolidado, GenerarConsolidadoData, ElegibleConsolidado } from '../models/consolidado.model';
import { EjecucionPresupuestal } from '../models/reporting.model';
import { descargarBlob } from '../util';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoFacade {
  private consolidadoService = inject(ConsolidadoService);
  private conciliacionService = inject(ConciliacionService);

  private _consolidados            = signal<Consolidado[]>([]);
  private _consolidadoSeleccionado = signal<Consolidado | null>(null);
  private _ejecucionPresupuestal   = signal<EjecucionPresupuestal[]>([]);
  private _elegibles               = signal<ElegibleConsolidado[]>([]);
  private _loading                 = signal<boolean>(false);
  private _error                   = signal<string | null>(null);

  consolidados            = computed(() => this._consolidados());
  consolidadoSeleccionado = computed(() => this._consolidadoSeleccionado());
  ejecucionPresupuestal   = computed(() => this._ejecucionPresupuestal());
  elegibles               = computed(() => this._elegibles());
  loading                 = computed(() => this._loading());
  error                   = computed(() => this._error());

  loadAll(): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidados()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los consolidados');
          return of([]);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._consolidados.set(data));
  }

  /**
   * Exporta el reporte contable vía ga-ms-reportes (GET /api/reportes/conciliacion).
   * El backend exige un rango de fechas; por defecto se toma el MES ACTUAL
   * (del día 1 a hoy). Si se necesita otro rango, agregar un selector al modal.
   */
  exportarReporte(formato: string): void {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const ext = formato.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx';
    this._loading.set(true);
    this.conciliacionService.exportarConciliacion(iso(inicio), iso(hoy), formato)
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar el reporte del consolidado');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(blob => { if (blob) descargarBlob(blob, `consolidado_${iso(hoy)}.${ext}`); });
  }

  /**
   * Carga un consolidado por su NÚMERO (no UUID).
   * La ruta del backend es GET /budget/consolidados/{numero}.
   */
  cargarConsolidadoPorNumero(numero: number): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidadoPorNumero(numero)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle del consolidado');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._consolidadoSeleccionado.set(data));
  }

  /**
   * Genera un consolidado con el payload real (lineas + generadoPor).
   *
   * TODO: El backend no expone un endpoint "GILs elegibles" con los campos
   * completos (facturaId/cufe/numeroFactura). Esta operación requiere que el
   * llamador construya las lineas con todos los campos necesarios.
   */
  generarConsolidado(data: GenerarConsolidadoData): void {
    this._loading.set(true);
    this.consolidadoService.generarConsolidado(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al generar el consolidado');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(res => {
        if (res) this.loadAll();
      });
  }

  /**
   * PATCH /budget/consolidados/{numero}/reversar → 204.
   * Accepts the NUMERO (number), not the UUID id.
   */
  reversarConsolidado(numero: number): void {
    this._loading.set(true);
    this._error.set(null);
    this.consolidadoService.reversarConsolidado(numero)
      .pipe(
        catchError(() => {
          this._error.set('Error al reversar el consolidado');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(() => this.loadAll());
  }

  /** GET /budget/consolidados/elegibles */
  cargarElegibles(): void {
    this._loading.set(true);
    this.consolidadoService.getElegibles()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los compromisos elegibles');
          return of([]);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._elegibles.set(data));
  }

  /** GET /reporting/ejecucion-presupuestal */
  cargarEjecucionPresupuestal(params?: { fichaId?: string; vigencia?: number }): void {
    this._loading.set(true);
    this._error.set(null);
    this.consolidadoService.getEjecucionPresupuestal(params)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la ejecución presupuestal');
          return of([]);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._ejecucionPresupuestal.set(data));
  }
}
