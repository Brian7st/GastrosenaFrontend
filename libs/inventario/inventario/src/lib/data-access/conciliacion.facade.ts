import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of, switchMap, map } from 'rxjs';
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
  private _ultimaConciliacionId      = signal<string | null>(null);

  // ─────────────── Exposición pública (solo lectura) ───────────────
  public conciliaciones           = computed(() => this._conciliaciones());
  public conciliacionSeleccionada = computed(() => this._conciliacionSeleccionada());
  public diferenciasList          = computed(() => this._diferenciasList());
  public tomaFisicaItems          = computed(() => this._tomaFisicaItems());
  public loading                  = computed(() => this._loading());
  public error                    = computed(() => this._error());
  public ultimaConciliacionId     = computed(() => this._ultimaConciliacionId());

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

  /** Top 3 conciliaciones con más ítems en diferencia */
  public topPorDiferencias = computed(() =>
    [...this._conciliaciones()]
      .filter(c => c.itemsDif > 0)
      .sort((a, b) => b.itemsDif - a.itemsDif)
      .slice(0, 3)
      .map(c => ({
        label:      c.id,
        diferencia: c.itemsDif,
        fecha:      c.fecha,
      }))
  );

  /** Fecha de la conciliación más reciente (o null si no hay ninguna) */
  public ultimaFecha = computed(() => {
    const list = this._conciliaciones();
    if (list.length === 0) return null;
    return list.reduce((prev, cur) => (cur.fecha > prev.fecha ? cur : prev)).fecha;
  });

  /**
   * Tendencia mensual: agrupa conciliaciones por mes (últimos 6 meses),
   * calcula promedio de precisión y suma de ítems totales por mes.
   */
  public tendenciaMensual = computed(() => {
    const meses: Record<string, { sumaPrecision: number; sumaItems: number; count: number }> = {};

    for (const c of this._conciliaciones()) {
      const mes = c.fecha.slice(0, 7); // 'YYYY-MM'
      if (!meses[mes]) meses[mes] = { sumaPrecision: 0, sumaItems: 0, count: 0 };
      meses[mes].sumaPrecision += c.precision;
      meses[mes].sumaItems    += c.itemsTotal;
      meses[mes].count        += 1;
    }

    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([mes, v]) => ({
        mes,
        label:     new Date(mes + '-01').toLocaleString('es-CO', { month: 'short' }),
        precision: Math.round(v.sumaPrecision / v.count),
        items:     v.sumaItems,
        isCurrent: false,
      }))
      .map((entry, _i, arr) => ({ ...entry, isCurrent: entry.mes === arr[arr.length - 1].mes }));
  });

  /**
   * Agrupa los ítems del catálogo por categoría.
   * Se alimenta del mismo endpoint /catalogo que usa la toma física,
   * por lo que solo contiene productos activos con stock real.
   */
  public categoriasSummary = computed(() => {
    const items = this._tomaFisicaItems();
    const grouped = new Map<string, number>();
    for (const item of items) {
      const cat = item.categoria?.trim() || 'Sin categoría';
      grouped.set(cat, (grouped.get(cat) ?? 0) + 1);
    }
    return Array.from(grouped.entries())
      .map(([nombre, totalItems]) => ({ nombre, totalItems }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

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
   * Carga el detalle de una conciliación y sus diferencias en una sola llamada.
   * El backend embebe las diferencias en GET /{id} — no existe endpoint separado.
   */
  cargarConciliacion(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.conciliacionService
      .getConciliacionConDiferencias(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle de la conciliación');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(result => {
        if (result) {
          this._conciliacionSeleccionada.set(result.detalle);
          this._diferenciasList.set(result.diferencias);
        }
      });
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
   * Flujo completo de toma física:
   * 1. Crea la sesión de conciliación (POST /conciliaciones)
   * 2. Registra el conteo de todos los ítems (POST /conciliaciones/{id}/conteo)
   * Al completar, expone el ID de la nueva conciliación en `ultimaConciliacionId`.
   */
  finalizarTomaFisica(data: IniciarConciliacionRequest, items: ConteoItemData[]): void {
    this._loading.set(true);
    this._error.set(null);
    this._ultimaConciliacionId.set(null);

    this.conciliacionService.iniciarTomaFisica(data)
      .pipe(
        switchMap(({ id }) =>
          this.conciliacionService.registrarConteo(id, items).pipe(map(() => id))
        ),
        catchError(() => {
          this._error.set('Error al finalizar la toma física');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(id => {
        if (id) this._ultimaConciliacionId.set(id);
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
