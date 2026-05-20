import { Injectable, computed, inject, signal } from '@angular/core';
import { ConsolidadoService } from './services/consolidado.service';
import { Consolidado } from '../models/consolidado.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoFacade {
  private consolidadoService = inject(ConsolidadoService);

  private _consolidados = signal<Consolidado[]>([]);
  private _consolidadoSeleccionado = signal<Consolidado | null>(null);
  private _loading = signal<boolean>(false);

  // Computed public signals
  consolidados = computed(() => this._consolidados());
  consolidadoSeleccionado = computed(() => this._consolidadoSeleccionado());
  loading = computed(() => this._loading());

  loadAll(): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidados().subscribe({
      next: (data) => {
        this._consolidados.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando consolidados', err);
        this._loading.set(false);
      }
    });
  }

  cargarConsolidado(id: string): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidado(id).subscribe({
      next: (data) => {
        this._consolidadoSeleccionado.set(data ?? null);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando detalle consolidado', err);
        this._loading.set(false);
      }
    });
  }

  generarConsolidado(gils: string[]): void {
    this._loading.set(true);
    this.consolidadoService.generarConsolidado(gils).subscribe({
      next: (data) => {
        // Optionally append the new item or just reload all
        this._consolidados.update(list => [data, ...list]);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error generando consolidado', err);
        this._loading.set(false);
      }
    });
  }

  reversarConsolidado(id: string): void {
    this._loading.set(true);
    this.consolidadoService.reversarConsolidado(id).subscribe({
      next: () => {
        // Optimistic update
        this._consolidados.update(list => 
          list.map(c => c.id === id ? { ...c, estado: 'Reversado', variant: 'danger' } : c)
        );
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error reversando consolidado', err);
        this._loading.set(false);
      }
    });
  }
}
