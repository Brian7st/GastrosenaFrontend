import { inject, Injectable, signal, computed } from '@angular/core';
import { Bien, BienFiltros, BienKpis } from '../models/inventario.model';
import { BienesService } from './services/bienes.service';
import { finalize } from 'rxjs';

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

  // Exposición pública (Solo lectura)
  public bienes = computed(() => this._bienes());
  public kpis = computed(() => this._kpis());
  public loading = computed(() => this._loading());
  public filtros = computed(() => this._filtros());

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
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(data => this._bienes.set(data));
  }

  /**
   * Carga los indicadores del dashboard.
   */
  cargarKpis(): void {
    this.bienesService.getKpis()
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
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(() => {
        this.cargarBienes();
        this.cargarKpis();
      });
  }
}
