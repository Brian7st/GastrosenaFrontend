import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { PaqueteService } from './services/paquete.service';
import { PaqueteProbatorio } from '../models/paquete.model';

@Injectable({ providedIn: 'root' })
export class PaqueteFacade {
  private paqueteService = inject(PaqueteService);

  // Estados internos (Signals)
  private _paquetes            = signal<PaqueteProbatorio[]>([]);
  private _paqueteSeleccionado = signal<PaqueteProbatorio | null>(null);
  private _loading             = signal<boolean>(false);
  private _error               = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public paquetes            = computed(() => this._paquetes());
  public paqueteSeleccionado = computed(() => this._paqueteSeleccionado());
  public loading             = computed(() => this._loading());
  public error               = computed(() => this._error());

  /** Carga el listado completo de paquetes. */
  loadAll(): void {
    this._loading.set(true);
    this.paqueteService.getPaquetes()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de paquetes');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._paquetes.set(data));
  }

  /** Carga un paquete específico por ID. */
  cargarPaquete(id: string): void {
    this._loading.set(true);
    this.paqueteService.getPaqueteById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el paquete');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._paqueteSeleccionado.set(data ?? null));
  }

  /** Crea un nuevo paquete y recarga el listado. */
  crearPaquete(data: Partial<PaqueteProbatorio>): void {
    this._loading.set(true);
    this.paqueteService.crearPaquete(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear el paquete');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.loadAll();
      });
  }

  /** Adjunta un documento a un paquete y recarga su detalle. */
  adjuntarDocumento(paqueteId: string, file: File): void {
    this.paqueteService.adjuntarDocumento(paqueteId, file)
      .pipe(
        catchError(() => {
          this._error.set('Error al adjuntar el documento');
          return of(false);
        })
      )
      .subscribe(ok => {
        if (ok) this.cargarPaquete(paqueteId);
      });
  }

  /** Archiva el paquete y recarga su detalle. */
  archivarPaquete(id: string): void {
    this._loading.set(true);
    this.paqueteService.archivarPaquete(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al archivar el paquete');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => { if (ok) this.cargarPaquete(id); });
  }

  /** Incluye una requisición en el paquete y recarga su detalle. */
  incluirRequisicion(paqueteId: string, reqId: string): void {
    this.paqueteService.incluirRequisicion(paqueteId, reqId)
      .pipe(
        catchError(() => {
          this._error.set('Error al incluir la requisición');
          return of(false);
        })
      )
      .subscribe(ok => {
        if (ok) this.cargarPaquete(paqueteId);
      });
  }
}
