import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { ConfiguracionService } from './configuracion.service';
import {
  ConfiguracionCompleta,
  ConfiguracionFacturacion,
  ConfiguracionGeneral,
  ConfiguracionInventario,
  ConfiguracionNotificaciones,
  ConfiguracionSeguridad,
} from '../models/configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionFacade {
  private readonly service = inject(ConfiguracionService);

  private readonly _config = signal<ConfiguracionCompleta | null>(null);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _success = signal<string | null>(null);

  readonly config = computed(() => this._config());
  readonly loading = computed(() => this._loading());
  readonly saving = computed(() => this._saving());
  readonly error = computed(() => this._error());
  readonly success = computed(() => this._success());

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

  actualizarGeneral(data: ConfiguracionGeneral): void {
    this._saving.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .actualizarGeneral(data)
      .pipe(
        tap(res => {
          this._config.update(c => (c ? { ...c, general: res } : c));
          this._success.set('Configuración general guardada');
        }),
        catchError(() => {
          this._error.set('Error al guardar configuración general');
          return of(null);
        }),
        finalize(() => this._saving.set(false)),
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

  actualizarFacturacion(data: ConfiguracionFacturacion): void {
    this._saving.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .actualizarFacturacion(data)
      .pipe(
        tap(res => {
          this._config.update(c => (c ? { ...c, facturacion: res } : c));
          this._success.set('Configuración de facturación guardada');
        }),
        catchError(() => {
          this._error.set('Error al guardar configuración de facturación');
          return of(null);
        }),
        finalize(() => this._saving.set(false)),
      )
      .subscribe();
  }

  actualizarInventario(data: ConfiguracionInventario): void {
    this._saving.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .actualizarInventario(data)
      .pipe(
        tap(res => {
          this._config.update(c => (c ? { ...c, inventario: res } : c));
          this._success.set('Configuración de inventario guardada');
        }),
        catchError(() => {
          this._error.set('Error al guardar configuración de inventario');
          return of(null);
        }),
        finalize(() => this._saving.set(false)),
      )
      .subscribe();
  }

  actualizarNotificaciones(data: ConfiguracionNotificaciones): void {
    this._saving.set(true);
    this._error.set(null);
    this._success.set(null);

    this.service
      .actualizarNotificaciones(data)
      .pipe(
        tap(res => {
          this._config.update(c => (c ? { ...c, notificaciones: res } : c));
          this._success.set('Configuración de notificaciones guardada');
        }),
        catchError(() => {
          this._error.set('Error al guardar configuración de notificaciones');
          return of(null);
        }),
        finalize(() => this._saving.set(false)),
      )
      .subscribe();
  }

  limpiarMensajes(): void {
    this._error.set(null);
    this._success.set(null);
  }
}
