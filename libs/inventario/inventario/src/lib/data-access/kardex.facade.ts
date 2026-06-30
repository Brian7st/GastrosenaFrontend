import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, of } from 'rxjs';
import {
  Movimiento,
  DocumentoMovimiento,
  SalidaMovimientoData,
  ReservaMovimientoData,
  LiberacionMovimientoData,
  AjusteMovimientoData,
} from '../models/movimiento.model';
import { ExistenciaProducto } from '../models/inventario.model';
import { KardexValorizadoItem } from '../models/reporting.model';
import { MovimientosService } from './services/movimientos.service';
import { descargarBlob } from '../util';

@Injectable({ providedIn: 'root' })
export class KardexFacade {
  private movimientosService = inject(MovimientosService);

  // ── Estado ───────────────────────────────────────────────────────────────────
  private _documentos               = signal<DocumentoMovimiento[]>([]);
  private _documentoSeleccionado    = signal<DocumentoMovimiento | undefined>(undefined);
  private _bienesDocumento          = signal<Movimiento[]>([]);
  /** Movimientos del kardex por producto (GET /inventory/movimientos/{productoId}) */
  private _kardexMovimientos        = signal<Movimiento[]>([]);
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
  public documentos               = computed(() => this._documentos());
  public documentoSeleccionado    = computed(() => this._documentoSeleccionado());
  public bienesDocumento          = computed(() => this._bienesDocumento());
  public kardexMovimientos        = computed(() => this._kardexMovimientos());
  public existencia               = computed(() => this._existencia());
  public bajoMinimo               = computed(() => this._bajoMinimo());
  public kardexValorizado         = computed(() => this._kardexValorizado());
  public loading                  = computed(() => this._loading());
  public error                    = computed(() => this._error());
  public paginacion               = computed(() => this._paginacion());

  /** Descarga el reporte de uso/movimientos de bienes (lo genera ga-ms-reportes). */
  exportarUsoBienes(fechaInicio: string, fechaFin: string, formato: string, tipo?: 'ENTRADA' | 'SALIDA'): void {
    const ext = formato.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx';
    this._loading.set(true);
    this.movimientosService.exportarUsoBienes(fechaInicio, fechaFin, formato, tipo)
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar el reporte de uso de bienes');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(blob => { if (blob) descargarBlob(blob, `uso_bienes_${fechaInicio}_${fechaFin}.${ext}`); });
  }

  // ── Documentos agrupados ─────────────────────────────────────────────────────

  /** Carga el listado paginado de documentos (GET /inventory/movimientos). */
  loadAll(pagina = 0, tamano = 20): void {
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getDocumentos(pagina, tamano)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los documentos');
          return of({ documentos: [], totalPaginas: 0, totalElementos: 0, paginaActual: pagina, tamano });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ documentos, totalPaginas, totalElementos }) => {
        this._documentos.set(documentos);
        this._paginacion.set({ totalElementos, totalPaginas, page: pagina, size: tamano });
      });
  }

  /**
   * Carga el detalle de un documento: resuelve `_documentoSeleccionado` desde
   * la lista en memoria (fallback: deja undefined → header usa documentoId) y
   * carga los bienes via `getBienesPorDocumento`.
   */
  cargarDocumento(documentoId: string, tipo: 'ENTRADA' | 'SALIDA'): void {
    const encontrado = this._documentos().find(d => d.documentoId === documentoId);
    this._documentoSeleccionado.set(encontrado);
    this._loading.set(true);
    this._error.set(null);
    this.movimientosService.getBienesPorDocumento(documentoId, tipo)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los bienes del documento');
          return of({ tipo, documentoId, numeroDocumento: null, bienes: [] as Movimiento[] });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ bienes }) => {
        this._bienesDocumento.set(bienes);
      });
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
        this._kardexMovimientos.set(movimientos);
        this._paginacion.set({ totalElementos, totalPaginas, page: pagina, size: tamano });
      });
  }

  /** Navega a la página indicada del listado de documentos. */
  irAPaginaMovimientos(page: number): void {
    const { size } = this._paginacion();
    this.loadAll(page, size);
  }

  /** Navega a la página indicada del kardex del producto actualmente cargado. */
  irAPaginaKardex(page: number): void {
    const { size } = this._paginacion();
    const productoId = this._productoIdActual();
    if (productoId) {
      this.cargarKardex(productoId, page, size);
    }
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
