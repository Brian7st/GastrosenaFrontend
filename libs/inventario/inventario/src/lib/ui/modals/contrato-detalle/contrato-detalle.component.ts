import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, LoadingSkeletonComponent } from '@restaurant/shared/ui';
import { Contrato, EstadoContrato } from '../../../models/contrato.model';

@Component({
  selector: 'restaurant-contrato-detalle',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingSkeletonComponent],
  templateUrl: './contrato-detalle.component.html',
  styleUrl: './contrato-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContratoDetalleComponent {
  @Input() contrato: Contrato | undefined;
  @Input() loading = false;
  @Output() cerrar = new EventEmitter<void>();

  getEstadoBadgeClass(estado: EstadoContrato): string {
    return estado === 'VIGENTE' ? 'badge--vigente' : 'badge--cerrado';
  }

  formatCurrency(value: number | null): string {
    if (value === null) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatPorcentaje(value: number | null): string {
    if (value === null) return '—';
    return `${(value * 100).toFixed(0)}%`;
  }
}
