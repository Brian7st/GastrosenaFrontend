import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { ConfiguracionService } from './configuracion.service';
import { ThemeSettingsService } from './theme-settings.service';
import {
  ConfiguracionApariencia,
  ConfiguracionAvanzado,
  ConfiguracionCompleta,
  ConfiguracionSeguridad,
} from '../models/configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionFacade {
  private readonly service = inject(ConfiguracionService);
  private readonly themeSettings = inject(ThemeSettingsService);

  private readonly _config = signal<ConfiguracionCompleta | null>(null);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _success = signal<string | null>(null);

  private readonly _apariencia = signal<ConfiguracionApariencia>(
    this.themeSettings.obtenerApariencia(),
  );
  private readonly _avanzado = signal<ConfiguracionAvanzado>(
    this.themeSettings.obtenerAvanzado(),
  );

  readonly config = computed(() => this._config());
  readonly loading = computed(() => this._loading());
  readonly saving = computed(() => this._saving());
  readonly error = computed(() => this._error());
  readonly success = computed(() => this._success());
  readonly apariencia = computed(() => this._apariencia());
  readonly avanzado = computed(() => this._avanzado());

  cargarConfig(): void {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);

    this.service
      .obtenerConfig()
      .pipe(
        tap(config => this._config.set(config)),
        catchError(() => {
          this._error.set('Error al cargar la configuración');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe();
  }

  actualizarSeguridad(data: ConfiguracionSeguridad): void {
    this._saving.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .actualizarSeguridad(data)
      .pipe(
        tap(res => {
          this._config.update(c => (c ? { ...c, seguridad: res } : c));
          this._success.set('Configuración de seguridad guardada');
        }),
        catchError(() => {
          this._error.set('Error al guardar configuración de seguridad');
          return of(null);
        }),
        finalize(() => this._saving.set(false)),
      )
      .subscribe();
  }

  actualizarApariencia(data: ConfiguracionApariencia): void {
    this.themeSettings.guardarApariencia(data);
    this._apariencia.set(data);
    this._success.set('Apariencia actualizada');
  }

  actualizarAvanzado(data: ConfiguracionAvanzado): void {
    this.themeSettings.guardarAvanzado(data);
    this._avanzado.set(data);
    this._success.set('Configuración avanzada guardada');
  }

  limpiarMensajes(): void {
    this._error.set(null);
    this._success.set(null);
  }
}
