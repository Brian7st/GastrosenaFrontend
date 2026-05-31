import { Component, ChangeDetectionStrategy, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  templateUrl: './solicitudes-detail.component.html',
  styleUrl: './solicitudes-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  solicitud            = this.facade.solicitudSeleccionada;
  loading              = this.facade.loading;
  solicitudId          = computed(() => this.solicitud()?.numeroGil ?? '');
  estadoActual         = computed(() => this.solicitud()?.estado ?? 'BORRADOR');
  fechaCreacion        = computed(() => this.solicitud()?.fechaSolicitud ?? '');
  totalEstimado        = computed(() => this.solicitud()?.bienes?.reduce((acc, b) => acc + b.subtotal, 0) ?? 0);
  solicitanteIniciales = computed(() =>
    (this.solicitud()?.solicitante ?? '')
      .split(' ').slice(0, 2).map((w: string) => w[0] ?? '').join('').toUpperCase()
  );

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.facade.cargarSolicitudById(idParam);
    } else {
      this.router.navigate(['/app/inventario/solicitudes-gil']);
    }
  }

  // ─── Helpers para el Timeline ───────────────────────────
  estados = ['BORRADOR', 'EMITIDO', 'ENVIADO_PROVEEDOR', 'VERIFICADO', 'CERRADO'];

  getIcon(estado: string): string {
    const iconos: Record<string, string> = {
      BORRADOR:          'edit_document',
      EMITIDO:           'hourglass_empty',
      ENVIADO_PROVEEDOR: 'local_shipping',
      VERIFICADO:        'fact_check',
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
    // TODO: PDF export — tech debt
  }

  onEnviarAprobacion(): void {
    const id = this.solicitud()?.id;
    if (id) this.facade.cambiarEstado(String(id), 'EMITIDO');
  }

  // ─── Enviar a Proveedor (EMITIDO → ENVIADO_PROVEEDOR) ───────────────
  showEnviarProveedorForm = signal(false);
  proveedorDestinatarioId = signal('');
  fechaEnvio              = signal('');

  onToggleEnviarProveedor(): void {
    this.showEnviarProveedorForm.update(v => !v);
  }

  onConfirmarEnvioProveedor(): void {
    const id = this.solicitud()?.id;
    if (!id || !this.proveedorDestinatarioId() || !this.fechaEnvio()) return;
    this.facade.enviarAProveedor(String(id), {
      proveedorDestinatarioId: this.proveedorDestinatarioId(),
      fechaEnvio:              this.fechaEnvio(),
    });
    this.showEnviarProveedorForm.set(false);
  }
}
