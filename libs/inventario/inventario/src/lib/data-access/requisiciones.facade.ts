import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of, tap, throwError, Observable } from 'rxjs';
import { RequisicionesService } from './services/requisiciones.service';
import { Requisicion } from '../models/requisicion.model';
import { descargarBlob } from '../util';

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

  /** PATCH /legalization/requisiciones/{id}/enviar — transición BORRADOR → ENVIADA */
  enviarRequisicion(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.requisicionesService.enviarRequisicion(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al enviar la requisición');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => {
        if (!ok) return;
        // Actualización optimista: tras el PATCH /enviar, la proyección de lista del backend
        // puede tardar en reflejar ENVIADA, lo que dejaba el tablero desactualizado hasta
        // recargar. Reflejamos el nuevo estado de inmediato (kanban) y reconciliamos el
        // detalle con el backend por-id (la lista se revalida en el próximo montaje del tablero).
        this._requisiciones.update(list =>
          list.map(r => r.id === id ? { ...r, estado: 'ENVIADA' as const } : r)
        );
        this._requisicionSeleccionada.update(r =>
          r && r.id === id ? { ...r, estado: 'ENVIADA' as const } : r
        );
        this.cargarRequisicion(id);
      });
  }

  /**
   * PATCH /legalization/requisiciones/{id}/despachar — economoId obligatorio.
   * Devuelve el observable para que la pantalla controle navegación/errores; al
   * confirmar, refleja la transición en el kanban sin recargar la página.
   */
  despacharRequisicion(id: string, economoId: string): Observable<boolean> {
    this._loading.set(true);
    this._error.set(null);
    return this.requisicionesService.despacharRequisicion(id, economoId).pipe(
      tap(ok => { if (ok) this.aplicarTransicion(id, 'DESPACHADA'); }),
      catchError(err => {
        this._error.set('Error al despachar la requisición');
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * PATCH /legalization/requisiciones/{id}/firmar — voceroId obligatorio.
   * Devuelve el observable para que la pantalla controle navegación/errores; al
   * confirmar, refleja la transición en el kanban sin recargar la página.
   */
  firmarRequisicion(id: string, voceroId: string): Observable<boolean> {
    this._loading.set(true);
    this._error.set(null);
    return this.requisicionesService.firmarRequisicion(id, voceroId).pipe(
      tap(ok => { if (ok) this.aplicarTransicion(id, 'FIRMADA'); }),
      catchError(err => {
        this._error.set('Error al firmar la requisición');
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Refleja un cambio de estado de inmediato en la lista y el detalle (kanban
   * reactivo, sin recargar la página). La proyección de lista del backend puede
   * tardar en reflejar la transición, por eso actualizamos el signal de forma
   * optimista y reconciliamos el detalle por-id.
   */
  private aplicarTransicion(id: string, estado: Requisicion['estado']): void {
    this._requisiciones.update(list =>
      list.map(r => r.id === id ? { ...r, estado } : r)
    );
    this._requisicionSeleccionada.update(r =>
      r && r.id === id ? { ...r, estado } : r
    );
    this.cargarRequisicion(id);
  }

  /** Exporta la requisición — descarga el PDF generado por el microservicio de reportes. */
  exportarRequisicion(id: string): void {
    this.requisicionesService.exportarRequisicion(id)
      .pipe(catchError(() => { this._error.set('Error al exportar la requisición'); return of(null); }))
      .subscribe(blob => {
        if (blob) descargarBlob(blob, `requisicion_${id}.pdf`);
      });
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
