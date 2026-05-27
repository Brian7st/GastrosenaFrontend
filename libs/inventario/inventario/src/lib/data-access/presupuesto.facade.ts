import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PresupuestoService } from './services/presupuesto.service';
import {
  PresupuestoResumen,
  PresupuestoDetalle,
  Rubro,
  GrupoPresupuestal,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  RegistrarPresupuestoData,
  TrasladarRubroData,
  Compromiso,
  ComprometerData,
  PagoData,
} from '../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoFacade {
  private presupuestoService = inject(PresupuestoService);

  // Estados internos (Signals)
  private _resumen               = signal<PresupuestoResumen | null>(null);
  private _rubros                = signal<Rubro[]>([]);
  private _compromisos           = signal<Compromiso[]>([]);
  private _afectaciones          = signal<AfectacionPresupuestal[]>([]);
  private _vencimientos          = signal<VencimientoProximo[]>([]);
  private _ejecucionMensual      = signal<EjecucionMensual[]>([]);
  private _presupuestoSeleccionado = signal<PresupuestoDetalle | undefined>(undefined);
  private _loading               = signal<boolean>(false);
  private _error                 = signal<string | null>(null);

  // Exposición pública (solo lectura)
  public resumen                = computed(() => this._resumen());
  public rubros                 = computed(() => this._rubros());
  public compromisos            = computed(() => this._compromisos());
  public afectaciones           = computed(() => this._afectaciones());
  public vencimientos           = computed(() => this._vencimientos());
  public ejecucionMensual       = computed(() => this._ejecucionMensual());
  public presupuestoSeleccionado = computed(() => this._presupuestoSeleccionado());
  public loading                = computed(() => this._loading());
  public error                  = computed(() => this._error());

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
    this._error.set(null);

    this.presupuestoService.getResumen()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el resumen presupuestal');
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this._resumen.set({
            vigenciaFiscal:    data.vigencia ?? new Date().getFullYear(),
            corte:             new Date().toLocaleDateString('es-CO'),
            totalApropiacion:  data.totalAsignado,
            totalComprometido: data.totalComprometido,
            totalPagado:       data.totalPagado,
            totalDisponible:   data.saldoGlobal,
            totalZese:         0,
            porcentajeEjecucion: data.porcentajeEjecucion,
            variacionAnual:    0,
          });
        }
      });

    this.presupuestoService.getRubros()
      .pipe(catchError(() => of([])))
      .subscribe(data => {
        this._rubros.set(data);
        this._loading.set(false);
      });
  }

  // ── Compromisos ────────────────────────────────────────────────────────────

  /** Carga compromisos con filtros opcionales de presupuesto y estado */
  cargarCompromisos(presupuestoId?: string, estado?: 'VIGENTE' | 'ANULADO'): void {
    this._loading.set(true);
    this.presupuestoService.getCompromisos(presupuestoId, estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los compromisos');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._compromisos.set(data));
  }

  /** Crea un compromiso presupuestal y recarga la lista */
  comprometer(data: ComprometerData): void {
    this._loading.set(true);
    this.presupuestoService.comprometer(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al comprometer el presupuesto');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.cargarCompromisos(data.presupuestoId);
      });
  }

  /** Anula un compromiso y recarga la lista */
  anularCompromiso(id: string, presupuestoId?: string): void {
    this._loading.set(true);
    this.presupuestoService.anularCompromiso(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al anular el compromiso');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this.cargarCompromisos(presupuestoId);
      });
  }

  /** Registra un pago contra un compromiso y recarga la lista */
  registrarPago(compromisoId: string, data: PagoData, presupuestoId?: string): void {
    this._loading.set(true);
    this.presupuestoService.registrarPago(compromisoId, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar el pago');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.cargarCompromisos(presupuestoId);
      });
  }

  // ── Presupuestos ────────────────────────────────────────────────────────────

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

  /** GET /budget/presupuestos/{id} — carga el detalle de un presupuesto */
  cargarPresupuestoById(id: string): void {
    this._loading.set(true);
    this.presupuestoService.getPresupuestoById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle del presupuesto');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._presupuestoSeleccionado.set(data));
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
