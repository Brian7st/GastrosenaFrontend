import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { Movimiento } from '../../../models/movimiento.model';
import { MOVIMIENTOS_MOCK } from '../../../models/movimiento.mock';

@Component({
  selector: 'restaurant-movimientos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    KpiCardComponent,
    DataTableComponent,
    LucideIconComponent,
    ButtonComponent,
    StatusBadgeComponent
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosListComponent {
  movimientos = signal<Movimiento[]>(MOVIMIENTOS_MOCK);
  getVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (estado) {
      case 'Completado': return 'success';
      case 'Pendiente': return 'warning';
      case 'Cancelado': return 'danger';
      default: return 'info';
    }
  }
}
