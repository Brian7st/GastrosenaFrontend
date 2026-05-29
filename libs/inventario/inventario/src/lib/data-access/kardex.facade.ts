import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, of } from 'rxjs';
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

  /** Paginación del kardex (GET /inventory/movimientos/{productoId}) */
  private _paginacion = signal<{ totalElementos: number; totalPaginas: number; page: number; size: number }>({
    totalElementos: 0, totalPaginas: 0, page: 0, size: 10,
  });
  /** productoId activo para reutilizarlo al navegar páginas sin pasarlo de nuevo */
  private _productoIdActual = signal<string>('');

  // ── Lectura pública ──────────────────────────────────────────────────────────
  public movimientos              = computed(() => this._movimientos());
  public movimientoSeleccionado   = computed(() => this._movimientoSeleccionado());
  public existencia               = computed(() => this._existencia());
  public bajoMinimo               = computed(() => this._bajoMinimo());
  public kardexValorizado         = computed(() => this._kardexValorizado());
  public loading                  = computed(() => this._loading());
  public error                    = computed(() => this._error());
  public paginacion               = computed(() => this._paginacion());

  // ── Kardex ───────────────────────────────────────────────────────────────────

  /** El backend no expone un listado general de movimientos.
   *  Llama cargarKardex(productoId) una vez se seleccione un producto. */
  loadAll(): void {
    this._movimientos.set([]);
    this._error.set(null);
    this._paginacion.set({ totalElementos: 0, totalPaginas: 0, page: 0, size: 10 });
  }

  /**
   * Carga la página indicada del kardex de un producto.
   * Los params `pagina`/`tamano` coinciden con el Swagger (español).
   * El productoId se memoriza para reutilizarlo en `irAPaginaKardex`.
   */
  cargarKardex(productoId: string, pagina = 0, tamano = 10): void {
    this._loading.set(true);
    this._error.set(null);
    this._productoIdActual.set(productoId);
    this.movimientosService.getKardex(productoId, pagina, tamano)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el kardex');
          return of({ movimientos: [], totalPaginas: 0, totalElementos: 0 });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ movimientos, totalPaginas, totalElementos }) => {
        this._movimientos.set(movimientos);
        this._paginacion.set({ totalElementos, totalPaginas, page: pagina, size: tamano });
      });
  }

  /** Navega a la página indicada del kardex del producto actualmente cargado. */
  irAPaginaKardex(page: number): void {
    const { size } = this._paginacion();
    const productoId = this._productoIdActual();
    if (productoId) {
      this.cargarKardex(productoId, page, size);
    }
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
    this._error.set(null);
    this.movimientosService.registrarEntrada(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar entrada');
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => {
        const { page, size } = this._paginacion();
        this.cargarKardex(data.productoId, page, size);
      });
  }

  registrarSalida(data: SalidaMovimientoData): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.registrarSalida(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar salida');
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => {
        const { page, size } = this._paginacion();
        this.cargarKardex(data.productoId, page, size);
      });
  }

  registrarReserva(data: ReservaMovimientoData): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.registrarReserva(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar reserva');
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => this.cargarKardex(data.producto));
  }

  registrarLiberacion(data: LiberacionMovimientoData): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.registrarLiberacion(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar liberación');
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => this.cargarKardex(data.producto));
  }

  registrarAjuste(data: AjusteMovimientoData): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.registrarAjuste(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar ajuste');
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => this.cargarKardex(data.producto));
  }
}
