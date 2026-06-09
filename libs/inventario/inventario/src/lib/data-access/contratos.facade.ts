import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ContratosService } from './services/contratos.service';
import {
  Contrato,
  RegistrarContratoData,
  ResultadoImportacion,
} from '../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratosFacade {
  private contratosService = inject(ContratosService);

  // Estados internos (Signals)
  private _contratos             = signal<Contrato[]>([]);
  private _contratoSeleccionado  = signal<Contrato | undefined>(undefined);
  private _ultimaImportacion     = signal<ResultadoImportacion | null>(null);
  private _loading               = signal<boolean>(false);
  private _error                 = signal<string | null>(null);

  // Exposición pública (solo lectura)
  public contratos            = computed(() => this._contratos());
  public contratoSeleccionado = computed(() => this._contratoSeleccionado());
  public ultimaImportacion    = computed(() => this._ultimaImportacion());
  public loading              = computed(() => this._loading());
  public error                = computed(() => this._error());

  /** Sólo los contratos vigentes — la cascada de precios opera sobre estos. */
  public contratosVigentes = computed(() =>
    this._contratos().filter(c => c.estado === 'VIGENTE'),
  );

  /** GET /catalog/contratos — opcionalmente filtrado por vigencia. */
  cargarContratos(vigencia?: number): void {
    this._loading.set(true);
    this._error.set(null);
    this.contratosService.getContratos(vigencia)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar los contratos');
          return of([]);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._contratos.set(data));
  }

  /** GET /catalog/contratos/{id} */
  cargarContratoById(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.contratosService.getContratoById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle del contrato');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(data => this._contratoSeleccionado.set(data));
  }

  /** POST /catalog/contratos — registra el contrato y recarga la lista. */
  registrarContrato(data: RegistrarContratoData): void {
    this._loading.set(true);
    this._error.set(null);
    this.contratosService.registrarContrato(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar el contrato');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(id => {
        if (id) this.cargarContratos();
      });
  }

  /** POST /catalog/contratos/importar — importa el contrato (crea/actualiza bienes) y recarga. */
  importarContrato(data: RegistrarContratoData): void {
    this._loading.set(true);
    this._error.set(null);
    this._ultimaImportacion.set(null);
    this.contratosService.importarContrato(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al importar el contrato');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(res => {
        if (res) {
          this._ultimaImportacion.set(res);
          this.cargarContratos();
        }
      });
  }

  /** PATCH /catalog/contratos/{id}/cerrar — cierra el contrato y recarga la lista. */
  cerrarContrato(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.contratosService.cerrarContrato(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cerrar el contrato');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(() => this.cargarContratos());
  }
}
