import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ConsolidadoService } from './services/consolidado.service';
import { Consolidado } from '../models/consolidado.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoFacade {
  private consolidadoService = inject(ConsolidadoService);

  private _consolidados            = signal<Consolidado[]>([]);
  private _consolidadoSeleccionado = signal<Consolidado | null>(null);
  private _loading                 = signal<boolean>(false);
  private _error                   = signal<string | null>(null);

  consolidados            = computed(() => this._consolidados());
  consolidadoSeleccionado = computed(() => this._consolidadoSeleccionado());
  loading                 = computed(() => this._loading());
  error                   = computed(() => this._error());

  loadAll(): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidados()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los consolidados');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._consolidados.set(data));
  }

  cargarConsolidado(id: string): void {
    this._loading.set(true);
    this.consolidadoService.getConsolidado(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle del consolidado');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._consolidadoSeleccionado.set(data ?? null));
  }

  generarConsolidado(gils: string[]): void {
    this._loading.set(true);
    this.consolidadoService.generarConsolidado(gils)
      .pipe(
        catchError(() => {
          this._error.set('Error al generar el consolidado');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => {
        if (data) this._consolidados.update(list => [data, ...list]);
      });
  }

  reversarConsolidado(id: string): void {
    this._loading.set(true);
    this.consolidadoService.reversarConsolidado(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al reversar el consolidado');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => {
        if (ok) {
          this._consolidados.update(list =>
            list.map(c => c.id === id ? { ...c, estado: 'Reversado', variant: 'danger' as const } : c)
          );
        }
      });
  }
}
