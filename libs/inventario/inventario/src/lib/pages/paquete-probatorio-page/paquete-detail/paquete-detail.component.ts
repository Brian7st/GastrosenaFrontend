import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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

  // ── Estado derivado ──────────────────────────────────────────────────────
  isCompleto = computed(() => {
    const p = this.paquete();
    return p ? (!!p.actaId && !!p.requisicionId && p.registroAsistenciaAdjunto) : false;
  });

  /** El backend exige COMPLETO → REVISADO (revisar) antes de poder archivar. */
  readonly puedeRevisar = computed(() => this.paquete()?.estado === 'COMPLETO');

  /** Archivar solo es válido cuando el paquete está REVISADO. */
  readonly puedeArchivar = computed(() =>
    this.paquete()?.estado === 'REVISADO'
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
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'asistencia']);
    }
  }

  exportarPaquete(): void {
    const p = this.paquete();
    if (p) {
      this.facade.exportarPaquete(p.id);
    }
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
    if (tipo === 'requisicion') {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'requisicion']);
    } else if (tipo === 'asistencia') {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'asistencia']);
    } else if (tipo === 'acta' && p.actaId) {
      // El acta vive en su propia página: /app/inventario/actas/:id
      this.router.navigate(['/app/inventario/actas', p.actaId]);
    }
  }

  cambiarDocumento(tipo: string): void {
    const p = this.paquete();
    if (p) {
      this.router.navigate(['/app/inventario/paquete-probatorio', p.id, 'asistencia'], {
        queryParams: { tipo },
      });
    }
  }
}
