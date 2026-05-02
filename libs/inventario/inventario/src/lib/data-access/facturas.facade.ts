import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';
import { Factura, FacturaFiltros, FacturaKpis, SolicitudGIL } from '../models/facturas.model';
import { FacturasService } from './services/facturas.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasFacade {
  private svc = inject(FacturasService);

  // Internal state
  private _facturas = signal<Factura[]>([]);
  private _kpis = signal<FacturaKpis | null>(null);
  private _facturaSeleccionada = signal<Factura | null>(null);
  private _solicitudGIL = signal<SolicitudGIL | null>(null);
  private _loading = signal<boolean>(false);
  private _filtros = signal<FacturaFiltros>({});

  // Public readonly
  public facturas = computed(() => this._facturas());
  public kpis = computed(() => this._kpis());
  public facturaSeleccionada = computed(() => this._facturaSeleccionada());
  public solicitudGIL = computed(() => this._solicitudGIL());
  public loading = computed(() => this._loading());
  public filtros = computed(() => this._filtros());

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
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(data => this._facturas.set(data));
  }

  /** Carga KPIs del panel */
  cargarKpis(): void {
    this.svc.getKpis().subscribe(data => this._kpis.set(data));
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
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(f => this._facturaSeleccionada.set(f ?? null));
  }

  /** Crea una nueva factura */
  crearFactura(data: Partial<Factura>): void {
    this._loading.set(true);
    this.svc.createFactura(data)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(() => this.loadAll());
  }

  /** Actualiza una factura */
  actualizarFactura(id: string | number, data: Partial<Factura>): void {
    this._loading.set(true);
    this.svc.updateFactura(id, data)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(updated => {
        this._facturaSeleccionada.set(updated);
        this.cargarFacturas();
      });
  }

  /** Anula una factura */
  anularFactura(id: string | number): void {
    this._loading.set(true);
    this.svc.anularFactura(id)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(() => this.loadAll());
  }

  /** Carga una solicitud GIL */
  cargarSolicitudGIL(id: string): void {
    this.svc.getSolicitudGIL(id)
      .subscribe(s => this._solicitudGIL.set(s ?? null));
  }
}
