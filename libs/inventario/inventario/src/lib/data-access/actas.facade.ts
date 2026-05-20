import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { ActasService } from './services/actas.service';
import {
  ActaLegalizacion,
  InsumoActa,
  CompromisoActa,
  FirmanteActa,
} from '../models/acta.model';

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

  /** Carga un acta por ID junto con sus insumos, compromisos y firmantes. */
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
      .subscribe(data => {
        this._actaSeleccionada.set(data ?? null);
        if (data) {
          this.actasService.getInsumosByActa(id)
            .subscribe(i => this._insumos.set(i));
          this.actasService.getCompromisosByActa(id)
            .subscribe(c => this._compromisos.set(c));
          this.actasService.getFirmantesByActa(id)
            .subscribe(f => this._firmantes.set(f));
        }
      });
  }

  /** Crea un nuevo acta y recarga el listado. */
  crearActa(data: Partial<ActaLegalizacion>): void {
    this._loading.set(true);
    this.actasService.crearActa(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear el acta');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res) this.loadAll();
      });
  }

  /** Cambia el estado de un acta y recarga su detalle. */
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
}
