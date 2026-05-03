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
  readonly STEPS: EstadoGIL[] = ['Borrador', 'Pendiente', 'Validado', 'Aprobado', 'Procesado'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? 'GIL-F-014-2024-001';
    this.facade.cargarSolicitudGIL(id);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onEditar(): void {
    console.log('Editando solicitud GIL...');
  }

  onDescargarPDF(): void {
    console.log('Descargando PDF...');
  }

  onEnviarAprobacion(): void {
    console.log('Enviando a aprobación...');
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
