import { inject, Injectable, signal, computed } from '@angular/core';
import { AlertasService } from './services/alertas.service';
import { Alerta, UmbralConfig } from '../models/alerta.model';
import { ResumenAlertas } from '../models/reporting.model';
import { finalize, catchError, of, firstValueFrom, forkJoin } from 'rxjs';

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

  /** Exporta el historial de alertas en formato CSV. */
  exportarHistorialCSV(): void {
    this._loading.set(true);
    this.alertasService.exportarHistorialCSV()
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar el historial');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
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
