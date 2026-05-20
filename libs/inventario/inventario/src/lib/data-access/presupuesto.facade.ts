import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PresupuestoService } from './services/presupuesto.service';
import {
  PresupuestoResumen,
  Programa,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual
} from '../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoFacade {
  private presupuestoService = inject(PresupuestoService);

  // Estados internos (Signals)
  private _resumen = signal<PresupuestoResumen | null>(null);
  private _programas = signal<Programa[]>([]);
  private _afectaciones = signal<AfectacionPresupuestal[]>([]);
  private _vencimientos = signal<VencimientoProximo[]>([]);
  private _ejecucionMensual = signal<EjecucionMensual[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public resumen = computed(() => this._resumen());
  public programas = computed(() => this._programas());
  public afectaciones = computed(() => this._afectaciones());
  public vencimientos = computed(() => this._vencimientos());
  public ejecucionMensual = computed(() => this._ejecucionMensual());
  public loading = computed(() => this._loading());
  public error = computed(() => this._error());

  /**
   * Carga inicial de datos para el dashboard.
   */
  loadAll(): void {
    this._loading.set(true);
    let loadedCount = 0;
    const totalRequests = 5;

    const checkLoading = () => {
      loadedCount++;
      if (loadedCount === totalRequests) {
        this._loading.set(false);
      }
    };

    this.presupuestoService.getResumen().subscribe(data => {
      this._resumen.set(data);
      checkLoading();
    });
    this.presupuestoService.getProgramas().subscribe(data => {
      this._programas.set(data);
      checkLoading();
    });
    this.presupuestoService.getAfectaciones().subscribe(data => {
      this._afectaciones.set(data);
      checkLoading();
    });
    this.presupuestoService.getVencimientos().subscribe(data => {
      this._vencimientos.set(data);
      checkLoading();
    });
    this.presupuestoService.getEjecucionMensual().subscribe(data => {
      this._ejecucionMensual.set(data);
      checkLoading();
    });
  }

  registrarPresupuesto(data: any): void {
    this._loading.set(true);
    this.presupuestoService.registrarPresupuesto(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar presupuesto');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.loadAll();
      });
  }

  trasladarRubro(data: any): void {
    this._loading.set(true);
    this.presupuestoService.trasladarRubro(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al trasladar rubro');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.loadAll();
      });
  }

  exportar(formato: string): void {
    this._loading.set(true);
    this.presupuestoService.exportar(formato)
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }
}
