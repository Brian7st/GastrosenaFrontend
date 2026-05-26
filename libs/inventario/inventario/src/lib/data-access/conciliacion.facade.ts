import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { ConciliacionService } from './services/conciliacion.service';
import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  DiferenciaItem,
  TomaFisicaItem,
  ConteoItemData,
} from '../models/conciliacion.model';
import { IniciarConciliacionRequest } from './api/reconciliation.api';

@Injectable({
  providedIn: 'root',
})
export class ConciliacionFacade {
  private conciliacionService = inject(ConciliacionService);

  // ─────────────── Estado interno (privado) ───────────────
  private _conciliaciones            = signal<ConciliacionRegistro[]>([]);
  private _conciliacionSeleccionada  = signal<ConciliacionDetalle | undefined>(undefined);
  private _diferenciasList           = signal<DiferenciaItem[]>([]);
  private _tomaFisicaItems           = signal<TomaFisicaItem[]>([]);
  private _loading                   = signal<boolean>(false);
  private _error                     = signal<string | null>(null);

  // ─────────────── Exposición pública (solo lectura) ───────────────
  public conciliaciones           = computed(() => this._conciliaciones());
  public conciliacionSeleccionada = computed(() => this._conciliacionSeleccionada());
  public diferenciasList          = computed(() => this._diferenciasList());
  public tomaFisicaItems          = computed(() => this._tomaFisicaItems());
  public loading                  = computed(() => this._loading());
  public error                    = computed(() => this._error());

  // ─────────────── KPIs derivados ───────────────
  public totalConciliaciones = computed(() => this._conciliaciones().length);
  public precisionPromedio = computed(() => {
    const items = this._conciliaciones();
    if (items.length === 0) return 0;
    return Math.round(items.reduce((acc, c) => acc + c.precision, 0) / items.length);
  });
  public diferenciasTotal = computed(() =>
    this._conciliaciones().reduce((acc, c) => acc + c.itemsDif, 0)
  );

  /**
   * Carga inicial: obtiene la lista completa de conciliaciones.
   */
  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .getConciliaciones()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar las conciliaciones');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((data) => this._conciliaciones.set(data));
  }

  /**
   * Carga el detalle de una conciliación específica y sus diferencias.
   */
  cargarConciliacion(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .getConciliacionById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle de la conciliación');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((data) => this._conciliacionSeleccionada.set(data));

    this.conciliacionService
      .getDiferenciasByConciliacion(id)
      .pipe(catchError(() => of([])))
      .subscribe((data) => this._diferenciasList.set(data));
  }

  /** Carga los ítems de la sesión de toma física activa. */
  cargarTomaFisicaItems(): void {
    this._loading.set(true);
    this.conciliacionService
      .getTomaFisicaItems()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los ítems de toma física');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((data) => this._tomaFisicaItems.set(data));
  }

  /**
   * Inicia una nueva toma física de inventario.
   * responsableId, responsableNombre, tipo y fecha son @NotNull en backend.
   */
  iniciarTomaFisica(data: IniciarConciliacionRequest): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .iniciarTomaFisica(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al iniciar la toma física');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => {
        this.loadAll();
      });
  }

  /**
   * Registra el conteo físico de los ítems y recarga el detalle de la conciliación.
   */
  registrarConteo(id: string, items: ConteoItemData[]): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .registrarConteo(id, items)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar el conteo físico');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this.cargarConciliacion(id);
      });
  }

  /**
   * Resuelve una diferencia de inventario con su justificación y recarga el detalle.
   */
  resolverDiferencia(id: string, diferenciaId: string, justificacion: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .resolverDiferencia(id, diferenciaId, justificacion)
      .pipe(
        catchError(() => {
          this._error.set('Error al resolver la diferencia');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this.cargarConciliacion(id);
      });
  }

  /**
   * Cierra y finaliza una conciliación existente.
   */
  cerrarConciliacion(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .cerrarConciliacion(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cerrar la conciliación');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => {
        // Refresca la lista tras cerrar
        this.loadAll();
      });
  }
}
