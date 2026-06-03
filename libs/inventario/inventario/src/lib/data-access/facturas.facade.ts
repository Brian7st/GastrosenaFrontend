import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { Factura, FacturaFiltros, FacturaKpis, FacturaPaginacion, SolicitudGIL, ConciliacionGil, FacturaFormDto, GilPickerItem } from '../models/facturas.model';
import { FacturasService } from './services/facturas.service';
import { ActualizarFacturaRequest } from './api/sourcing.api';
import { BienGilResponse } from './api/procurement.api';

@Injectable({
  providedIn: 'root'
})
export class FacturasFacade {
  private svc = inject(FacturasService);

  private _facturas              = signal<Factura[]>([]);
  private _kpis                  = signal<FacturaKpis | null>(null);
  private _facturaSeleccionada   = signal<Factura | null>(null);
  private _facturaImportada      = signal<Factura | null>(null);
  private _solicitudGIL          = signal<SolicitudGIL | null>(null);
  private _conciliacionGil       = signal<ConciliacionGil | null>(null);
  private _gilesDisponibles      = signal<GilPickerItem[]>([]);
  private _conciliacionImportacion = signal<ConciliacionGil | null>(null);
  private _gilBienes               = signal<BienGilResponse[]>([]);
  private _conciliacionCargada   = signal(false);
  private _paginacion            = signal<FacturaPaginacion>({ totalElements: 0, totalPages: 1, page: 0, size: 10 });
  private _loading               = signal<boolean>(false);
  private _filtros               = signal<FacturaFiltros>({ page: 0, size: 10 });
  private _error                 = signal<string | null>(null);

  public facturas              = computed(() => this._facturas());
  public kpis                  = computed(() => this._kpis());
  public facturaSeleccionada   = computed(() => this._facturaSeleccionada());
  public facturaImportada      = computed(() => this._facturaImportada());
  public solicitudGIL          = computed(() => this._solicitudGIL());
  public conciliacionGil       = computed(() => this._conciliacionGil());
  public gilesDisponibles      = computed(() => this._gilesDisponibles());
  public conciliacionImportacion = computed(() => this._conciliacionImportacion());
  public gilBienes               = computed(() => this._gilBienes());
  public conciliacionCargada   = computed(() => this._conciliacionCargada());
  public paginacion            = computed(() => this._paginacion());
  public loading               = computed(() => this._loading());
  public filtros               = computed(() => this._filtros());
  public error                 = computed(() => this._error());

  loadAll(): void {
    this.cargarFacturas();
    this.cargarKpis();
  }

  cargarFacturas(filtros?: FacturaFiltros): void {
    if (filtros) this._filtros.set({ ...this._filtros(), ...filtros, page: 0 });
    this._loading.set(true);
    this.svc.getFacturas(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de facturas');
          return of({ facturas: [], paginacion: this._paginacion() });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ facturas, paginacion }) => {
        this._facturas.set(facturas);
        this._paginacion.set(paginacion);
      });
  }

  irAPagina(page: number): void {
    this._filtros.update(f => ({ ...f, page }));
    this._loading.set(true);
    this.svc.getFacturas(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la página');
          return of({ facturas: [], paginacion: this._paginacion() });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ facturas, paginacion }) => {
        this._facturas.set(facturas);
        this._paginacion.set(paginacion);
      });
  }

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

  setFiltros(filtros: FacturaFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros, page: 0 });
    this.cargarFacturas();
  }

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

  crearFactura(data: FacturaFormDto): void {
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

  importarFacturaFelXml(file: File, gilId?: string): void {
    this._loading.set(true);
    this._error.set(null);
    this._facturaImportada.set(null);

    this.svc.importarFacturaFelXml(file, gilId)
      .pipe(
        catchError((error) => {
          this._error.set(this.getImportErrorMessage(error));
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((factura) => {
        if (factura !== null) {
          this._facturaImportada.set(factura);
          this._facturaSeleccionada.set(factura);
          this.cargarFacturas();
          this.cargarKpis();
        }
      });
  }

  limpiarImportacionFactura(): void {
    this._facturaImportada.set(null);
    this._conciliacionImportacion.set(null);
    this._error.set(null);
  }

  intentarCargarConciliacion(facturaId: string): void {
    this._conciliacionCargada.set(false);
    this._conciliacionGil.set(null);
    this.svc.getConciliacionGil({ facturaId })
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        this._conciliacionGil.set(res);
        this._conciliacionCargada.set(true);
      });
  }

  cargarGilBienes(gilId: string): void {
    if (!gilId) { this._gilBienes.set([]); return; }
    this.svc.getGilBienes(gilId)
      .pipe(catchError(() => of([])))
      .subscribe(bienes => this._gilBienes.set(bienes));
  }

  cargarGilesDisponibles(): void {
    this.svc.getGilesEnviadosProveedor()
      .pipe(catchError(() => of([])))
      .subscribe(giles => this._gilesDisponibles.set(giles));
  }

  actualizarFactura(id: string | number, data: ActualizarFacturaRequest): void {
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

  conciliarEnImportacion(facturaId: string, gilId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.svc.conciliarFacturaGil(facturaId, gilId)
      .pipe(
        catchError((error) => {
          this._error.set(this.getConciliacionErrorMessage(error));
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this._conciliacionImportacion.set(res); });
  }

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
      .subscribe(() => { /* 204 No Content */ });
  }

  private getConciliacionErrorMessage(error: unknown): string {
    const httpError = error as { error?: { detail?: string; title?: string }; status?: number };
    if (httpError?.error?.detail) return httpError.error.detail;
    if (httpError?.error?.title) return httpError.error.title;
    if (httpError?.status === 409) return 'Ya existe una conciliación para esta factura o GIL.';
    if (httpError?.status === 422) return 'No se pudo conciliar. Verificá que el GIL tenga ítems y la factura esté en estado REGISTRADA.';
    return 'Error al conciliar la factura con el GIL';
  }

  private getImportErrorMessage(error: unknown): string {
    const httpError = error as {
      error?: { detail?: string; title?: string };
      status?: number;
    };

    if (httpError?.error?.detail) return httpError.error.detail;
    if (httpError?.error?.title) return httpError.error.title;
    if (httpError?.status === 409) return 'La factura ya existe en el sistema.';
    if (httpError?.status === 400) return 'El archivo no es un XML FEL válido.';
    if (httpError?.status === 422) return 'No se pudo procesar el contenido de la factura.';

    return 'Error al importar la factura electrónica';
  }
}
