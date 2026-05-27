import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { GilResponse } from './api/procurement.api';
import { GilesService } from './services/giles.service';

@Injectable({ providedIn: 'root' })
export class GilesFacade {
  private gilesService = inject(GilesService);

  // ── Estado ───────────────────────────────────────────────────────────────────
  private _giles          = signal<GilResponse[]>([]);
  private _gilSeleccionado = signal<GilResponse | null>(null);
  private _totalElements  = signal<number>(0);
  private _loading        = signal<boolean>(false);
  private _error          = signal<string | null>(null);

  // ── Lectura pública ──────────────────────────────────────────────────────────
  public giles           = computed(() => this._giles());
  public gilSeleccionado = computed(() => this._gilSeleccionado());
  public totalElements   = computed(() => this._totalElements());
  public loading         = computed(() => this._loading());
  public error           = computed(() => this._error());

  // ── Acciones ─────────────────────────────────────────────────────────────────

  /** Carga los GILes que habilitan registro de entrada:
   *  estados EMITIDO, ENVIADO_PROVEEDOR y CERRADO.
   *  Pendiente backend B-05: confirmar cuáles estados son válidos. */
  cargarGilesValidados(page = 0, size = 20): void {
    this._loading.set(true);
    this._error.set(null);

    // Cargamos los tres estados válidos en paralelo y los combinamos.
    // Cuando el backend exponga filtro multi-estado esto se simplifica a una sola llamada.
    const estados = ['EMITIDO', 'ENVIADO_PROVEEDOR', 'CERRADO'] as const;
    const resultados: GilResponse[][] = [];
    let pendientes = estados.length;

    estados.forEach(estado => {
      this.gilesService.getGiles({ estado, page, size })
        .pipe(
          catchError(() => of({ content: [] })),
        )
        .subscribe(paged => {
          resultados.push(paged.content ?? []);
          pendientes--;
          if (pendientes === 0) {
            const todos = resultados.flat();
            this._giles.set(todos);
            this._totalElements.set(todos.length);
            this._loading.set(false);
          }
        });
    });
  }

  /** Carga un GIL específico por ID y lo establece como seleccionado. */
  cargarGilById(id: string): void {
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
