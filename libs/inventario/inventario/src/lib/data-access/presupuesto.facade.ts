import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PresupuestoService } from './services/presupuesto.service';
import {
  PresupuestoDetalle,
  PresupuestoResumen,
  ResumenPresupuestosGlobal,
  Rubro,
  GrupoPresupuestal,
  GrupoSiif,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  RegistrarPresupuestoData,
  TrasladarRubroData,
  Compromiso,
  ComprometerData,
  PagoData,
  EstadoCompromiso,
} from '../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoFacade {
  private presupuestoService = inject(PresupuestoService);

  // Estados internos (Signals)
  private _resumen                 = signal<PresupuestoResumen | null>(null);
  private _resumenGlobal           = signal<ResumenPresupuestosGlobal | null>(null);
  private _rubros                  = signal<Rubro[]>([]);
  private _compromisos             = signal<Compromiso[]>([]);
  private _afectaciones            = signal<AfectacionPresupuestal[]>([]);
  private _vencimientos            = signal<VencimientoProximo[]>([]);
  private _ejecucionMensual        = signal<EjecucionMensual[]>([]);
  private _presupuestoSeleccionado = signal<PresupuestoDetalle | undefined>(undefined);
  private _loading                 = signal<boolean>(false);
  private _error                   = signal<string | null>(null);

  // Exposición pública (solo lectura)
  /** Null mientras getResumen() esté pendiente de backend. */
  public resumen                = computed(() => this._resumen());
  public resumenGlobal          = computed(() => this._resumenGlobal());
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
    const groupMap = new Map<string, GrupoPresupuestal>();

    for (const r of this._rubros()) {
      if (!groupMap.has(r.fichaId)) {
        groupMap.set(r.fichaId, {
          fichaId:                r.fichaId,
          programaFormacion:      r.programaFormacion,
          rubros:                 [],
          totalMontoAsignado:     0,
          totalSaldoDisponible:   0,
          totalMontoComprometido: 0,
          totalMontoPagado:       0,
          totalZese:              0,
          porcentajeEjecucion:    0,
        });
      }
      const g = groupMap.get(r.fichaId)!;
      g.rubros.push(r);
      g.totalMontoAsignado     += r.montoAsignado;
      g.totalSaldoDisponible   += r.saldoDisponible;
      g.totalMontoComprometido += r.montoComprometido;
      g.totalMontoPagado       += r.montoPagado;
    }

    for (const g of groupMap.values()) {
      g.porcentajeEjecucion = g.totalMontoAsignado > 0
        ? parseFloat(
            ((g.totalMontoComprometido + g.totalMontoPagado) / g.totalMontoAsignado * 100).toFixed(1),
          )
        : 0;
    }

    return Array.from(groupMap.values());
  });

  /** Sección B del Excel: rubros agrupados por posición presupuestal + fuente (SIIF). */
  public gruposPorPosicion = computed<GrupoSiif[]>(() => {
    const groupMap = new Map<string, GrupoSiif>();

    for (const r of this._rubros()) {
      const clave = `${r.posicionPresupuestal}|${r.fuente}`;
      if (!groupMap.has(clave)) {
        groupMap.set(clave, {
          posicionPresupuestal:   r.posicionPresupuestal,
          fuente:                 r.fuente,
          rubros:                 [],
          totalMontoAsignado:     0,
          totalMontoComprometido: 0,
          totalMontoPagado:       0,
          totalSaldoDisponible:   0,
          totalValorPorCancelar:  0,
          porcentajeEjecucion:    0,
        });
      }
      const g = groupMap.get(clave)!;
      g.rubros.push(r);
      g.totalMontoAsignado     += r.montoAsignado;
      g.totalMontoComprometido += r.montoComprometido;
      g.totalMontoPagado       += r.montoPagado;
      g.totalSaldoDisponible   += r.saldoDisponible;
      g.totalValorPorCancelar  += r.valorPorCancelar;
    }

    for (const g of groupMap.values()) {
      g.porcentajeEjecucion = g.totalMontoAsignado > 0
        ? parseFloat(
            ((g.totalMontoComprometido + g.totalMontoPagado) / g.totalMontoAsignado * 100).toFixed(1),
          )
        : 0;
    }

    return Array.from(groupMap.values());
  });

  /**
   * Carga inicial de datos para el dashboard:
   * rubros, resumen global, afectaciones, vencimientos, ejecución mensual.
   * Errores en cada llamada se absorben sin interrumpir las demás.
   */
  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);

    this.presupuestoService.getRubros()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los rubros presupuestales');
          return of([]);
        }),
      )
      .subscribe(data => this._rubros.set(data));

    this.presupuestoService.getResumen()
      .pipe(catchError(() => of(null)))
      .subscribe(data => this._resumenGlobal.set(data));

    this.presupuestoService.getAfectaciones()
      .pipe(catchError(() => of([])))
      .subscribe(data => this._afectaciones.set(data));

    this.presupuestoService.getVencimientos()
      .pipe(catchError(() => of([])))
      .subscribe(data => this._vencimientos.set(data));

    this.presupuestoService.getEjecucionMensual()
      .pipe(
        catchError(() => of([])),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._ejecucionMensual.set(data));
  }

  /**
   * Carga SOLO el resumen global (GET /budget/presupuestos/resumen).
   * Pensado para vistas que necesitan el % de ejecución sin el resto del
   * dashboard (evita disparar los GET de rubros/afectaciones/vencimientos).
   */
  cargarResumenGlobal(vigencia?: number): void {
    this.presupuestoService.getResumen(vigencia)
      .pipe(catchError(() => of(null)))
      .subscribe(data => this._resumenGlobal.set(data));
  }

  // ── Compromisos ────────────────────────────────────────────────────────────

  /** Carga compromisos con filtros opcionales de presupuesto y estado */
  cargarCompromisos(presupuestoId?: string, estado?: EstadoCompromiso): void {
    this._loading.set(true);
    this.presupuestoService.getCompromisos(presupuestoId, estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los compromisos');
          return of([]);
        }),
        finalize(() => this._loading.set(false)),
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
        finalize(() => this._loading.set(false)),
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
        finalize(() => this._loading.set(false)),
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
        finalize(() => this._loading.set(false)),
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
        finalize(() => this._loading.set(false)),
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
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._presupuestoSeleccionado.set(data));
  }

  /** POST /budget/presupuestos/{id}/traslados */
  trasladarRubro(data: TrasladarRubroData): void {
    this._loading.set(true);
    this._error.set(null);
    this.presupuestoService.trasladarRubro(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al trasladar el rubro presupuestal');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(() => this.loadAll());
  }

  /** Exportar — pendiente backend (FE-06) */
  exportar(formato: string): void {
    this._loading.set(true);
    this.presupuestoService.exportar(formato)
      .pipe(
        catchError(() => {
          this._error.set('Exportación pendiente de implementación en backend');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe();
  }
}
