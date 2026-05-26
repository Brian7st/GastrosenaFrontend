import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { EstadoGIL } from '../../../models/facturas.model';

@Component({
  selector: 'restaurant-gil-solicitud-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gil-solicitud-detail.component.html',
  styleUrl: './gil-solicitud-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GilSolicitudDetailPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  solicitud = this.facade.solicitudGIL;

  /** Ordered steps for the timeline */
  readonly STEPS: EstadoGIL[] = ['BORRADOR', 'EMITIDO', 'ENVIADO_PROVEEDOR', 'CERRADO'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/app/inventario/facturas']);
      return;
    }
    this.facade.cargarSolicitudGIL(id);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onEditar(): void {
    // TODO: navegar a la ruta de edición de la solicitud
  }

  onDescargarPDF(): void {
    // TODO: llamar a un servicio de exportación para descargar el PDF
  }

  onEnviarAprobacion(): void {
    // TODO: llamar a un método de la facade que cambie el estado
  }

  getStepState(step: EstadoGIL, currentStep: EstadoGIL): 'done' | 'active' | 'pending' {
    const stepIdx    = this.STEPS.indexOf(step);
    const currentIdx = this.STEPS.indexOf(currentStep);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  }

  formatMoney(value: number): string {
    return `$${value.toLocaleString('es-CO')}`;
  }

  getResponsableIniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
}
