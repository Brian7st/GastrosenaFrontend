import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { BienLimpiezaService } from './bien-limpieza.service';
import { BienInactivo, RespuestaLimpieza } from '../models/bien-limpieza.model';

@Injectable({ providedIn: 'root' })
export class BienLimpiezaFacade {
  private readonly service = inject(BienLimpiezaService);

  private readonly _inactivos = signal<BienInactivo[]>([]);
  private readonly _loading = signal(false);
  private readonly _resultado = signal<RespuestaLimpieza | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly inactivos = computed(() => this._inactivos());
  readonly loading = computed(() => this._loading());
  readonly resultado = computed(() => this._resultado());
  readonly error = computed(() => this._error());

  cargarInactivos(): void {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);

    this.service
      .listarInactivos()
      .pipe(
        tap(page => this._inactivos.set(page.content)),
        catchError(() => {
          this._error.set('Error al cargar bienes inactivos');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe();
  }

  ejecutarLimpieza(): void {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    this._resultado.set(null);

    this.service
      .limpiarDesactivados()
      .pipe(
        tap(resultado => {
          this._resultado.set(resultado);
          this.cargarInactivosInterno();
        }),
        catchError(() => {
          this._error.set('Error al ejecutar la limpieza');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe();
  }

  limpiarResultado(): void {
    this._resultado.set(null);
    this._error.set(null);
  }

  private cargarInactivosInterno(): void {
    this.service
      .listarInactivos()
      .pipe(
        tap(page => this._inactivos.set(page.content)),
        catchError(() => of(null)),
      )
      .subscribe();
  }
}
