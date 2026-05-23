import { Component, ChangeDetectionStrategy, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './solicitudes-detail.component.html',
  styleUrl: './solicitudes-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  solicitud     = this.facade.solicitudSeleccionada;
  loading       = this.facade.loading;
  solicitudId   = computed(() => this.solicitud()?.codigo ?? '');
  estadoActual  = computed(() => this.solicitud()?.estado ?? 'BORRADOR');
  fechaCreacion = computed(() => this.solicitud()?.fecha ?? '');
  totalEstimado = computed(() => this.solicitud()?.montoTotal ?? 0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.facade.cargarSolicitudById(idParam);
    } else {
      this.router.navigate(['/app/inventario/solicitudes-gil']);
    }
  }

  // ─── Helpers para el Timeline ───────────────────────────
  estados = ['BORRADOR', 'EMITIDO', 'ENVIADO_PROVEEDOR', 'CERRADO'];

  getIcon(estado: string): string {
    const iconos: Record<string, string> = {
      BORRADOR:          'edit_document',
      EMITIDO:           'hourglass_empty',
      ENVIADO_PROVEEDOR: 'local_shipping',
      CERRADO:           'check_circle',
    };
    return iconos[estado] || 'help';
  }

  isPast(estado: string): boolean {
    const currentIndex = this.estados.indexOf(this.estadoActual());
    const targetIndex  = this.estados.indexOf(estado);
    return targetIndex < currentIndex;
  }

  isActive(estado: string): boolean {
    return this.estadoActual() === estado;
  }

  // ─── Handlers de acciones ───────────────────────────────
  onVolver(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onEditar(): void {
    const id = this.solicitud()?.id;
    if (id) this.router.navigate(['/app/inventario/solicitudes-gil', id, 'editar']);
  }

  onDownloadPdf(): void {
    // Exportación PDF pendiente de integración HTTP
  }

  onEnviarAprobacion(): void {
    const codigo = this.solicitud()?.codigo;
    if (codigo) this.facade.cambiarEstado(codigo, 'EMITIDO');
  }
}
