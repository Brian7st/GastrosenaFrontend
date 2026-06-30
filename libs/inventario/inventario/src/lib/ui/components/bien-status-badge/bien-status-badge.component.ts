import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatusBadgeComponent } from '@restaurant/shared/ui';
import { EstadoBien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-status-badge',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <restaurant-status-badge 
      [label]="estado" 
      [variant]="variant">
    </restaurant-status-badge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienStatusBadgeComponent {
  @Input({ required: true }) estado!: EstadoBien;

  get variant(): 'success' | 'warning' | 'danger' | 'info' {
    switch (this.estado) {
      case 'Activo':
        return 'success';
      case 'Bajo Stock':
        return 'warning';
      case 'Agotado':
        return 'danger';
      case 'Inactivo':
        return 'info';
      default:
        return 'info';
    }
  }
}
