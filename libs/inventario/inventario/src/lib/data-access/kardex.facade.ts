import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import {
  Movimiento,
  EntradaMovimientoData,
  SalidaMovimientoData,
  ReservaMovimientoData,
  LiberacionMovimientoData,
  AjusteMovimientoData,
} from '../models/movimiento.model';
import { ExistenciaProducto } from '../models/inventario.model';
import { KardexValorizadoItem } from '../models/reporting.model';
import { MovimientosService } from './services/movimientos.service';

@Injectable({ providedIn: 'root' })
export class KardexFacade {
  private movimientosService = inject(MovimientosService);

  // ── Estado ───────────────────────────────────────────────────────────────────
  private _movimientos              = signal<Movimiento[]>([]);
  private _movimientoSeleccionado   = signal<Movimiento | undefined>(undefined);
  private _existencia               = signal<ExistenciaProducto | null>(null);
  private _bajoMinimo               = signal<ExistenciaProducto[]>([]);
  private _kardexValorizado         = signal<KardexValorizadoItem[]>([]);
  private _loading                  = signal<boolean>(false);
  private _error                    = signal<string | null>(null);

  // ── Lectura pública ──────────────────────────────────────────────────────────
  public movimientos              = computed(() => this._movimientos());
  public movimientoSeleccionado   = computed(() => this._movimientoSeleccionado());
  public existencia               = computed(() => this._existencia());
  public bajoMinimo               = computed(() => this._bajoMinimo());
  public kardexValorizado         = computed(() => this._kardexValorizado());
  public loading                  = computed(() => this._loading());
  public error                    = computed(() => this._error());

  // ── Kardex ───────────────────────────────────────────────────────────────────

  /** El backend no expone un listado general de movimientos.
   *  Llama cargarKardex(productoId) una vez se seleccione un producto. */
  loadAll(): void {
    this._movimientos.set([]);
    this._error.set(null);
  }

  cargarKardex(productoId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getKardex(productoId)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el kardex');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._movimientos.set(data));
  }

  cargarMovimiento(id: string): void {
    this._loading.set(true);
    this.movimientosService.getMovimientoById(id)
      .pipe(
        catchError(() => of(undefined)),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._movimientoSeleccionado.set(data));
  }

  /** GET /reporting/kardex?productoId?&desde?&hasta? */
  cargarKardexValorizado(params?: {
    productoId?: string;
    desde?:      string;
    hasta?:      string;
  }): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getKardexValorizado(params)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el kardex valorizado');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._kardexValorizado.set(data));
  }

  // ── Existencias ──────────────────────────────────────────────────────────────

  cargarExistencia(productoId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getExistencia(productoId)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar existencias');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._existencia.set(data));
  }

  cargarBajoMinimo(): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getExistenciasBajoMinimo()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar productos bajo mínimo');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._bajoMinimo.set(data));
  }

  // ── Registros ────────────────────────────────────────────────────────────────

  registrarEntrada(data: EntradaMovimientoData): void {
    this._loading.set(true);
    this.movimientosService.registrarEntrada(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar entrada');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this.cargarKardex(data.productoId); });
  }

  registrarSalida(data: SalidaMovimientoData): void {
    this._loading.set(true);
    this.movimientosService.registrarSalida(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar salida');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this.cargarKardex(data.productoId); });
  }

  registrarReserva(data: ReservaMovimientoData): void {
    this._loading.set(true);
    this.movimientosService.registrarReserva(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar reserva');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this.cargarKardex(data.producto); });
  }

  registrarLiberacion(data: LiberacionMovimientoData): void {
    this._loading.set(true);
    this.movimientosService.registrarLiberacion(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar liberación');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this.cargarKardex(data.producto); });
  }

  registrarAjuste(data: AjusteMovimientoData): void {
    this._loading.set(true);
    this.movimientosService.registrarAjuste(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar ajuste');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this.cargarKardex(data.producto); });
  }
}
