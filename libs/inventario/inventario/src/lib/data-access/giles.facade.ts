import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { GilResponse } from './api/procurement.api';
import { GilesService } from './services/giles.service';

export interface GilesPaginacion {
  totalElements: number;
  totalPages:    number;
  page:          number;
  size:          number;
}

@Injectable({ providedIn: 'root' })
export class GilesFacade {
  private gilesService    = inject(GilesService);
  private readonly PAGE_SIZE = 10;

  // ── Estado ───────────────────────────────────────────────────────────────────
  /** Todos los GILes válidos cargados (combinación de 3 estados). */
  private _gilesTodos      = signal<GilResponse[]>([]);
  private _gilSeleccionado = signal<GilResponse | null>(null);
  private _paginaActual    = signal<number>(0);
  private _loading         = signal<boolean>(false);
  private _error           = signal<string | null>(null);

  // ── Lectura pública ──────────────────────────────────────────────────────────

  /** GILes de la página actual (máx. 10). */
  public giles = computed<GilResponse[]>(() => {
    const start = this._paginaActual() * this.PAGE_SIZE;
    return this._gilesTodos().slice(start, start + this.PAGE_SIZE);
  });

  /** Estado de paginación: totalElements, totalPages, page (0-based), size. */
  public paginacion = computed<GilesPaginacion>(() => ({
    totalElements: this._gilesTodos().length,
    totalPages:    Math.max(1, Math.ceil(this._gilesTodos().length / this.PAGE_SIZE)),
    page:          this._paginaActual(),
    size:          this.PAGE_SIZE,
  }));

  public gilSeleccionado = computed(() => this._gilSeleccionado());
  public loading         = computed(() => this._loading());
  public error           = computed(() => this._error());

  // ── Acciones ─────────────────────────────────────────────────────────────────

  /**
   * Carga todos los GILes válidos para registrar entradas:
   * estados EMITIDO, ENVIADO_PROVEEDOR y CERRADO en paralelo.
   * Usa size=50 por estado para cubrir el volumen operativo normal.
   * Los resultados se combinan y se paginan de a 10 en el cliente.
   */
  cargarGilesValidados(): void {
    this._loading.set(true);
    this._error.set(null);
    this._paginaActual.set(0);

    const estados = ['EMITIDO', 'ENVIADO_PROVEEDOR', 'CERRADO'] as const;
    const buffer: GilResponse[][] = [[], [], []];
    let pendientes = estados.length;

    estados.forEach((estado, idx) => {
      this.gilesService.getGiles({ estado, page: 0, size: 50 })
        .pipe(catchError(() => of({ content: [] as GilResponse[] })))
        .subscribe(paged => {
          buffer[idx] = paged.content ?? [];
          pendientes--;
          if (pendientes === 0) {
            this._gilesTodos.set(buffer.flat());
            this._loading.set(false);
          }
        });
    });
  }

  /**
   * Navega a la página indicada (0-based).
   * No tiene efecto si el índice está fuera de rango.
   */
  irAPagina(page: number): void {
    const total = this.paginacion().totalPages;
    if (page >= 0 && page < total) {
      this._paginaActual.set(page);
    }
  }

  /** Carga un GIL específico por ID con todos sus bienes y lo establece como seleccionado. */
  cargarGilById(id: string): void {
    if (!id) {
      this._gilSeleccionado.set(null);
      return;
    }
    this._loading.set(true);
    this._error.set(null);
    this.gilesService.getGilById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(gil => this._gilSeleccionado.set(gil));
  }

  /** Selecciona un GIL ya cargado en la lista (sin nueva llamada HTTP). */
  seleccionarGil(gil: GilResponse | null): void {
    this._gilSeleccionado.set(gil);
  }

  /** Limpia la selección actual. */
  limpiarSeleccion(): void {
    this._gilSeleccionado.set(null);
  }
}
