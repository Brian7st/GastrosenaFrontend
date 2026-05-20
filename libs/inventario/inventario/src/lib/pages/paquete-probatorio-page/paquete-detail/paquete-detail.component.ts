import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import {
  PaqueteProbatorio,
  PaqueteEstado,
  TimelineEntry,
} from '../../../models/paquete.model';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    StatusBadgeComponent,
    LucideIconComponent,
    BackButtonComponent,
  ],
  templateUrl: './paquete-detail.component.html',
  styleUrl: './paquete-detail.component.scss',
})
export class PaqueteDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(PaqueteFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  paquete = this.facade.paqueteSeleccionado;
  loading = this.facade.loading;

  // ── Estado derivado ──────────────────────────────────────────────────────
  isCompleto = computed(() => {
    const p = this.paquete();
    return p ? p.documentos.every(d => d.vinculado) : false;
  });

  docsCompletados = computed(() => {
    const p = this.paquete();
    return p ? p.documentos.filter(d => d.vinculado).length : 0;
  });

  timeline = computed<TimelineEntry[]>(() => {
    const p = this.paquete();
    if (!p) return [];

    const entries: TimelineEntry[] = [];

    if (p.estado === 'incompleto') {
      entries.push({
        estado: 'Falta Asistencia',
        fecha: 'Pendiente de acción',
        activo: true,
        tipo: 'error',
        detalle: `Validación automática - ${p.fecha}`,
      });
    }

    if (p.estado === 'completo') {
      entries.push({
        estado: 'Completo',
        fecha: p.fecha,
        activo: true,
        tipo: 'success',
      });
    }

    if (p.estado === 'en_revision') {
      entries.push({
        estado: 'En revisión',
        fecha: p.fecha,
        activo: true,
        tipo: 'neutral',
      });
    }

    if (p.estado === 'archivado') {
      entries.push({
        estado: 'Archivado',
        fecha: p.fecha,
        activo: true,
        tipo: 'neutral',
      });
    }

    // Historical states
    if (p.estado !== 'borrador' && p.estado !== 'en_revision') {
      entries.push({
        estado: 'En revisión',
        fecha: p.fecha,
        activo: false,
        tipo: 'neutral',
      });
    }

    entries.push({
      estado: 'Borrador',
      fecha: p.fecha,
      activo: p.estado === 'borrador',
      tipo: 'neutral',
    });

    return entries;
  });

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: PaqueteEstado): string {
    const map: Record<PaqueteEstado, string> = {
      borrador: 'Borrador',
      en_revision: 'En revisión',
      completo: 'Completo',
      archivado: 'Archivado',
      incompleto: 'Incompleto',
    };
    return map[estado];
  }

  getEstadoVariant(estado: PaqueteEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<PaqueteEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      borrador: 'info',
      en_revision: 'warning',
      completo: 'success',
      archivado: 'info',
      incompleto: 'danger',
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
}
