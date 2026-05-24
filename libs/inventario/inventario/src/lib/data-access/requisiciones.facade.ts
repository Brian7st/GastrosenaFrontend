import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { RequisicionesService } from './services/requisiciones.service';
import { Requisicion, RequisicionEstado } from '../models/requisicion.model';

@Injectable({ providedIn: 'root' })
export class RequisicionesFacade {
  private requisicionesService = inject(RequisicionesService);

  // Estados internos (Signals)
  private _requisiciones           = signal<Requisicion[]>([]);
  private _requisicionSeleccionada = signal<Requisicion | null>(null);
  private _loading                 = signal<boolean>(false);
  private _error                   = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public requisiciones           = computed(() => this._requisiciones());
  public requisicionSeleccionada = computed(() => this._requisicionSeleccionada());
  public loading                 = computed(() => this._loading());
  public error                   = computed(() => this._error());

  // KPIs computados por estado
  public kpiBorradores = computed(() =>
    this._requisiciones().filter(r => r.estado === 'BORRADOR').length
  );
  public kpiEnviadas = computed(() =>
    this._requisiciones().filter(r => r.estado === 'ENVIADA').length
  );
  public kpiEnDespacho = computed(() =>
    this._requisiciones().filter(r => r.estado === 'DESPACHADA').length
  );
  public kpiFirmadas = computed(() =>
    this._requisiciones().filter(r => r.estado === 'FIRMADA').length
  );

  /** Carga el listado completo de requisiciones. */
  loadAll(): void {
    this._loading.set(true);
    this.requisicionesService.getRequisiciones()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de requisiciones');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._requisiciones.set(data));
  }

  /** Carga una requisición específica por ID. */
  cargarRequisicion(id: string): void {
    this._loading.set(true);
    this.requisicionesService.getRequisicionById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la requisición');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._requisicionSeleccionada.set(data ?? null));
  }

  /** Cambia el estado de una requisición y recarga el listado. */
  cambiarEstado(id: string, estado: RequisicionEstado): void {
    this.requisicionesService.cambiarEstado(id, estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cambiar el estado');
          return of(false);
        })
      )
      .subscribe(ok => {
        if (ok) this.loadAll();
      });
  }

  /** Elimina una requisición y recarga el listado. */
  eliminarRequisicion(id: string): void {
    this._loading.set(true);
    this.requisicionesService.eliminarRequisicion(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al eliminar la requisición');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => {
        if (ok) this.loadAll();
      });
  }
}
