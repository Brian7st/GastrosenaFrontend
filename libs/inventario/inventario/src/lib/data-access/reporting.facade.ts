import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ConsumoItem, TrazabilidadDocumental } from '../models/reporting.model';
import { ReportingService } from './services/reporting.service';

@Injectable({ providedIn: 'root' })
export class ReportingFacade {
  private reportingService = inject(ReportingService);

  // ── Estado interno ────────────────────────────────────────────────────────
  private _consumo        = signal<ConsumoItem[]>([]);
  private _trazabilidad   = signal<TrazabilidadDocumental[]>([]);
  private _loading        = signal<boolean>(false);
  private _error          = signal<string | null>(null);

  // ── Exposición pública ────────────────────────────────────────────────────
  public consumo       = computed(() => this._consumo());
  public trazabilidad  = computed(() => this._trazabilidad());
  public loading       = computed(() => this._loading());
  public error         = computed(() => this._error());

  /**
   * GET /reporting/consumo?fichaId?&instructorId?&desde?&hasta?
   * Carga el reporte de consumo por instructor.
   */
  cargarConsumo(params?: {
    fichaId?:      string;
    instructorId?: string;
    desde?:        string;
    hasta?:        string;
  }): void {
    this._loading.set(true);
    this._error.set(null);
    this.reportingService.getConsumo(params)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el reporte de consumo');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._consumo.set(data));
  }

  /**
   * GET /reporting/trazabilidad?fichaId?&desde?&hasta?
   * Carga el reporte de trazabilidad documental.
   */
  cargarTrazabilidad(params?: {
    fichaId?: string;
    desde?:   string;
    hasta?:   string;
  }): void {
    this._loading.set(true);
    this._error.set(null);
    this.reportingService.getTrazabilidad(params)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la trazabilidad documental');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._trazabilidad.set(data));
  }
}
