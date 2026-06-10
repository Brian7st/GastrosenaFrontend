import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { ActasService } from './services/actas.service';
import {
  ActaLegalizacion,
  InsumoActa,
  CompromisoActa,
  FirmanteActa,
} from '../models/acta.model';
import { CrearActaRequest } from './api/legalization.api';

@Injectable({ providedIn: 'root' })
export class ActasFacade {
  private actasService = inject(ActasService);

  // Estados internos (Signals)
  private _actas            = signal<ActaLegalizacion[]>([]);
  private _actaSeleccionada = signal<ActaLegalizacion | null>(null);
  private _insumos          = signal<InsumoActa[]>([]);
  private _compromisos      = signal<CompromisoActa[]>([]);
  private _firmantes        = signal<FirmanteActa[]>([]);
  private _loading          = signal<boolean>(false);
  private _error            = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public actas            = computed(() => this._actas());
  public actaSeleccionada = computed(() => this._actaSeleccionada());
  public insumos          = computed(() => this._insumos());
  public compromisos      = computed(() => this._compromisos());
  public firmantes        = computed(() => this._firmantes());
  public loading          = computed(() => this._loading());
  public error            = computed(() => this._error());

  /** Carga el listado completo de actas. */
  loadAll(): void {
    this._loading.set(true);
    this.actasService.getActas()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de actas');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._actas.set(data));
  }

  /** Carga un acta por ID. Los sub-endpoints de insumos/firmantes/compromisos
   *  no existen aún en el backend — quedan como arrays vacíos. */
  cargarActa(id: string): void {
    this._loading.set(true);
    this.actasService.getActaById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el acta');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._actaSeleccionada.set(data ?? null));
  }

  /** Crea un nuevo acta. Retorna el ID creado y recarga el listado. */
  crearActa(data: CrearActaRequest): void {
    this._loading.set(true);
    this.actasService.crearActa(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear el acta');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(id => {
        if (id) this.loadAll();
      });
  }

  /** Cambia el estado de un acta (PENDIENTE_FIRMAS, FIRMADA, ARCHIVADA — sin body). */
  cambiarEstado(id: string, estado: ActaLegalizacion['estado']): void {
    this.actasService.cambiarEstado(id, estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cambiar el estado del acta');
          return of(false);
        })
      )
      .subscribe(ok => {
        if (ok) this.cargarActa(id);
      });
  }

  /** POST /legalization/actas/{id}/exportar — genera el .docx del acta. */
  exportarActa(id: string): void {
    this._loading.set(true);
    this.actasService.exportarActa(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar el acta');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  /** POST /legalization/actas/{id}/revisar — revisorId obligatorio (@NotBlank en backend). */
  revisarActa(id: string, revisorId: string): void {
    this._loading.set(true);
    this.actasService.revisarActa(id, revisorId)
      .pipe(
        catchError(() => {
          this._error.set('Error al revisar el acta');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => { if (ok) this.cargarActa(id); });
  }
}
