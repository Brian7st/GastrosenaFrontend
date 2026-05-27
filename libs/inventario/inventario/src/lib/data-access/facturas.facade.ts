import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { Factura, FacturaFiltros, FacturaKpis, SolicitudGIL, ConciliacionGil } from '../models/facturas.model';
import { FacturasService } from './services/facturas.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasFacade {
  private svc = inject(FacturasService);

  // ── Estado interno ────────────────────────────────────────────────────────
  private _facturas             = signal<Factura[]>([]);
  private _kpis                 = signal<FacturaKpis | null>(null);
  private _facturaSeleccionada  = signal<Factura | null>(null);
  private _solicitudGIL         = signal<SolicitudGIL | null>(null);
  private _conciliacionGil      = signal<ConciliacionGil | null>(null);
  private _loading              = signal<boolean>(false);
  private _filtros              = signal<FacturaFiltros>({});
  private _error                = signal<string | null>(null);

  // ── Exposición pública ────────────────────────────────────────────────────
  public facturas            = computed(() => this._facturas());
  public kpis                = computed(() => this._kpis());
  public facturaSeleccionada = computed(() => this._facturaSeleccionada());
  public solicitudGIL        = computed(() => this._solicitudGIL());
  public conciliacionGil     = computed(() => this._conciliacionGil());
  public loading             = computed(() => this._loading());
  public filtros             = computed(() => this._filtros());
  public error               = computed(() => this._error());

  /** Carga inicial del panel */
  loadAll(): void {
    this.cargarFacturas();
    this.cargarKpis();
  }

  /** Carga listado con filtros actuales */
  cargarFacturas(filtros?: FacturaFiltros): void {
    if (filtros) this._filtros.set(filtros);
    this._loading.set(true);
    this.svc.getFacturas(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de facturas');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._facturas.set(data));
  }

  /** Carga KPIs del panel */
  cargarKpis(): void {
    this.svc.getKpis()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los indicadores');
          return of(null);
        })
      )
      .subscribe(data => this._kpis.set(data));
  }

  /** Aplica filtros y recarga */
  setFiltros(filtros: FacturaFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros });
    this.cargarFacturas();
  }

  /** Carga una factura por ID */
  cargarFactura(id: string | number): void {
    this._loading.set(true);
    this.svc.getFacturaById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la factura');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(f => this._facturaSeleccionada.set(f ?? null));
  }

  /** Crea una nueva factura */
  crearFactura(data: Partial<Factura>): void {
    this._loading.set(true);
    this.svc.createFactura(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear la factura');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res !== null) this.loadAll();
      });
  }

  /** Actualiza una factura */
  actualizarFactura(id: string | number, data: Partial<Factura>): void {
    this._loading.set(true);
    this.svc.updateFactura(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al actualizar la factura');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(updated => {
        if (updated !== null) {
          this._facturaSeleccionada.set(updated);
          this.cargarFacturas();
        }
      });
  }

  /** Anula una factura — motivo es @NotBlank en backend.
   *  TODO visual phase: reemplazar default con input real del usuario. */
  anularFactura(id: string | number, motivo = 'Anulación solicitada'): void {
    this._loading.set(true);
    this.svc.anularFactura(id, motivo)
      .pipe(
        catchError(() => {
          this._error.set('Error al anular la factura');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res !== null) this.loadAll();
      });
  }

  /** Verifica la factura (dispara entrada automática de stock) */
  verificarFactura(id: string | number): void {
    this._loading.set(true);
    this.svc.verificarFactura(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al verificar la factura');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) { this._facturaSeleccionada.set(res); this.cargarFacturas(); }
      });
  }

  /** Marca la factura como pagada (solo desde estado VERIFICADA) */
  marcarPagada(id: string | number): void {
    this._loading.set(true);
    this.svc.marcarPagada(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al marcar la factura como pagada');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) { this._facturaSeleccionada.set(res); this.cargarFacturas(); }
      });
  }

  /** Actualiza los datos bancarios del proveedor (solo en REGISTRADA o VERIFICADA) */
  actualizarInfoBancaria(
    id: string | number,
    data: { banco: string; tipoCuenta: string; numeroCuenta: string },
  ): void {
    this._loading.set(true);
    this.svc.actualizarInfoBancaria(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al actualizar la información bancaria');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this._facturaSeleccionada.set(res); });
  }

  /** Carga una solicitud GIL */
  cargarSolicitudGIL(id: string): void {
    this.svc.getSolicitudGIL(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la solicitud GIL');
          return of(null);
        })
      )
      .subscribe(s => this._solicitudGIL.set(s ?? null));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sourcing — Conciliación Factura-GIL
  // ─────────────────────────────────────────────────────────────────────────

  /** POST /sourcing/conciliaciones-gil — vincula factura con GIL y guarda el resultado */
  conciliarFacturaGil(facturaId: string, gilId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.svc.conciliarFacturaGil(facturaId, gilId)
      .pipe(
        catchError(() => {
          this._error.set('Error al conciliar la factura con el GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this._conciliacionGil.set(res); });
  }

  /** GET /sourcing/conciliaciones-gil?facturaId=X ó ?gilId=Y */
  cargarConciliacionGil(params: { facturaId?: string; gilId?: string }): void {
    this._loading.set(true);
    this._error.set(null);
    this.svc.getConciliacionGil(params)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la conciliación GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this._conciliacionGil.set(res); });
  }

  /** PATCH /sourcing/conciliaciones-gil/{id}/diferencias/{gilItemId}/resolver */
  resolverDiferenciaGil(id: string, gilItemId: string, observacion: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.svc.resolverDiferenciaGil(id, gilItemId, observacion)
      .pipe(
        catchError(() => {
          this._error.set('Error al resolver la diferencia GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this._conciliacionGil.set(res); });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sourcing — Vinculación Instructor
  // ─────────────────────────────────────────────────────────────────────────

  /** PUT /sourcing/instructor-vinculos/{ordenCompra} */
  vincularInstructorOrden(ordenCompra: string, instructorId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.svc.vincularInstructorOrden(ordenCompra, instructorId)
      .pipe(
        catchError(() => {
          this._error.set('Error al vincular el instructor a la orden de compra');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => { /* 204 No Content — sin payload que actualizar */ });
  }
}
