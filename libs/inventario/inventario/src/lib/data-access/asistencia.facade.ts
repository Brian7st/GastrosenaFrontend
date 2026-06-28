import { inject, Injectable, signal, computed } from '@angular/core';
import { finalize, catchError, of } from 'rxjs';
import { AsistenciaService } from './services/asistencia.service';
import {
  FichaResponseDTO,
  UsuarioResponseDTO,
  AsistenciaResponse,
  RegistrarAsistenciaRequest,
  CorregirAsistenciaRequest,
} from './api/legalization.api';

@Injectable({ providedIn: 'root' })
export class AsistenciaFacade {
  private service = inject(AsistenciaService);

  // ── Estado interno ───────────────────────────────────────────────────────
  private _perfil       = signal<UsuarioResponseDTO | null>(null);
  private _fichas       = signal<FichaResponseDTO[]>([]);
  private _aprendices   = signal<UsuarioResponseDTO[]>([]);
  private _asistencia   = signal<AsistenciaResponse | null>(null);
  private _loading      = signal<boolean>(false);
  private _error        = signal<string | null>(null);

  // ── Exposición pública ───────────────────────────────────────────────────
  readonly perfil     = computed(() => this._perfil());
  readonly fichas     = computed(() => this._fichas());
  readonly aprendices = computed(() => this._aprendices());
  readonly asistencia = computed(() => this._asistencia());
  readonly loading    = computed(() => this._loading());
  readonly error      = computed(() => this._error());

  // ── Perfil ───────────────────────────────────────────────────────────────

  /** Carga el perfil del usuario logueado (para resolver su nombre). */
  cargarPerfil(): void {
    this.service.getPerfil()
      .pipe(catchError(() => of(null)))
      .subscribe(perfil => this._perfil.set(perfil));
  }

  // ── Fichas ───────────────────────────────────────────────────────────────

  cargarFichas(): void {
    this._loading.set(true);
    this.service.getFichas()
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar fichas');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._fichas.set(data));
  }

  // ── Aprendices ───────────────────────────────────────────────────────────

  /** Carga aprendices activos de una ficha dado su NÚMERO (no UUID).
   *  Resuelve internamente fichaNumero → fichaUUID antes de pedir aprendices. */
  cargarAprendicesPorFichaNumero(fichaNumero: string): void {
    this._loading.set(true);
    this.service.getFichaPorNumero(fichaNumero)
      .pipe(
        catchError(() => {
          this._error.set('Error al resolver la ficha por número');
          return of(null);
        })
      )
      .subscribe(ficha => {
        if (!ficha) {
          this._loading.set(false);
          return;
        }
        this.service.getAprendicesByFichaId(ficha.id)
          .pipe(
            catchError(() => {
              this._error.set('Error al cargar aprendices');
              return of([]);
            }),
            finalize(() => this._loading.set(false))
          )
          .subscribe(lista => this._aprendices.set(lista));
      });
  }

  // ── Asistencia ───────────────────────────────────────────────────────────

  registrarAsistencia(
    paqueteId: string,
    request: RegistrarAsistenciaRequest
  ): void {
    this._loading.set(true);
    this.service.registrarAsistencia(paqueteId, request)
      .pipe(
        catchError(() => {
          this._error.set('Error al registrar la asistencia');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this._asistencia.set(res); });
  }

  cargarAsistencia(paqueteId: string): void {
    this._loading.set(true);
    this.service.getAsistencia(paqueteId)
      .pipe(
        catchError(() => {
          this._error.set('Error al cargar la asistencia');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => this._asistencia.set(res));
  }

  actualizarAsistencia(
    paqueteId: string,
    request: CorregirAsistenciaRequest
  ): void {
    this._loading.set(true);
    this.service.actualizarAsistencia(paqueteId, request)
      .pipe(
        catchError(() => {
          this._error.set('Error al actualizar la asistencia');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => { if (res) this._asistencia.set(res); });
  }
}
