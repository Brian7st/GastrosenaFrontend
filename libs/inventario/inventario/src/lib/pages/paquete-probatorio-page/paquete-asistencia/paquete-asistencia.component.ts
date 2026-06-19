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
import {
  MOCK_FICHAS,
  MOCK_APRENDICES,
} from '../../../models/asistencia.mock';

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

  // ── Fichas disponibles (mock hasta que el backend esté desplegado) ────────
  readonly fichasDisponibles = signal(MOCK_FICHAS);

  // ── Ficha seleccionada (se pre-carga desde el paquete) ──────────────────
  readonly fichaSeleccionadaNumero = signal<string>('');

  fichaSeleccionada = computed(() =>
    this.fichasDisponibles().find(f => f.numero === this.fichaSeleccionadaNumero()) ?? null
  );

  // ── Fecha de sesión ──────────────────────────────────────────────────────
  readonly fechaSesion = signal<string>(this._hoy());

  // ── Rows de aprendices con estado reactivo ───────────────────────────────
  private _rows = signal<AprendizRow[]>([]);

  // ── Búsqueda ─────────────────────────────────────────────────────────────
  readonly searchText = signal<string>('');

  rowsFiltradas = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    if (!text) return this._rows();
    return this._rows().filter(r =>
      r.nombreCompleto.toLowerCase().includes(text) ||
      r.aprendiz.documento.includes(text)
    );
  });

  // ── KPIs ─────────────────────────────────────────────────────────────────
  kpiTotal     = computed(() => this._rows().length);
  kpiAsistio   = computed(() => this._rows().filter(r => r.estado === 'ASISTIO').length);
  kpiTarde     = computed(() => this._rows().filter(r => r.estado === 'TARDE').length);
  kpiExcusa    = computed(() => this._rows().filter(r => r.estado === 'EXCUSA').length);
  kpiNoAsistio = computed(() => this._rows().filter(r => r.estado === 'NO_ASISTIO').length);

  // Precarga la ficha del paquete una sola vez, cuando el paquete esté disponible.
  private _fichaInicializada = false;

  constructor() {
    effect(() => {
      const p = this.paquete();
      if (p && !this._fichaInicializada) {
        this._fichaInicializada = true;
        this.fichaSeleccionadaNumero.set(p.fichaId);
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
    // Carga mock de aprendices (backend no desplegado aún)
    this._cargarAprendicesMock();
  }

  private _cargarAprendicesMock(): void {
    const rows: AprendizRow[] = MOCK_APRENDICES
      .filter(a => a.estado)
      .map(a => ({
        aprendiz: a,
        nombreCompleto: `${a.nombre} ${a.apellidos}`,
        estado: 'ASISTIO' as EstadoAsistencia,
      }));
    this._rows.set(rows);
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
    const p = this.paquete();
    return p ? this.getIniciales(p.instructorId) : '--';
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
    this.fichaSeleccionadaNumero.set((event.target as HTMLSelectElement).value);
  }

  onFechaChange(event: Event): void {
    this.fechaSesion.set((event.target as HTMLInputElement).value);
  }

  setEstado(aprendizId: string, estado: EstadoAsistencia): void {
    this._rows.update(rows =>
      rows.map(r =>
        r.aprendiz.idUsuario === aprendizId ? { ...r, estado } : r
      )
    );
  }

  marcarTodosAsistio(): void {
    this._rows.update(rows => rows.map(r => ({ ...r, estado: 'ASISTIO' as EstadoAsistencia })));
  }

  guardar(): void {
    const p = this.paquete();
    if (!p) return;

    const items: AsistenciaItemRequest[] = this._rows().map(r => ({
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
