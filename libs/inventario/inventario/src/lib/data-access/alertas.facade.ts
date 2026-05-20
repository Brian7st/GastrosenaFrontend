import { inject, Injectable, signal, computed } from '@angular/core';
import { AlertasService } from './services/alertas.service';
import { Alerta } from '../models/alerta.model';
import { finalize, catchError, of, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertasFacade {
  private alertasService = inject(AlertasService);

  // Estados internos (Signals)
  private _alertas = signal<Alerta[]>([]);
  private _alertaSeleccionada = signal<Alerta | undefined>(undefined);
  private _umbrales = signal<any>(null); // Placeholder para umbrales
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public alertas = computed(() => this._alertas());
  public alertaSeleccionada = computed(() => this._alertaSeleccionada());
  public umbrales = computed(() => this._umbrales());
  public loading = computed(() => this._loading());
  public error = computed(() => this._error());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this._loading.set(true);
    this.alertasService.getAlertas()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de alertas');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._alertas.set(data));
  }

  /**
   * Carga una alerta específica por su ID.
   */
  async cargarAlerta(id: string): Promise<Alerta | undefined> {
    this._loading.set(true);
    try {
      const data = await firstValueFrom(this.alertasService.getAlertaById(id));
      this._alertaSeleccionada.set(data);
      return data;
    } catch {
      this._error.set('Error al cargar el detalle de la alerta');
      return undefined;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Resuelve una alerta.
   */
  resolverAlerta(id: string, data: any): void {
    this._loading.set(true);
    this.alertasService.resolverAlerta(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al resolver la alerta');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          // Refrescar datos después de resolver
          this.loadAll();
          if (this._alertaSeleccionada()?.id === id) {
             this.cargarAlerta(id);
          }
        }
      });
  }

  /**
   * Guarda los umbrales de configuración.
   */
  guardarUmbrales(nuevosUmbrales: any): void {
    this._loading.set(true);
    this.alertasService.updateUmbrales(nuevosUmbrales)
      .pipe(
        catchError(() => {
          this._error.set('Error al guardar umbrales');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this._umbrales.set(nuevosUmbrales);
        }
      });
  }
}
