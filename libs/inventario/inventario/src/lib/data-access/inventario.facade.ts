import { inject, Injectable, signal, computed } from '@angular/core';
import { Bien, BienFiltros, BienKpis, BienFormDto } from '../models/inventario.model';
import { BienesService } from './services/bienes.service';
import { finalize, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioFacade {
  private bienesService = inject(BienesService);

  // Estados internos (Signals)
  private _bienes = signal<Bien[]>([]);
  private _kpis = signal<BienKpis | null>(null);
  private _loading = signal<boolean>(false);
  private _filtros = signal<BienFiltros>({});
  private _bienSeleccionado = signal<Bien | undefined>(undefined);
  private _error = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public bienes = computed(() => this._bienes());
  public kpis = computed(() => this._kpis());
  public loading = computed(() => this._loading());
  public filtros = computed(() => this._filtros());
  public bienSeleccionado = computed(() => this._bienSeleccionado());
  public error = computed(() => this._error());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this.cargarBienes();
    this.cargarKpis();
  }

  /**
   * Carga el listado de bienes aplicando los filtros actuales.
   */
  cargarBienes(filtros?: BienFiltros): void {
    if (filtros) this._filtros.set(filtros);
    
    this._loading.set(true);
    this.bienesService.getBienes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de bienes');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._bienes.set(data));
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
   * Elimina un bien y refresca los datos.
   */
  eliminarBien(id: string | number): void {
    this._loading.set(true);
    this.bienesService.deleteBien(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al eliminar el bien');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
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
}
