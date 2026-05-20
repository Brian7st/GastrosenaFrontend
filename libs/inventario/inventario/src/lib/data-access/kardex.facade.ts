import { inject, Injectable, signal, computed } from '@angular/core';
import { Movimiento } from '../models/movimiento.model';
import { MovimientosService } from './services/movimientos.service';
import { finalize, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexFacade {
  private movimientosService = inject(MovimientosService);

  private _movimientos = signal<Movimiento[]>([]);
  private _movimientoSeleccionado = signal<Movimiento | undefined>(undefined);
  private _loading = signal<boolean>(false);

  public movimientos = computed(() => this._movimientos());
  public movimientoSeleccionado = computed(() => this._movimientoSeleccionado());
  public loading = computed(() => this._loading());

  loadAll(): void {
    this._loading.set(true);
    this.movimientosService.getMovimientos()
      .pipe(
        catchError(() => of([])),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._movimientos.set(data));
  }

  cargarMovimiento(id: string): void {
    this._loading.set(true);
    this.movimientosService.getMovimientoById(id)
      .pipe(
        catchError(() => of(undefined)),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._movimientoSeleccionado.set(data));
  }

  registrarEntrada(data: any): void {
    this._loading.set(true);
    this.movimientosService.registrarEntrada(data)
      .pipe(
        catchError(() => of(null)),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res) this.loadAll();
      });
  }

  registrarSalida(data: any): void {
    this._loading.set(true);
    this.movimientosService.registrarSalida(data)
      .pipe(
        catchError(() => of(null)),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res) this.loadAll();
      });
  }
}
