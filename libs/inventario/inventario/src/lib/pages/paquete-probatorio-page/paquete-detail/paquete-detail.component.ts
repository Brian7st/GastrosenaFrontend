import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import {
  PaqueteEstado,
  TimelineEntry,
} from '../../../models/paquete.model';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    StatusBadgeComponent,
    LucideIconComponent,
    ButtonComponent,
    BackButtonComponent
],
  templateUrl: './paquete-detail.component.html',
  styleUrl: './paquete-detail.component.scss',
})
export class PaqueteDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(PaqueteFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  paquete      = this.facade.paqueteSeleccionado;
  loading      = this.facade.loading;
  facadeError  = this.facade.error;

  // ── Formulario de trazabilidad (signal-based) ────────────────────────────
  readonly cufe         = signal('');
  readonly gilId        = signal('');
  readonly compromisoId = signal('');
  readonly errorTraz    = signal<string | null>(null);

  /** true si el paquete ya tiene trazabilidad registrada */
  readonly trazabilidadRegistrada = computed(() => {
    const p = this.paquete();
    return !!(p?.gilId && p?.cufeFuenteId);
  });

  /** El formulario de trazabilidad está completo */
  readonly trazabilidadCompleta = computed(() =>
    this.cufe().trim().length > 0 &&
    this.gilId().trim().length > 0 &&
    this.compromisoId().trim().length > 0
  );

  // ── Estado derivado ──────────────────────────────────────────────────────
  isCompleto = computed(() => {
    const p = this.paquete();
    return p ? (!!p.actaId && !!p.requisicionId && p.registroAsistenciaAdjunto) : false;
  });

  /** El backend exige COMPLETO → REVISADO (revisar) antes de poder archivar. */
  readonly puedeRevisar = computed(() => this.paquete()?.estado === 'COMPLETO');

  /** Archivar solo es válido en REVISADO y con la trazabilidad vinculada (RF-5.11.7). */
  readonly puedeArchivar = computed(() =>
    this.paquete()?.estado === 'REVISADO' && this.trazabilidadRegistrada()
  );

  docsCompletados = computed(() => {
    const p = this.paquete();
    if (!p) return 0;
    return (p.actaId ? 1 : 0) + (p.requisicionId ? 1 : 0) + (p.registroAsistenciaAdjunto ? 1 : 0);
  });

  timeline = computed<TimelineEntry[]>(() => {
    const p = this.paquete();
    if (!p) return [];

    const entries: TimelineEntry[] = [];

    if (p.estado === 'INCOMPLETO') {
      entries.push({
        estado: 'Falta documentación',
        fecha: 'Pendiente de acción',
        activo: true,
        tipo: 'error',
        detalle: `Validación automática - ${p.fecha ?? ''}`,
      });
    }

    if (p.estado === 'COMPLETO') {
      entries.push({
        estado: 'Completo',
        fecha: p.fecha ?? '',
        activo: true,
        tipo: 'success',
      });
    }

    if (p.estado === 'REVISADO') {
      entries.push({
        estado: 'Revisado',
        fecha: p.fecha ?? '',
        activo: true,
        tipo: 'success',
      });
    }

    if (p.estado === 'ARCHIVADO') {
      entries.push({
        estado: 'Archivado',
        fecha: p.fecha ?? '',
        activo: true,
        tipo: 'neutral',
      });
    }

    // Historical: show previous state if not INCOMPLETO
    if (p.estado !== 'INCOMPLETO') {
      entries.push({
        estado: 'Incompleto',
        fecha: p.fecha ?? '',
        activo: false,
        tipo: 'neutral',
      });
    }

    return entries;
  });

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: PaqueteEstado): string {
    const map: Record<PaqueteEstado, string> = {
      INCOMPLETO: 'Incompleto',
      COMPLETO:   'Completo',
      REVISADO:   'Revisado',
      ARCHIVADO:  'Archivado',
    };
    return map[estado];
  }

  getEstadoVariant(estado: PaqueteEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<PaqueteEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      INCOMPLETO: 'danger',
      COMPLETO:   'success',
      REVISADO:   'success',
      ARCHIVADO:  'info',
    };
    return map[estado];
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarPaquete(id);
    } else {
      this.router.navigate(['/app/inventario/paquete-probatorio']);
    }
  }

  // ── Navegación ─────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/paquete-probatorio']);
  }

  irAdjuntar(): void {
    const p = this.paquete();
    if (p) {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'adjuntar']);
    }
  }

  exportarPaquete(): void {
    const p = this.paquete();
    if (p) {
      this.facade.exportarPaquete(p.id);
    }
  }

  // ── Trazabilidad handlers ────────────────────────────────────────────────
  setCufe(e: Event): void {
    this.cufe.set((e.target as HTMLInputElement).value);
  }

  setGilId(e: Event): void {
    this.gilId.set((e.target as HTMLInputElement).value);
  }

  setCompromisoId(e: Event): void {
    this.compromisoId.set((e.target as HTMLInputElement).value);
  }

  vincularTrazabilidad(): void {
    const p = this.paquete();
    if (!p || !this.trazabilidadCompleta()) return;

    this.errorTraz.set(null);
    this.facade.vincularTrazabilidad(p.id, {
      cufeFuenteId:             this.cufe().trim(),
      gilId:                    this.gilId().trim(),
      compromisoPresupuestalId: this.compromisoId().trim(),
    });
    // facade.loading() refleja el estado — facade.error() expone errores del backend
  }

  /** Avanza el paquete de COMPLETO → REVISADO. revisorId provisional: el instructor del paquete. */
  revisarPaquete(): void {
    const p = this.paquete();
    if (p && this.puedeRevisar()) {
      this.facade.revisarPaquete(p.id, p.instructorId || 'revisor-sena');
    }
  }

  archivarExpediente(): void {
    const p = this.paquete();
    if (p && this.puedeArchivar()) {
      this.facade.archivarPaquete(p.id);
    }
  }

  verDocumento(tipo: string): void {
    const p = this.paquete();
    if (!p) return;
    // Solo 'requisicion' tiene ruta hija de detalle. Acta/asistencia aún no
    // exponen vista propia — evitamos navegar a una ruta inexistente (pantalla en blanco).
    if (tipo === 'requisicion') {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'requisicion']);
    }
  }

  cambiarDocumento(tipo: string): void {
    const p = this.paquete();
    if (p) {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'adjuntar'], {
        queryParams: { tipo },
      });
    }
  }
}
