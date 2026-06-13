import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ActaDocumentoComponent } from '../../../components/acta-documento/acta-documento.component';
import { ActaEstado } from '../../../models/acta.model';
import { ActasFacade } from '../../../data-access/actas.facade';

@Component({
  selector: 'restaurant-actas-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    StatusBadgeComponent,
    LucideIconComponent,
    BackButtonComponent,
    ActaDocumentoComponent,
  ],
  templateUrl: './actas-detail.component.html',
  styleUrl: './actas-detail.component.scss',
})
export class ActasDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(ActasFacade);

  acta    = this.facade.actaSeleccionada;
  loading = this.facade.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarActa(id);
    } else {
      this.router.navigate(['/app/inventario/actas']);
    }
  }

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: ActaEstado): string {
    const map: Record<ActaEstado, string> = {
      BORRADOR:         'Borrador',
      PENDIENTE_FIRMAS: 'Pendiente Firmas',
      FIRMADA:          'Firmada',
      REVISADA:         'Revisada',
      ARCHIVADA:        'Archivada',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ActaEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<ActaEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      BORRADOR:         'info',
      PENDIENTE_FIRMAS: 'warning',
      FIRMADA:          'success',
      REVISADA:         'success',
      ARCHIVADA:        'info',
    };
    return map[estado];
  }

  // ── Acciones ─────────────────────────────────────────────────────────────
  /** Avanza al estado indicado (p. ej. REVISADA → ARCHIVADA). */
  cambiarEstado(nuevoEstado: ActaEstado): void {
    const id = this.acta()?.id;
    if (id && nuevoEstado) this.facade.cambiarEstado(id, nuevoEstado);
  }

  /** Avanza el acta de FIRMADA → REVISADA usando el ID del instructor como revisorId provisional. */
  revisarActa(): void {
    const id           = this.acta()?.id;
    const instructorId = this.acta()?.instructorId ?? 'revisor-sena';
    if (id) {
      this.facade.revisarActa(id, instructorId);
    }
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/actas']);
  }
}
