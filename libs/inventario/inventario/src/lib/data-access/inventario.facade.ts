import { inject, Injectable, signal, computed } from '@angular/core';
import { Bien, BienFiltros, BienKpis, BienFormDto, BienPaginacion } from '../models/inventario.model';
import { ExportacionProductosResponse } from './api/catalog.api';
import { BienesService } from './services/bienes.service';
import { finalize, catchError, of, switchMap, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioFacade {
  private bienesService = inject(BienesService);

  // Estados internos (Signals)
  private _bienes              = signal<Bien[]>([]);
  private _kpis                = signal<BienKpis | null>(null);
  private _loading             = signal<boolean>(false);
  private _filtros             = signal<BienFiltros>({ page: 0, size: 10 });
  private _paginacion          = signal<BienPaginacion>({ totalElements: 0, totalPages: 1, page: 0, size: 10 });
  private _bienSeleccionado    = signal<Bien | undefined>(undefined);
  private _exportacionPendiente = signal<ExportacionProductosResponse | null>(null);
  private _error               = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public bienes               = computed(() => this._bienes());
  public kpis                 = computed(() => this._kpis());
  public loading              = computed(() => this._loading());
  public filtros              = computed(() => this._filtros());
  public paginacion           = computed(() => this._paginacion());
  public bienSeleccionado     = computed(() => this._bienSeleccionado());
  public exportacionPendiente = computed(() => this._exportacionPendiente());
  public error                = computed(() => this._error());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this.cargarBienes();
    this.cargarKpis();
  }

  /**
   * Carga el listado de bienes aplicando los filtros actuales.
   * Al cambiar filtros de búsqueda/categoría vuelve a página 0.
   */
  cargarBienes(filtros?: BienFiltros): void {
    if (filtros) this._filtros.set({ ...this._filtros(), ...filtros, page: 0 });

    this._loading.set(true);
    this.bienesService.getBienes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de bienes');
          return of({ bienes: [], paginacion: { totalElements: 0, totalPages: 1, page: 0, size: 10 } });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ bienes, paginacion }) => {
        this._bienes.set(bienes);
        this._paginacion.set(paginacion);
      });
  }

  /** Navega a una página específica sin resetear los filtros. */
  irAPagina(page: number): void {
    this._filtros.update(f => ({ ...f, page }));
    this._loading.set(true);
    this.bienesService.getBienes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la página');
          return of({ bienes: [], paginacion: this._paginacion() });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ bienes, paginacion }) => {
        this._bienes.set(bienes);
        this._paginacion.set(paginacion);
      });
  }

  /**
   * Carga un bien específico por su ID.
   */
  cargarBienPorId(id: string): void {
    this._loading.set(true);
    this.bienesService.getBienById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle del bien');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._bienSeleccionado.set(data));
  }

  /**
   * Carga los indicadores del dashboard.
   */
  cargarKpis(): void {
    this.bienesService.getKpis()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los indicadores');
          return of(null);
        })
      )
      .subscribe(data => this._kpis.set(data));
  }

  /**
   * Actualiza los filtros y recarga la lista.
   */
  setFiltros(filtros: BienFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros });
    this.cargarBienes();
  }

  /**
   * Desactiva un bien individual (soft delete → activo: false).
   * No hace hard delete — solo marca como inactivo.
   */
  eliminarBien(id: string | number): void {
    this._loading.set(true);
    this.bienesService.desactivarBien(id).pipe(
      catchError(() => {
        this._error.set('Error al desactivar el bien');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe((res) => {
      if (res !== null) {
        this.cargarBienes();
        this.cargarKpis();
      }
    });
  }

  /**
   * Crea un nuevo bien y refresca los datos.
   */
  crearBien(dto: BienFormDto): void {
    this._loading.set(true);
    this.bienesService.createBien(dto)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear el bien');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res !== null) this.loadAll();
      });
  }

  /**
   * Desactiva un bien (soft delete → activo: false).
   * Usa PATCH /catalog/productos/{id}/desactivar.
   */
  desactivarBien(id: string | number): void {
    this._loading.set(true);
    this.bienesService.desactivarBien(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al desactivar el bien');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this.cargarBienes(); });
  }

  activarBien(id: string | number): void {
    this._loading.set(true);
    this.bienesService.activarBien(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al activar el bien');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this.cargarBienes(); });
  }

  /**
   * Actualiza un bien existente y refresca los datos.
   */
  actualizarBien(id: string | number, dto: BienFormDto): void {
    this._loading.set(true);
    this.bienesService.updateBien(id, dto)
      .pipe(
        catchError(() => {
          this._error.set('Error al actualizar el bien');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res !== null) this.loadAll();
      });
  }

  // ── Operaciones masivas ────────────────────────────────────────────────────

  /**
   * Eliminación masiva: desactiva todos primero, luego hard delete.
   * Backend requiere productos inactivos antes de aceptar DELETE.
   */
  eliminarBienesMasivo(ids: string[]): void {
    this._loading.set(true);
    const desactivaciones$ = ids.map(id => this.bienesService.desactivarBien(id));
    forkJoin(desactivaciones$).pipe(
      switchMap(() => this.bienesService.eliminarBienesMasivo(ids, 'ELIMINAR')),
      catchError(() => {
        this._error.set('Error al eliminar los bienes en masa');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe(res => {
      if (res !== null) {
        this.cargarBienes();
        this.cargarKpis();
      }
    });
  }

  /** POST /catalog/productos/importar */
  importarBienes(productos: BienFormDto[]): void {
    this._loading.set(true);
    this.bienesService.importarBienes(productos)
      .pipe(
        catchError(() => {
          this._error.set('Error al importar los bienes');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this.loadAll(); });
  }

  importarBienesExcel(archivo: File): void {
    this._loading.set(true);
    this.bienesService.importarBienesExcel(archivo)
      .pipe(
        catchError(() => {
          this._error.set('Error al importar el archivo Excel');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this.loadAll(); });
  }

  /** POST /catalog/productos/exportaciones (202 Accepted — async) */
  solicitarExportacion(formato: 'CSV'): void {
    this._loading.set(true);
    this.bienesService.solicitarExportacion(formato)
      .pipe(
        catchError(() => {
          this._error.set('Error al solicitar la exportación');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res !== null) this._exportacionPendiente.set(res); });
  }
}
