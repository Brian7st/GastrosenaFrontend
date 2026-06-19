import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  DataTableComponent,
  StatusBadgeComponent,
  KpiCardComponent,
  ButtonComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { PaqueteFacade } from '../../../data-access/paquete.facade';
import { AsistenciaFacade } from '../../../data-access/asistencia.facade';
import {
  EstadoAsistencia,
  UsuarioResponseDTO,
  AsistenciaItemRequest,
} from '../../../data-access/api/legalization.api';

/** Estado de un aprendiz en la sesión actual. */
interface AprendizRow {
  aprendiz: UsuarioResponseDTO;
  nombreCompleto: string;
  estado: EstadoAsistencia;
}

@Component({
  selector: 'restaurant-paquete-asistencia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataTableComponent,
    StatusBadgeComponent,
    KpiCardComponent,
    ButtonComponent,
    LucideIconComponent,
    BackButtonComponent,
  ],
  templateUrl: './paquete-asistencia.component.html',
  styleUrl: './paquete-asistencia.component.scss',
})
export class PaqueteAsistenciaComponent implements OnInit {
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);
  private paqueteFacade    = inject(PaqueteFacade);
  private asistenciaFacade = inject(AsistenciaFacade);

  // ── Paquete ──────────────────────────────────────────────────────────────
  paquete = this.paqueteFacade.paqueteSeleccionado;
  loading = this.asistenciaFacade.loading;

  /** Nombre del instructor del paquete: usa el perfil del usuario logueado
   *  (GET /api/perfil) cuando es el mismo instructor; si no, cae al instructorId. */
  instructorNombre = computed(() => {
    const p = this.paquete();
    const perfil = this.asistenciaFacade.perfil();
    if (p && perfil && perfil.idUsuario === p.instructorId) {
      return `${perfil.nombre} ${perfil.apellidos}`.trim();
    }
    return p?.instructorId ?? '—';
  });

  // ── Fichas y aprendices (datos reales desde el facade) ───────────────────
  readonly fichasDisponibles = this.asistenciaFacade.fichas;
  private readonly aprendices = this.asistenciaFacade.aprendices;

  // ── Ficha seleccionada (se pre-carga desde el paquete) ──────────────────
  readonly fichaSeleccionadaNumero = signal<string>('');

  fichaSeleccionada = computed(() =>
    this.fichasDisponibles().find(f => f.numero === this.fichaSeleccionadaNumero()) ?? null
  );

  // ── Fecha de sesión ──────────────────────────────────────────────────────
  readonly fechaSesion = signal<string>(this._hoy());

  // ── Estado por aprendiz (aprendizId → estado). Fuente de verdad del llamado.
  private readonly _estados = signal<Record<string, EstadoAsistencia>>({});

  // ── Búsqueda ─────────────────────────────────────────────────────────────
  readonly searchText = signal<string>('');

  // ── Rows derivadas: aprendices reales + estado seleccionado ──────────────
  readonly rows = computed<AprendizRow[]>(() =>
    this.aprendices().map(a => ({
      aprendiz: a,
      nombreCompleto: `${a.nombre} ${a.apellidos}`.trim(),
      estado: this._estados()[a.idUsuario] ?? 'ASISTIO',
    }))
  );

  rowsFiltradas = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    if (!text) return this.rows();
    return this.rows().filter(r =>
      r.nombreCompleto.toLowerCase().includes(text) ||
      r.aprendiz.documento.includes(text)
    );
  });

  // ── KPIs ─────────────────────────────────────────────────────────────────
  kpiTotal     = computed(() => this.rows().length);
  kpiAsistio   = computed(() => this.rows().filter(r => r.estado === 'ASISTIO').length);
  kpiTarde     = computed(() => this.rows().filter(r => r.estado === 'TARDE').length);
  kpiExcusa    = computed(() => this.rows().filter(r => r.estado === 'EXCUSA').length);
  kpiNoAsistio = computed(() => this.rows().filter(r => r.estado === 'NO_ASISTIO').length);

  // Precarga la ficha del paquete una sola vez, cuando el paquete esté disponible.
  private _fichaInicializada = false;

  constructor() {
    // Precarga la ficha del paquete cuando el paquete esté disponible.
    effect(() => {
      const p = this.paquete();
      if (p && !this._fichaInicializada) {
        this._fichaInicializada = true;
        this.fichaSeleccionadaNumero.set(p.fichaId);
      }
    });

    // Carga los aprendices cada vez que cambia la ficha seleccionada.
    effect(() => {
      const numero = this.fichaSeleccionadaNumero();
      if (numero) {
        this.asistenciaFacade.cargarAprendicesPorFichaNumero(numero);
      }
    });

    // Prefill: si el paquete ya tiene una asistencia registrada, refleja sus estados.
    effect(() => {
      const registro = this.asistenciaFacade.asistencia();
      if (registro) {
        this._estados.set(
          Object.fromEntries(registro.items.map(i => [i.aprendizId, i.estado]))
        );
        this.fechaSesion.set(registro.fecha);
      }
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Vista de página completa: si el paquete no fue cargado por el detalle, lo
    // cargamos desde el :id de la ruta.
    const id = this.route.snapshot.paramMap.get('id');
    const actual = this.paquete();
    if (id && (!actual || actual.id !== id)) {
      this.paqueteFacade.cargarPaquete(id);
    }
    // Perfil del usuario logueado (para mostrar el nombre del instructor).
    this.asistenciaFacade.cargarPerfil();
    // Catálogo de fichas para el selector + asistencia previa (reabrir).
    this.asistenciaFacade.cargarFichas();
    if (id) {
      this.asistenciaFacade.cargarAsistencia(id);
    }
  }

  // ── Helpers de UI ─────────────────────────────────────────────────────────

  getIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getInicialesPaquete(): string {
    return this.getIniciales(this.instructorNombre());
  }

  estadoLabel(estado: EstadoAsistencia): string {
    const map: Record<EstadoAsistencia, string> = {
      ASISTIO:    'Asistió',
      TARDE:      'Tarde',
      EXCUSA:     'Excusa',
      NO_ASISTIO: 'No asistió',
    };
    return map[estado];
  }

  estadoVariant(estado: EstadoAsistencia): 'success' | 'warning' | 'info' | 'danger' {
    const map: Record<EstadoAsistencia, 'success' | 'warning' | 'info' | 'danger'> = {
      ASISTIO:    'success',
      TARDE:      'warning',
      EXCUSA:     'info',
      NO_ASISTIO: 'danger',
    };
    return map[estado];
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onFichaChange(event: Event): void {
    this._estados.set({});
    this.fichaSeleccionadaNumero.set((event.target as HTMLSelectElement).value);
  }

  onFechaChange(event: Event): void {
    this.fechaSesion.set((event.target as HTMLInputElement).value);
  }

  setEstado(aprendizId: string, estado: EstadoAsistencia): void {
    this._estados.update(estados => ({ ...estados, [aprendizId]: estado }));
  }

  marcarTodosAsistio(): void {
    this._estados.set(
      Object.fromEntries(this.aprendices().map(a => [a.idUsuario, 'ASISTIO' as EstadoAsistencia]))
    );
  }

  guardar(): void {
    const p = this.paquete();
    if (!p) return;

    const items: AsistenciaItemRequest[] = this.rows().map(r => ({
      aprendizId:     r.aprendiz.idUsuario,
      nombreAprendiz: r.nombreCompleto,
      documento:      r.aprendiz.documento,
      estado:         r.estado,
    }));

    this.asistenciaFacade.registrarAsistencia(p.id, {
      fichaId: this.fichaSeleccionadaNumero(),
      fecha:   this.fechaSesion(),
      items,
    });
  }

  cancelar(): void {
    const p = this.paquete();
    if (p) {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id]);
    } else {
      this.router.navigate(['/app/inventario/paquete-probatorio']);
    }
  }

  /** Botón de volver del header — regresa al detalle del paquete. */
  volver(): void {
    this.cancelar();
  }

  private _hoy(): string {
    return new Date().toISOString().split('T')[0];
  }
}
