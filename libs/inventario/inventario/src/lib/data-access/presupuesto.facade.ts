import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PresupuestoService } from './services/presupuesto.service';
import {
  PresupuestoResumen,
  Rubro,
  GrupoPresupuestal,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  RegistrarPresupuestoData,
  TrasladarRubroData,
} from '../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoFacade {
  private presupuestoService = inject(PresupuestoService);

  // Estados internos (Signals)
  private _resumen          = signal<PresupuestoResumen | null>(null);
  private _rubros           = signal<Rubro[]>([]);
  private _afectaciones     = signal<AfectacionPresupuestal[]>([]);
  private _vencimientos     = signal<VencimientoProximo[]>([]);
  private _ejecucionMensual = signal<EjecucionMensual[]>([]);
  private _loading          = signal<boolean>(false);
  private _error            = signal<string | null>(null);

  // Exposición pública (solo lectura)
  public resumen          = computed(() => this._resumen());
  public rubros           = computed(() => this._rubros());
  public afectaciones     = computed(() => this._afectaciones());
  public vencimientos     = computed(() => this._vencimientos());
  public ejecucionMensual = computed(() => this._ejecucionMensual());
  public loading          = computed(() => this._loading());
  public error            = computed(() => this._error());

  /** Vista agrupada de rubros por ficha — derivada en cliente */
  public grupos = computed<GrupoPresupuestal[]>(() => {
    const map = new Map<string, GrupoPresupuestal>();

    for (const r of this._rubros()) {
      if (!map.has(r.fichaId)) {
        map.set(r.fichaId, {
          fichaId:               r.fichaId,
          programaFormacion:     r.programaFormacion,
          rubros:                [],
          totalMontoAsignado:    0,
          totalSaldoDisponible:  0,
          totalMontoComprometido: 0,
          totalMontoPagado:      0,
          totalZese:             0,
          porcentajeEjecucion:   0,
        });
      }
      const g = map.get(r.fichaId)!;
      g.rubros.push(r);
      g.totalMontoAsignado    += r.montoAsignado;
      g.totalSaldoDisponible  += r.saldoDisponible;
      g.totalMontoComprometido += r.montoComprometido;
      g.totalMontoPagado      += r.montoPagado;
      g.totalZese             += r.retencionZese;
    }

    for (const g of map.values()) {
      g.porcentajeEjecucion = g.totalMontoAsignado > 0
        ? parseFloat(((g.totalMontoComprometido / g.totalMontoAsignado) * 100).toFixed(1))
        : 0;
    }

    return Array.from(map.values());
  });

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
    this.presupuestoService.getRubros().subscribe(data => {
      this._rubros.set(data);
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

  registrarPresupuesto(data: RegistrarPresupuestoData): void {
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

  trasladarRubro(data: TrasladarRubroData): void {
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
