import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SolicitudGil, SolicitudesGilFiltros, SolicitudesPaginacion, EstadoGil, CrearSolicitudData, ActualizarSolicitudData, GenerarGilData } from '../models/solicitudes-gil.model';
import {
  SolicitudSesion,
  CrearSolicitudSesionData,
  ActualizarSolicitudSesionData,
  AprobarSesionData,
  RechazarSesionData,
} from '../models/solicitud-sesion.model';
import { SolicitudesService } from './services/solicitudes.service';
import { EnviarProveedorRequest } from './api/sourcing.api';
import { finalize, catchError, of, map, EMPTY, tap } from 'rxjs';
import { descargarBlob } from '../util';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesFacade {
  private solicitudesService = inject(SolicitudesService);

  // ── Estado GIL (Procurement) ───────────────────────────────────────────────
  private _solicitudes              = signal<SolicitudGil[]>([]);
  private _loading                  = signal<boolean>(false);
  private _cargarByIdSub?: Subscription;
  private _filtros               = signal<SolicitudesGilFiltros>({ page: 0, size: 10 });
  private _paginacion            = signal<SolicitudesPaginacion>({ totalElements: 0, totalPages: 0, page: 0, size: 10 });
  private _solicitudSeleccionada = signal<SolicitudGil | undefined>(undefined);
  private _error                 = signal<string | null>(null);

  // ── Estado Training/Solicitudes ────────────────────────────────────────────
  private _solicitudesSesion           = signal<SolicitudSesion[]>([]);
  private _loadingSesion               = signal<boolean>(false);
  private _errorSesion                 = signal<string | null>(null);
  private _solicitudSesionSeleccionada = signal<SolicitudSesion | undefined>(undefined);
  private _paginacionSesion            = signal<{ totalElements: number; totalPages: number; page: number; size: number }>({ totalElements: 0, totalPages: 0, page: 0, size: 20 });
  private _filtrosSesion               = signal<{ instructorId?: string; estado?: string; page: number; size: number }>({ page: 0, size: 20 });

  // ── Exposición pública ─────────────────────────────────────────────────────
  public solicitudes                  = computed(() => this._solicitudes());
  public loading                      = computed(() => this._loading());
  public filtros                      = computed(() => this._filtros());
  public paginacion                   = computed(() => this._paginacion());
  public solicitudSeleccionada        = computed(() => this._solicitudSeleccionada());
  public error                        = computed(() => this._error());
  public solicitudesSesion            = computed(() => this._solicitudesSesion());
  public loadingSesion                = computed(() => this._loadingSesion());
  public errorSesion                  = computed(() => this._errorSesion());
  public solicitudSesionSeleccionada  = computed(() => this._solicitudSesionSeleccionada());
  public paginacionSesion             = computed(() => this._paginacionSesion());

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
    // Cancela cualquier fetch anterior en vuelo para evitar race conditions
    this._cargarByIdSub?.unsubscribe();
    this._solicitudSeleccionada.set(undefined); // limpia datos del GIL anterior
    this._loading.set(true);
    this._cargarByIdSub = this.solicitudesService.getSolicitudById(id)
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
  limpiarSolicitudSeleccionada(): void {
    this._solicitudSeleccionada.set(undefined);
  }

  crearSolicitud(data: CrearSolicitudData): Observable<boolean> {
    this._loading.set(true);
    this._error.set(null);
    return this.solicitudesService.crearSolicitud(data)
      .pipe(
        map(result => {
          if (result) this.cargarSolicitudes();
          return !!result;
        }),
        catchError(() => {
          this._error.set('Error al crear la solicitud');
          return of(false);
        }),
        finalize(() => this._loading.set(false))
      );
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
   * Elimina un GIL por su UUID y refresca el listado.
   * Solo GILes en estado BORRADOR pueden eliminarse (backend devuelve 409 si no).
   */
  eliminarSolicitud(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.solicitudesService.deleteSolicitud(id)
      .pipe(
        catchError((err: unknown) => {
          const httpErr = err as { status?: number };
          if (httpErr.status === 404) {
            this._error.set('GIL no encontrado');
          } else if (httpErr.status === 409) {
            this._error.set('Solo se pueden eliminar GILes en estado Borrador');
          } else {
            this._error.set('Error al eliminar la solicitud');
          }
          return EMPTY;
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(() => this.cargarSolicitudes());
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

  generarGils(data: GenerarGilData): Observable<SolicitudGil | null> {
    this._loading.set(true);
    this._error.set(null);
    return this.solicitudesService.generarGils(data)
      .pipe(
        catchError(() => {
          this._error.set('Error al generar el GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Training — /api/v1/training/solicitudes
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /training/solicitudes — carga la lista de solicitudes de sesión (paginada) */
  cargarSolicitudesSesion(filtros?: { instructorId?: string; estado?: string }): void {
    if (filtros) {
      this._filtrosSesion.set({ ...this._filtrosSesion(), ...filtros, page: 0 });
    }
    this._loadingSesion.set(true);
    this._errorSesion.set(null);
    this.solicitudesService.getSolicitudesSesion(this._filtrosSesion())
      .pipe(
        catchError(() => {
          this._errorSesion.set('Error al cargar las solicitudes de sesión');
          return of({ solicitudes: [], paginacion: { totalElements: 0, totalPages: 0, page: 0, size: 20 } });
        }),
        finalize(() => this._loadingSesion.set(false))
      )
      .subscribe(({ solicitudes, paginacion }) => {
        this._solicitudesSesion.set(solicitudes);
        this._paginacionSesion.set(paginacion);
      });
  }

  /** Navega a una página específica de solicitudes de sesión */
  irAPaginaSesion(page: number): void {
    this._filtrosSesion.update(f => ({ ...f, page }));
    this.cargarSolicitudesSesion();
  }

  /** GET /training/solicitudes/{id} — carga una solicitud de sesión por su ID */
  cargarSolicitudSesionById(id: string): void {
    this._loadingSesion.set(true);
    this._errorSesion.set(null);
    this.solicitudesService.getSolicitudSesionById(id)
      .pipe(
        catchError(() => {
          this._errorSesion.set('Error al cargar la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loadingSesion.set(false))
      )
      .subscribe(res => {
        if (res !== null) this._solicitudSesionSeleccionada.set(res);
      });
  }

  /** PUT /training/solicitudes/{id} — actualiza la solicitud y la deja seleccionada */
  actualizarSolicitudSesion(id: string, data: ActualizarSolicitudSesionData): Observable<SolicitudSesion | null> {
    this._loading.set(true);
    this._error.set(null);
    return this.solicitudesService.actualizarSolicitudSesion(id, data)
      .pipe(
        tap(res => { if (res) this.cargarSolicitudesSesion(); }), // refresca la tabla al editar
        catchError(() => {
          this._error.set('Error al actualizar la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
  }

  /** POST /training/solicitudes — crea la solicitud y la deja seleccionada */
  crearSolicitudSesion(data: CrearSolicitudSesionData): Observable<SolicitudSesion | null> {
    this._loading.set(true);
    this._error.set(null);
    return this.solicitudesService.crearSolicitudSesion(data)
      .pipe(
        tap(res => { if (res) this.cargarSolicitudesSesion(); }), // refresca la tabla al crear
        catchError(() => {
          this._error.set('Error al crear la solicitud de sesión');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
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
        if (res !== null) this.cargarSolicitudesSesion();
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
        if (res !== null) this.cargarSolicitudesSesion();
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
        if (res !== null) this.cargarSolicitudesSesion();
      });
  }

  /**
   * Descarga el PDF del GIL (GIL-F-014). Arma el body desde la solicitud
   * seleccionada y lo envía a ga-ms-reportes (POST /api/reportes/gil/pdf).
   */
  exportarGilPdf(): void {
    const s = this._solicitudSeleccionada();
    if (!s) {
      return;
    }
    const body = {
      gilId: String(s.id),
      numeroGil: s.numeroGil,
      regionalNombre: s.regionalNombre,
      centroNombre: s.centroCostosNombre,
      solicitante: s.solicitante,
      fecha: s.fechaSolicitud,
      items: (s.bienes ?? []).map(b => ({
        codigo: b.codigoSena,
        descripcion: b.descripcion,
        cantidad: String(b.cantidad),
        unidad: b.unidadMedida,
      })),
    };
    this._loading.set(true);
    this.solicitudesService.exportarGilPdf(body)
      .pipe(
        catchError(() => {
          this._error.set('Error al exportar el PDF del GIL');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe(blob => { if (blob) descargarBlob(blob, `gil_${s.numeroGil}.pdf`); });
  }
}
