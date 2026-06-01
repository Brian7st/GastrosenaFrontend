import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { RequisicionesService } from './services/requisiciones.service';
import { Requisicion } from '../models/requisicion.model';

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

  /** Carga requisiciones filtradas por estado (ej: 'DESPACHADA' para habilitar salidas). */
  cargarPorEstado(estado: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.requisicionesService.getRequisicionesByEstado(estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar requisiciones');
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

  /** PATCH /legalization/requisiciones/{id}/despachar — economoId obligatorio */
  despacharRequisicion(id: string, economoId: string): void {
    this._loading.set(true);
    this.requisicionesService.despacharRequisicion(id, economoId)
      .pipe(
        catchError(() => {
          this._error.set('Error al despachar la requisición');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => { if (ok) this.loadAll(); });
  }

  /** PATCH /legalization/requisiciones/{id}/firmar — voceroId obligatorio */
  firmarRequisicion(id: string, voceroId: string): void {
    this._loading.set(true);
    this.requisicionesService.firmarRequisicion(id, voceroId)
      .pipe(
        catchError(() => {
          this._error.set('Error al firmar la requisición');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => { if (ok) this.loadAll(); });
  }

  /** POST /legalization/requisiciones/{id}/exportar — genera el .docx */
  exportarRequisicion(id: string): void {
    this.requisicionesService.exportarRequisicion(id)
      .pipe(catchError(() => { this._error.set('Error al exportar la requisición'); return of(null); }))
      .subscribe();
  }

  /** POST /legalization/requisiciones — crea una nueva requisición */
  crearRequisicion(data: Partial<Requisicion>): void {
    this._loading.set(true);
    this._error.set(null);
    this.requisicionesService.crearRequisicion(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear la requisición');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.loadAll();
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
