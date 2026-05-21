import { inject, Injectable, signal, computed } from '@angular/core';
import { SolicitudGil, SolicitudesGilFiltros, EstadoGil, CrearSolicitudData, ActualizarSolicitudData } from '../models/solicitudes-gil.model';
import { SolicitudesService } from './services/solicitudes.service';
import { finalize, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesFacade {
  private solicitudesService = inject(SolicitudesService);

  // Estados internos (Signals)
  private _solicitudes = signal<SolicitudGil[]>([]);
  private _loading = signal<boolean>(false);
  private _filtros = signal<SolicitudesGilFiltros>({});
  private _solicitudSeleccionada = signal<SolicitudGil | undefined>(undefined);
  private _error = signal<string | null>(null);

  // Exposición pública (Solo lectura)
  public solicitudes = computed(() => this._solicitudes());
  public loading = computed(() => this._loading());
  public filtros = computed(() => this._filtros());
  public solicitudSeleccionada = computed(() => this._solicitudSeleccionada());
  public error = computed(() => this._error());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this.cargarSolicitudes();
  }

  /**
   * Carga el listado de solicitudes aplicando los filtros actuales.
   */
  cargarSolicitudes(filtros?: SolicitudesGilFiltros): void {
    if (filtros) this._filtros.set(filtros);
    
    this._loading.set(true);
    this.solicitudesService.getSolicitudes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de solicitudes');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._solicitudes.set(data));
  }

  /**
   * Carga una solicitud específica por su ID.
   */
  cargarSolicitudById(id: string): void {
    this._loading.set(true);
    this.solicitudesService.getSolicitudById(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar el detalle de la solicitud');
          return of(undefined);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._solicitudSeleccionada.set(data));
  }

  /**
   * Actualiza los filtros y recarga la lista.
   */
  setFiltros(filtros: SolicitudesGilFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros });
    this.cargarSolicitudes();
  }

  /**
   * Crea una nueva solicitud y recarga el listado.
   */
  crearSolicitud(data: CrearSolicitudData): void {
    this._loading.set(true);
    this.solicitudesService.crearSolicitud(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear la solicitud');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(result => {
        if (result) this.cargarSolicitudes();
      });
  }

  /**
   * Actualiza una solicitud existente y recarga el detalle.
   */
  actualizarSolicitud(id: string, data: ActualizarSolicitudData): void {
    this._loading.set(true);
    this.solicitudesService.actualizarSolicitud(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al actualizar la solicitud');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(result => {
        if (result) this.cargarSolicitudById(id);
      });
  }

  /**
   * Cambia el estado de una solicitud.
   */
  cambiarEstado(id: string, estado: EstadoGil): void {
    this._loading.set(true);
    this.solicitudesService.cambiarEstado(id, estado)
      .pipe(
        catchError(() => {
          this._error.set('Error al cambiar el estado de la solicitud');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(success => {
        if (success) this.cargarSolicitudById(id);
      });
  }

  /**
   * Elimina una solicitud y refresca los datos.
   */
  eliminarSolicitud(codigo: string): void {
    this._loading.set(true);
    this.solicitudesService.deleteSolicitud(codigo)
      .pipe(
        catchError(() => {
          this._error.set('Error al eliminar la solicitud');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe((success) => {
        if (success) {
          this.cargarSolicitudes();
        }
      });
  }
}
