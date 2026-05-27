import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudGil, SolicitudesGilFiltros, SolicitudesPaginacion, EstadoGil, CrearSolicitudData, ActualizarSolicitudData } from '../models/solicitudes-gil.model';
import {
  SolicitudSesion,
  CrearSolicitudSesionData,
  AprobarSesionData,
  RechazarSesionData,
} from '../models/solicitud-sesion.model';
import { SolicitudesService } from './services/solicitudes.service';
import { EnviarProveedorRequest } from './api/sourcing.api';
import { finalize, catchError, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesFacade {
  private solicitudesService = inject(SolicitudesService);

  // ── Estado GIL (Procurement) ───────────────────────────────────────────────
  private _solicitudes           = signal<SolicitudGil[]>([]);
  private _loading               = signal<boolean>(false);
  private _filtros               = signal<SolicitudesGilFiltros>({ page: 0, size: 10 });
  private _paginacion            = signal<SolicitudesPaginacion>({ totalElements: 0, totalPages: 0, page: 0, size: 10 });
  private _solicitudSeleccionada = signal<SolicitudGil | undefined>(undefined);
  private _error                 = signal<string | null>(null);

  // ── Estado Training/Solicitudes ────────────────────────────────────────────
  private _solicitudSesionSeleccionada = signal<SolicitudSesion | undefined>(undefined);

  // ── Exposición pública ─────────────────────────────────────────────────────
  public solicitudes                  = computed(() => this._solicitudes());
  public loading                      = computed(() => this._loading());
  public filtros                      = computed(() => this._filtros());
  public paginacion                   = computed(() => this._paginacion());
  public solicitudSeleccionada        = computed(() => this._solicitudSeleccionada());
  public error                        = computed(() => this._error());
  public solicitudSesionSeleccionada  = computed(() => this._solicitudSesionSeleccionada());

  /**
   * Carga inicial de datos.
   */
  loadAll(): void {
    this.cargarSolicitudes();
  }

  /**
   * Carga el listado de solicitudes aplicando los filtros actuales.
   * Si se pasan filtros nuevos (búsqueda, estado, etc.) se resetea a page 0.
   */
  cargarSolicitudes(filtros?: SolicitudesGilFiltros): void {
    if (filtros) {
      this._filtros.set({ ...this._filtros(), ...filtros, page: 0 });
    }

    this._loading.set(true);
    this.solicitudesService.getSolicitudes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de solicitudes');
          return of({ solicitudes: [], paginacion: { totalElements: 0, totalPages: 0, page: 0, size: 10 } });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ solicitudes, paginacion }) => {
        this._solicitudes.set(solicitudes);
        this._paginacion.set(paginacion);
      });
  }

  /**
   * Navega a una página específica sin cambiar el resto de filtros.
   */
  irAPagina(page: number): void {
    this._filtros.update(f => ({ ...f, page }));
    this._loading.set(true);
    this.solicitudesService.getSolicitudes(this._filtros())
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la lista de solicitudes');
          return of({ solicitudes: [], paginacion: this._paginacion() });
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(({ solicitudes, paginacion }) => {
        this._solicitudes.set(solicitudes);
        this._paginacion.set(paginacion);
      });
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
   * Actualiza los filtros, resetea a página 0 y recarga la lista.
   */
  setFiltros(filtros: SolicitudesGilFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros, page: 0 });
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
   * Actualiza un GIL en estado BORRADOR vía PATCH.
   * Retorna Observable<boolean> para que el componente pueda reaccionar al resultado.
   * 200 → true | 400/404/409/422 → false (y setea _error con mensaje legible).
   */
  actualizarSolicitud(id: string, data: ActualizarSolicitudData): Observable<boolean> {
    this._loading.set(true);
    this._error.set(null);
    return this.solicitudesService.actualizarSolicitud(id, data)
      .pipe(
        map(() => {
          this.cargarSolicitudById(id);
          return true;
        }),
        catchError((err: unknown) => {
          const httpErr = err as { status?: number; error?: { violations?: { message: string }[]; detail?: string } };
          if (httpErr.status === 404) {
            this._error.set('GIL no encontrado');
          } else if (httpErr.status === 409) {
            this._error.set('Solo se pueden editar GILes en estado Borrador');
          } else if (httpErr.status === 400) {
            const violations = httpErr.error?.violations ?? [];
            const msg = violations.length > 0
              ? violations.map(v => v.message).join('. ')
              : 'Datos inválidos — revisá los campos del formulario';
            this._error.set(msg);
          } else if (httpErr.status === 422) {
            this._error.set(httpErr.error?.detail ?? 'Error de validación semántica');
          } else {
            this._error.set('Error al actualizar la solicitud');
          }
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      );
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

  /** PUT /procurement/giles/{id}/enviar-proveedor con proveedorDestinatarioId y fechaEnvio */
  enviarAProveedor(id: string, data: EnviarProveedorRequest): void {
    this._loading.set(true);
    this.solicitudesService.enviarAProveedor(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al enviar el GIL al proveedor');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(ok => { if (ok) this.cargarSolicitudById(id); });
  }

  generarGils(ids: (string | number)[]): void {
    this._loading.set(true);
    this.solicitudesService.generarGils(ids)
      .pipe(
        catchError(() => {
          this._error.set('Error al generar los GIL');
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

  // ─────────────────────────────────────────────────────────────────────────
  // Training — /api/v1/training/solicitudes
  // ─────────────────────────────────────────────────────────────────────────

  /** POST /training/solicitudes — crea la solicitud y la deja seleccionada */
  crearSolicitudSesion(data: CrearSolicitudSesionData): void {
    this._loading.set(true);
    this._error.set(null);
    this.solicitudesService.crearSolicitudSesion(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al crear la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this._solicitudSesionSeleccionada.set(res);
      });
  }

  /** PATCH /training/solicitudes/{id}/aprobar */
  aprobarSolicitudSesion(id: string, data: AprobarSesionData): void {
    this._loading.set(true);
    this._error.set(null);
    this.solicitudesService.aprobarSolicitudSesion(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al aprobar la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this._solicitudSesionSeleccionada.set(res);
      });
  }

  /** PATCH /training/solicitudes/{id}/rechazar */
  rechazarSolicitudSesion(id: string, data: RechazarSesionData): void {
    this._loading.set(true);
    this._error.set(null);
    this.solicitudesService.rechazarSolicitudSesion(id, data)
      .pipe(
        catchError(() => {
          this._error.set('Error al rechazar la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this._solicitudSesionSeleccionada.set(res);
      });
  }

  /** PATCH /training/solicitudes/{id}/comprometer */
  comprometerSolicitudSesion(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.solicitudesService.comprometerSolicitudSesion(id)
      .pipe(
        catchError(() => {
          this._error.set('Error al comprometer la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res !== null) this._solicitudSesionSeleccionada.set(res);
      });
  }
}
